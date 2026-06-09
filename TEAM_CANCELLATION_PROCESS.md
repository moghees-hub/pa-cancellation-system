# Physique Academy Cancellation Process

## Why we have this process

We need every cancellation request to come through a single official channel with a clear paper trail. The reasons are:

1. **Chargeback / dispute protection** — if a client later disputes a payment with Stripe or their bank, we need to prove they read the terms, acknowledged them, and submitted a cancellation request the right way. Without that proof we lose disputes.
2. **Consistency** — clients can't shop around the team trying to find someone who'll give them a different answer. One process, same outcome every time.
3. **Fairness to the client** — the form makes clear what they're agreeing to before they submit, so no surprises about the final payment.

All other channels (WhatsApp, email, verbal request to a coach) are **not valid** and should be politely redirected to the form.

---

## What the client has to do

1. **Visit the cancellation page**: physiqueacademy.com/refunds-policy
   (also reachable via physiqueacademy.com/cancel)

2. **Fill in the form**:
   - First name, last name
   - Email + phone
   - Current duration on the program (in months)
   - Which coach they're with
   - Reason for cancelling
   - Whether they'd be open to a lower-cost program with less 1-1 coaching
   - Any additional comments

3. **Tick three required acknowledgements**:
   - They've completed their 6-month minimum
   - They understand at least one final payment will still be collected
   - They understand this form is the only valid cancellation method

4. **Submit**

5. **They immediately get a confirmation email** with their unique cancellation reference (e.g. `CXL-AB12CD34`). They should keep this for their records.

6. **A team member contacts them within 2 business days** to confirm:
   - The exact date of their final payment
   - The date their subscription officially ends
   - That access continues until that end date

---

## What happens after submission — who gets what and what they do

### The client
**Receives**: confirmation email immediately with their cancellation reference (`CXL-XXXX`) and the 3 things they acknowledged.
**Does**: nothing further until a team member follows up within 2 business days.

### Bailey (cancellation admin)
**Receives**:
- Email notification in the Physique Academy GHL inbox
- Slack alert in `#cancellations`
**Does**:
- Within 2 business days, contact the client to confirm their final payment date and end date
- Process the cancellation in Stripe (set the subscription to cancel at period end)
- Update the client's `Cancellation Status` in GHL: `Requested` → `Confirmed` → `Completed`
- Check the tracker dashboard regularly to chase anyone who hasn't yet signed the cancellation policy

### The selected coach
**Receives**: in-app GHL notification that their client has requested cancellation.
**Does**:
- Bailey handles the admin, you don't need to action anything
- Optionally reach out for retention or a friendly send-off
- Do NOT promise refunds or override the policy (one final payment will still be collected)

### Management team (Jamie Gorse, Neil Chauhan, Sam Parker, Charlie Smith)
**Receives**: GHL notification for every cancellation request, regardless of which coach was selected.
**Does**:
- Spot patterns in `#cancellations` (e.g. multiple "Not connecting with my coach" responses → coach review)
- Handle escalations (medical, hardship, dispute risk)
- Review weekly volume + reasons

### George (owner)
**Receives**: full visibility via `#cancellations` Slack channel.
**Does**:
- Approve any policy exceptions
- Final call on edge cases

---

## What clients should be told (the key talking points)

- They must complete their **6-month minimum** before they can cancel.
- They must give **at least 1 calendar month's notice**, aligned with their payment date.
- **At least one final payment will still be collected** after they submit the request. This is not refundable.
- The **only valid way to cancel** is via the form at physiqueacademy.com/refunds-policy. WhatsApp messages, emails, or verbal requests to a coach do not count.

---

## Common scenarios

**"A client emailed me asking to cancel."**
Reply with the form link. Do not action the request via email. Example reply:
> "To cancel your subscription please complete the official cancellation form: physiqueacademy.com/refunds-policy. This is the only way we can process cancellations. You'll get a confirmation email within minutes and a team member will follow up within 2 business days."

**"A client is upset about the final payment."**
The 3 acknowledgements they ticked on the form make this clear before they submit. Refer them to the cancellation policy they signed at onboarding.

**"A client says they cancelled but we still charged them."**
Look them up by email in GHL. If they never submitted the form, the cancellation isn't on record and the charge was correct. If they did submit, escalate to Moghees.

**"A client wants a refund of the final payment."**
The final payment is non-refundable per the terms they agreed to at onboarding and re-confirmed on the cancellation form. Refer them to the policy.

---

Last updated: 2026-06-07
