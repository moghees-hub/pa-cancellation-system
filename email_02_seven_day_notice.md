# Email 2 — 7-Day Pre-Payment Notice (Workflow 2)

**Sent by:** Workflow 2, Step 2
**Trigger:** Stripe `invoice.upcoming` event (7 days before next renewal), routed via Zapier → GHL inbound webhook.
**Attachment:** None

---

## Subject line
```
Your Physique Academy payment of {{currency}}{{amount_due}} is due in 7 days
```

## Preheader (preview text)
```
Heads up — next charge on {{payment_date_display}}. Cancellation deadline inside.
```

---

## HTML body

```html
<p>Hi {{contact.first_name}},</p>

<p>This is your <strong>7-day advance notice</strong>. Your next Physique Academy payment will be collected as follows:</p>

<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:24px 0;width:100%;max-width:480px;border:1px solid #2A2A2A;border-radius:2px;background:#1C1C1C;color:#F4F4F4;">
  <tr>
    <td style="padding:14px 18px;border-bottom:1px solid #2A2A2A;font-size:13px;color:#888;letter-spacing:1px;text-transform:uppercase;">Amount</td>
    <td style="padding:14px 18px;border-bottom:1px solid #2A2A2A;font-size:15px;font-weight:600;">{{currency}}{{amount_due}}</td>
  </tr>
  <tr>
    <td style="padding:14px 18px;border-bottom:1px solid #2A2A2A;font-size:13px;color:#888;letter-spacing:1px;text-transform:uppercase;">Payment date</td>
    <td style="padding:14px 18px;border-bottom:1px solid #2A2A2A;font-size:15px;font-weight:600;">{{payment_date_display}}</td>
  </tr>
  <tr>
    <td style="padding:14px 18px;font-size:13px;color:#888;letter-spacing:1px;text-transform:uppercase;">Card on file</td>
    <td style="padding:14px 18px;font-size:15px;font-weight:600;">{{card_last4}}</td>
  </tr>
</table>

<p>No action is needed if you're happy to continue — your coaching carries on as usual.</p>

<p><strong>If you wish to cancel:</strong> submit your request via the official cancellation form on or before <strong>{{payment_date_display}}</strong>. Your {{payment_date_display}} charge will still be collected (per the terms you signed), but the following month's payment will not.</p>

<p style="margin: 28px 0;">
  <a href="https://physiqueacademy.com/cancel"
     style="background:#C9A84C;color:#0A0A0A;padding:14px 28px;text-decoration:none;font-weight:600;letter-spacing:1px;text-transform:uppercase;border-radius:2px;">
     Cancel Subscription
  </a>
</p>

<p style="font-size:13px;color:#888;">Cancellations submitted after {{payment_date_display}} will take effect one billing cycle later, in line with our 1-month notice policy.</p>

<p>Thanks for being part of Physique Academy.</p>

<p>
  <strong>Physique Academy</strong><br>
  Online Coaching
</p>
```

## Plain-text fallback

```
Hi {{contact.first_name}},

This is your 7-day advance notice. Your next Physique Academy payment
will be collected as follows:

  Amount:       {{currency}}{{amount_due}}
  Payment date: {{payment_date_display}}
  Card on file: {{card_last4}}

No action is needed if you're happy to continue — your coaching
carries on as usual.

If you wish to cancel: submit your request via the official
cancellation form on or before {{payment_date_display}}. Your
{{payment_date_display}} charge will still be collected (per the
terms you signed), but the following month's payment will not.

   https://physiqueacademy.com/cancel

Cancellations submitted after {{payment_date_display}} will take
effect one billing cycle later, in line with our 1-month notice
policy.

Thanks for being part of Physique Academy.

Physique Academy
Online Coaching
```

---

## Merge variables used

| Token                       | Source                                                                 |
| --------------------------- | ---------------------------------------------------------------------- |
| `{{contact.first_name}}`    | GHL standard contact field                                             |
| `{{currency}}`              | From webhook payload (e.g. `£`, `$`)                                   |
| `{{amount_due}}`            | From webhook payload (Stripe `amount_due` / 100, formatted)            |
| `{{payment_date_display}}`  | From webhook payload, formatted (e.g. `21 May 2026`)                   |
| `{{card_last4}}`            | From webhook payload (Stripe default_source last4) — optional, skip if not exposed |

## Notes
- The Zapier step that posts to GHL should pre-format `amount_due` and `payment_date_display` so the email template doesn't have to do math.
- The 7-day notice is the **legal hook for Section 4.1** of the billing agreement — every send should write `last_seven_day_notice_sent_at` to the contact record (Workflow 2, Step 3).
- Do **not** include "unsubscribe" / "stop emails" footer language on this — these are transactional billing notices, not marketing.
