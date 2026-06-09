# Email 1 — Welcome + Billing Agreement (Workflow 1)

**Sent by:** Workflow 1 (Onboarding), Step 2
**Trigger:** New paying contact created
**Attachment:** `PA_Cancellation_Billing_Agreement.pdf`

---

## Subject line
```
Welcome to Physique Academy — please sign your billing agreement
```

## Preheader (preview text)
```
One quick form before we start: read and sign your 6-month coaching terms.
```

---

## HTML body

```html
<p>Hi {{contact.first_name}},</p>

<p>Welcome to Physique Academy. We're glad to have you on board, and your coach will be in touch shortly to start your programme.</p>

<p>Before we begin, please take a few minutes to <strong>read and sign your Cancellation &amp; Billing Agreement</strong> (attached). This document is part of your coaching agreement and covers:</p>

<ul>
  <li>Your <strong>6-month minimum commitment</strong></li>
  <li>How your rolling monthly subscription works after the 6 months</li>
  <li>The <strong>1 calendar month notice</strong> required to cancel</li>
  <li>How and when final payments are collected</li>
</ul>

<p style="margin: 28px 0;">
  <a href="{{signing_link}}"
     style="background:#C9A84C;color:#0A0A0A;padding:14px 28px;text-decoration:none;font-weight:600;letter-spacing:1px;text-transform:uppercase;border-radius:2px;">
     Sign Your Agreement
  </a>
</p>

<p>You can cancel anytime <em>after</em> your 6-month minimum term via our official cancellation form:<br>
<a href="https://physiqueacademy.com/cancel">physiqueacademy.com/cancel</a></p>

<p>If you have any questions about the terms, reply to this email or speak to your coach before signing.</p>

<p>Welcome to the team.</p>

<p>
  <strong>Physique Academy</strong><br>
  Online Coaching
</p>
```

## Plain-text fallback

```
Hi {{contact.first_name}},

Welcome to Physique Academy. We're glad to have you on board, and your
coach will be in touch shortly to start your programme.

Before we begin, please read and sign your Cancellation & Billing
Agreement (attached). This document is part of your coaching agreement
and covers:

  - Your 6-month minimum commitment
  - How your rolling monthly subscription works after the 6 months
  - The 1 calendar month notice required to cancel
  - How and when final payments are collected

Sign here: {{signing_link}}

You can cancel anytime AFTER your 6-month minimum term via our
official cancellation form:
https://physiqueacademy.com/cancel

If you have any questions about the terms, reply to this email or
speak to your coach before signing.

Welcome to the team.

Physique Academy
Online Coaching
```

---

## Merge variables used

| Token              | Source                                  |
| ------------------ | --------------------------------------- |
| `{{contact.first_name}}` | GHL standard contact field        |
| `{{signing_link}}` | Provided by signing tool (GHL Contracts / DocuSign / PandaDoc) at workflow runtime |

## Notes
- Attach `PA_Cancellation_Billing_Agreement.pdf` to the email send action.
- If using GHL Contracts: the `{{signing_link}}` token is `{{contract.url}}` — adjust to match your setup.
- Workflow 1 Step 4 logs `billing_terms_sent_at` immediately after this send.
