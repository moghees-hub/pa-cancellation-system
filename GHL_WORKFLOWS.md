# PA Cancellation System — GHL Workflow Specs

Companion to `cancel.html` and `PA_Cancellation_Billing_Agreement.pdf`.

Purpose: build a verifiable evidence trail (timestamps + consents) for every member, so any future Stripe / card-issuer dispute can be answered with: signed agreement, 7-day pre-payment notices, and (where applicable) the cancellation form submission record.

---

## 0. One-time setup in GHL

### 0a. Custom contact fields

Add these under **Settings → Custom Fields → Contact**. Use the API names exactly as listed — workflows below reference them.

| Label                              | API name                            | Type     |
| ---------------------------------- | ----------------------------------- | -------- |
| Programme                          | `programme`                         | Text     |
| Programme Start Date               | `programme_start_date`              | Date     |
| Payment Date (Day of Month)        | `payment_date_day`                  | Number   |
| Coach                              | `coach_name`                        | Text     |
| Billing Terms Sent At              | `billing_terms_sent_at`             | DateTime |
| Billing Terms Signed At            | `billing_terms_signed_at`           | DateTime |
| Last 7-Day Notice Sent At          | `last_seven_day_notice_sent_at`     | DateTime |
| Cancellation Requested At          | `cancellation_requested_at`         | DateTime |
| Cancellation Reference             | `cancellation_reference`            | Text     |
| Cancellation Reason                | `cancellation_reason`               | Text     |
| Cancellation Reason Detail         | `cancellation_reason_detail`        | Long text|
| Cancellation Status                | `cancellation_status`               | Dropdown — `Requested` / `Confirmed` / `Completed` |

### 0b. Tags

Create these tags (Settings → Tags):

- `billing-terms-sent`
- `billing-terms-signed`
- `cancellation-requested`
- `cancellation-confirmed`

### 0c. Inbound webhook (for the form)

1. **Automation → Workflows → New Workflow → Start from scratch**.
2. Add **Trigger: Inbound Webhook**.
3. Click **Sample Request** — paste the JSON sample below into "Sample Payload" so GHL learns the field shape.
4. Save the trigger; copy the **Webhook URL**.
5. Paste it into `cancel.html` at the line:
   ```js
   const WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/REPLACE_ME';
   ```

Sample payload (matches what `cancel.html` posts):

```json
{
  "reference": "PA-ABC123XYZ",
  "submitted_at": "2026-05-14T10:15:30.000Z",
  "first_name": "James",
  "last_name": "Williams",
  "full_name": "James Williams",
  "email": "james@example.com",
  "phone": "+447700000000",
  "payment_date": "10",
  "programme": "Online Coaching - Monthly",
  "start_date": "2025-10-10",
  "coach_name": "George",
  "reason_category": "Financial reasons",
  "reason_detail": "Tightening budget for next 6 months.",
  "consent_minimum_term_confirmed": true,
  "consent_final_payment_accepted": true,
  "consent_form_only_acknowledged": true,
  "source": "physiqueacademy.com/cancel",
  "user_agent": "Mozilla/5.0 ...",
  "page_url": "https://physiqueacademy.com/cancel"
}
```

---

## Workflow 1 — Onboarding (new client signs up)

**Goal:** capture signature on Billing Agreement + log the timestamp the terms were sent.

### Trigger
- **Form Submitted** → form: **Physique Academy Questionnaire** (ID `VMIsm1wIzG0rq2vpTDRK`).
- Filter: only run if `billing_terms_sent_at` is empty (prevents re-firing on existing clients or duplicate submissions).
- Decision locked 14/05/2026: onboarding form is mandatory for every paying client (it's how coach pairing happens), so it's the most reliable trigger.

### Steps

1. **Update Contact Field** → set `programme_start_date` = `{{event.created_date}}` if empty.
2. **Send Email** — "Welcome to Physique Academy — Action Required".
   - Attach `PA_Cancellation_Billing_Agreement.pdf`.
   - Body must include a signing link (see step 3 method).
3. **Send for E-Signature via GHL Contracts** (Sites → Contracts).
   - Decision locked 14/05/2026: GHL native signing, audit trail stored on the contact record.
4. **Update Contact Field** → `billing_terms_sent_at` = `{{current_datetime_iso}}`.
5. **Add Tag** → `billing-terms-sent`.
6. **Add Note to Contact** →
   > Billing & Cancellation Agreement (v1.0) sent for signature at {{current_datetime_iso}}. Document includes 6-month commitment, 1-month notice, final-payment terms.
7. **Wait** — up to 7 days for signed-document webhook from signing tool.
8. **On Signed event** (separate sub-trigger or branch):
   - Update `billing_terms_signed_at` = `{{event.signed_at}}`.
   - Add Tag `billing-terms-signed`.
   - Add Note: `Billing & Cancellation Agreement signed at {{event.signed_at}}. Signed PDF on file.`
   - Attach the signed PDF to the contact (Documents tab).
9. **If not signed within 7 days** → email reminder + internal Slack alert to coach.

### Confirmation email body (Step 2)
```
Hi {{contact.first_name}},

Welcome to Physique Academy. Before we begin, please read and sign the
attached Cancellation & Billing Agreement. This sets out your 6-month
minimum commitment, the 1-month cancellation notice requirement, and
how billing works after your minimum term.

Sign here: {{signing_link}}
Cancel anytime (after 6 months): https://physiqueacademy.com/cancel

If you have questions, reply to this email or speak to your coach.

— Physique Academy
```

---

## Workflow 2 — 7-day pre-payment notice

**Goal:** every billing cycle, every active subscriber gets an automated email 7 days before charge, with the cancellation link. Failure to read it is not grounds for a dispute (per Section 4 of the agreement).

### Architecture
Stripe is the source of truth for renewal dates, so the trigger must come from Stripe.

**Recommended:** Stripe → Zapier → GHL inbound webhook.

1. In Stripe Dashboard → **Settings → Billing → Subscriptions and emails** → set **"Send invoice with subscription details" = 7 days in advance**. This makes Stripe fire the `invoice.upcoming` webhook 7 days before each renewal.
2. In Zapier:
   - Trigger: **Stripe → New Upcoming Invoice**.
   - Action: **Webhooks → POST** to a second GHL inbound webhook (create another Workflow with Inbound Webhook trigger named "Stripe 7-Day Notice").
   - Payload to GHL:
     ```json
     {
       "stripe_customer_id": "{{customer.id}}",
       "email": "{{customer.email}}",
       "amount_due": "{{amount_due}}",
       "currency": "{{currency}}",
       "payment_date_iso": "{{next_payment_attempt}}"
     }
     ```

### Workflow steps (GHL side)

1. **Find Contact** by `email`. If no match, exit (legacy / non-GHL customer).
2. **Send Email** — "Your next Physique Academy payment is due in 7 days".
3. **Update Contact Field** → `last_seven_day_notice_sent_at` = `{{current_datetime_iso}}`.
4. **Add Note to Contact** →
   > 7-day pre-payment notice sent at {{current_datetime_iso}} — £{{amount_due}} due {{payment_date_iso}}. Cancellation link included.

### Email body
```
Hi {{contact.first_name}},

This is your 7-day advance notice. Your next Physique Academy
payment of {{currency}}{{amount_due}} will be collected on
{{payment_date_iso}}.

If you wish to cancel BEFORE the cycle that follows, you must
submit your cancellation request via the official form on or
before {{payment_date_iso}}:

   https://physiqueacademy.com/cancel

Cancellation requests submitted after that date will take effect
one billing cycle later, per the terms you signed.

— Physique Academy
```

**Important wording:** the deadline date in the email = the upcoming payment date itself. This is the last day to submit cancellation to stop the *next* charge after that. The charge on `{{payment_date_iso}}` will still be collected — this matches policy section 3.5.

---

## Workflow 3 — Cancellation form submission

**Goal:** capture the form submission, log everything, confirm to client, alert internal team.

### Trigger
- **Inbound Webhook** (the one from Setup 0c).

### Steps

1. **Find / Create Contact** by `{{email}}`.
   - If found: update existing.
   - If not found: create new contact with `first_name` / `last_name` / `phone`.
2. **Update Contact Fields**:
   - `cancellation_requested_at` = `{{submitted_at}}`
   - `cancellation_reference` = `{{reference}}`
   - `cancellation_reason` = `{{reason_category}}`
   - `cancellation_reason_detail` = `{{reason_detail}}`
   - `cancellation_status` = `Requested`
   - `payment_date_day` = `{{payment_date}}`
   - `programme` = `{{programme}}`
   - `programme_start_date` = `{{start_date}}`
   - `coach_name` = `{{coach_name}}`
3. **Add Tag** → `cancellation-requested`.
4. **Add Note to Contact** (full audit record):
   > **Cancellation Request Received**
   > Reference: {{reference}}
   > Submitted: {{submitted_at}}
   > Programme: {{programme}} (started {{start_date}})
   > Payment date: {{payment_date}} of each month
   > Coach: {{coach_name}}
   > Reason: {{reason_category}}
   > Detail: {{reason_detail}}
   > Consents — minimum term: {{consent_minimum_term_confirmed}}, final payment: {{consent_final_payment_accepted}}, form-only: {{consent_form_only_acknowledged}}
   > Source: {{source}} ({{user_agent}})
5. **Send Email to Client** — "Cancellation Request Received — {{reference}}":
   ```
   Hi {{first_name}},

   We've received your cancellation request.

   Reference:    {{reference}}
   Submitted:    {{submitted_at}}
   Programme:    {{programme}}
   Payment date: {{payment_date}} of each month

   What happens next:
   A team member will review your request and email you within 2
   business days to confirm your final payment date and the date
   your subscription officially ends.

   As per the terms you signed, at least one final payment will be
   collected following this request. Refunds for that payment are
   not available.

   Please keep this email for your records.

   — Physique Academy
   ```
6. **Send Internal Slack Alert** — use **Slack** action or a Webhook to a Slack incoming webhook URL.
   - Channel: `#cancellations` (new channel, decision locked 14/05/2026).
   - Message:
     ```
     Cancellation request received

     Client: {{full_name}} ({{email}})
     Coach:  {{coach_name}}
     Programme: {{programme}}, started {{start_date}}
     Payment date: {{payment_date}} of each month
     Reason: {{reason_category}}
     Detail: {{reason_detail}}
     Reference: {{reference}}

     Action: review, confirm to client within 2 business days, schedule Stripe cancellation after final payment.
     ```
7. **Create Internal Task** (assigned to admin / ops):
   - Title: `Process cancellation: {{full_name}} ({{reference}})`
   - Due: +2 business days
   - Description: link to contact record.

---

## Where the dispute evidence lives

For any future chargeback, the case file should pull:

1. Signed `PA_Cancellation_Billing_Agreement.pdf` — from contact's Documents tab (Workflow 1, Step 8).
2. `billing_terms_signed_at` timestamp — proves they accepted terms before being charged.
3. Note history of all `last_seven_day_notice_sent_at` events — proves Section 4.1 advance notices were sent.
4. If applicable: `cancellation_requested_at` + reference + cancellation form note — proves they used the official method (or that they didn't).
5. Stripe payment history — confirms charges align with the signed schedule.

All five sit on the contact record. Export as PDF for the dispute response.

---

## Build order

1. Add custom fields + tags (Setup 0a, 0b).
2. Create the cancellation Inbound Webhook (0c), paste URL into `cancel.html`, deploy the page.
3. Build Workflow 3 first — test end-to-end with a real form submission to yourself.
4. Build Workflow 1 (onboarding) — test by adding a new test contact.
5. Stand up the Stripe → Zapier → GHL pipe for Workflow 2 last — needs the most testing because it touches live billing data.

---

## Notes / open items

- **Stripe "7 days" setting** — confirm in your live Stripe account before relying on `invoice.upcoming` cadence; older accounts may default to a different lead time.
- **Legacy customers** — anyone who paid before this system existed has no signed agreement on file. Workflow 1 can be retro-applied by a one-time bulk send: filter contacts with `billing_terms_signed_at` empty and trigger the onboarding email.
- **Cancellation URL** — `cancel.html` will be served at `physiqueacademy.com/cancel`. Confirm DNS / hosting target (Craft CMS, GitHub Pages, or static host).
- **Webhook URL placeholder** in `cancel.html` is `REPLACE_ME` — must be swapped before going live.
