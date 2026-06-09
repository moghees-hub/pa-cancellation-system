# Email 3 — Cancellation Request Received (Workflow 3)

**Sent by:** Workflow 3, Step 5
**Trigger:** Cancellation form submission (inbound webhook from `cancel.html`)
**Attachment:** None

---

## Subject line
```
Cancellation request received — Ref {{reference}}
```

## Preheader (preview text)
```
We've logged your request. Team confirmation within 2 business days.
```

---

## HTML body

```html
<p>Hi {{first_name}},</p>

<p>We've received your cancellation request. This email is your confirmation that it has been logged in our system.</p>

<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:24px 0;width:100%;max-width:520px;border:1px solid #2A2A2A;border-left:3px solid #3DAA6F;border-radius:2px;background:#1C1C1C;color:#F4F4F4;">
  <tr>
    <td style="padding:14px 18px;border-bottom:1px solid #2A2A2A;font-size:13px;color:#888;letter-spacing:1px;text-transform:uppercase;">Reference</td>
    <td style="padding:14px 18px;border-bottom:1px solid #2A2A2A;font-size:15px;font-weight:600;color:#C9A84C;">{{reference}}</td>
  </tr>
  <tr>
    <td style="padding:14px 18px;border-bottom:1px solid #2A2A2A;font-size:13px;color:#888;letter-spacing:1px;text-transform:uppercase;">Submitted</td>
    <td style="padding:14px 18px;border-bottom:1px solid #2A2A2A;font-size:15px;">{{submitted_at}}</td>
  </tr>
  <tr>
    <td style="padding:14px 18px;border-bottom:1px solid #2A2A2A;font-size:13px;color:#888;letter-spacing:1px;text-transform:uppercase;">Programme</td>
    <td style="padding:14px 18px;border-bottom:1px solid #2A2A2A;font-size:15px;">{{programme}}</td>
  </tr>
  <tr>
    <td style="padding:14px 18px;font-size:13px;color:#888;letter-spacing:1px;text-transform:uppercase;">Payment date</td>
    <td style="padding:14px 18px;font-size:15px;">{{payment_date}} of each month</td>
  </tr>
</table>

<p><strong>What happens next</strong></p>

<p>A member of our team will review your request and email you within <strong>2 business days</strong> with:</p>

<ul>
  <li>The date your final payment will be collected</li>
  <li>The date your subscription officially ends</li>
  <li>A summary of your access until that date</li>
</ul>

<p>As per the terms you signed when joining, <strong>at least one final payment will be collected</strong> following this request, and that payment is not refundable.</p>

<p>Please retain this email and your reference number for your records. If you have any questions in the meantime, reply to this email.</p>

<p>Thank you for being part of Physique Academy.</p>

<p>
  <strong>Physique Academy</strong><br>
  Online Coaching
</p>
```

## Plain-text fallback

```
Hi {{first_name}},

We've received your cancellation request. This email is your
confirmation that it has been logged in our system.

  Reference:    {{reference}}
  Submitted:    {{submitted_at}}
  Programme:    {{programme}}
  Payment date: {{payment_date}} of each month

What happens next
-----------------
A member of our team will review your request and email you within
2 business days with:

  - The date your final payment will be collected
  - The date your subscription officially ends
  - A summary of your access until that date

As per the terms you signed when joining, at least one final
payment will be collected following this request, and that payment
is not refundable.

Please retain this email and your reference number for your records.
If you have any questions in the meantime, reply to this email.

Thank you for being part of Physique Academy.

Physique Academy
Online Coaching
```

---

## Merge variables used

All come from the inbound webhook payload posted by `cancel.html`. In GHL, map them via the workflow's webhook trigger step, or via custom fields after Workflow 3 Step 2.

| Token              | Source field (webhook)        |
| ------------------ | ----------------------------- |
| `{{first_name}}`   | `first_name`                  |
| `{{reference}}`    | `reference`                   |
| `{{submitted_at}}` | `submitted_at` (format before send: e.g. `14 May 2026, 10:15 BST`) |
| `{{programme}}`    | `programme`                   |
| `{{payment_date}}` | `payment_date` (e.g. `10`, render as `10th`) |

## Notes
- Format `submitted_at` to local time in the Zapier / GHL step before passing into the email — raw ISO 8601 reads badly.
- This is a transactional confirmation, not marketing — no unsubscribe footer needed.
- Workflow 3 Step 4 adds a full audit note to the contact at the same time; this email is just the client-facing receipt.
