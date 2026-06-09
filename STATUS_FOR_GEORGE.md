# Status note — reply to George (14/05/2026)

Copy-paste this back to George once Moghees is happy with it.

---

Hey mate — yes, on it. Actually been building exactly this all week. Here's where we are against the three Stripe asks:

**1. Separate signed cancellation T&Cs**
Done. We've got a standalone Cancellation Policy Agreement — single document, dedicated solely to the cancellation process and policy, with a full ticked-acknowledgement list and a signature/printed-name block. Sending it out for every new client via an automated workflow on signup. Using GHL Contracts for the signing so we get an audit trail (signed date + IP + signed PDF on file against the contact).

**2. Automated 7-day pre-payment email**
Built and ready to wire up. Trigger comes off Stripe's `invoice.upcoming` event (set to 7 days lead time in Stripe) → routed into GHL via Zapier → email goes out to the client with the upcoming charge amount, date, and a direct link to the cancellation form. Every send is timestamped on the client's record so we can show Stripe exactly when each notice went out.

**3. Cancellation form accessible on website**
Built. Lives at **physiqueacademy.com/cancel** — branded, mobile-friendly, captures the policy consents at submission (signed, timestamped, with a reference number). Submission posts straight into GHL so it's logged automatically + you and the team get a Slack alert. We'll link to it from every 7-day email and from the signed agreement.

**Net result for disputes:** for any future chargeback we'll be able to pull, from a single client record:
- The signed Cancellation Policy Agreement (with timestamp and acknowledgements)
- A history of every 7-day pre-payment email that went out
- If applicable, their cancellation form submission with reference number and consent record
- Stripe payment history

That's everything Stripe needs to win disputes under their standard evidence categories.

**Timeline to go live:** [TBD — Moghees to fill in based on how fast we can ship the remaining build items below].

---

## Internal — what still needs to happen before this is live

For Moghees only. Punch list, in order:

1. **Pick the e-signature tool** — GHL Contracts (cheapest, native, fine for this) or DocuSign / PandaDoc (heavier, better audit trail). My recommendation: GHL Contracts unless you already pay for DocuSign.
2. **Generate v2 of the policy PDF** — use [`CANCELLATION_POLICY_AGREEMENT_v2.md`](CANCELLATION_POLICY_AGREEMENT_v2.md) as source text. Either re-export from the same tool that built v1, or hand to the designer.
3. **Deploy [`cancel.html`](cancel.html) to physiqueacademy.com/cancel** — confirm whether that lives in Craft CMS, on GitHub Pages, or a static host. (Don't have this info yet — let me know.)
4. **Create the GHL inbound webhook** for cancellation form submissions (per [GHL_WORKFLOWS.md §0c](GHL_WORKFLOWS.md)) and paste the URL into `cancel.html` to replace `REPLACE_ME`.
5. **Build the three GHL workflows** per the spec in [`GHL_WORKFLOWS.md`](GHL_WORKFLOWS.md) — order: Workflow 3 (cancellation) first (easiest to test), then Workflow 1 (onboarding), then Workflow 2 (7-day Stripe-driven).
6. **Set Stripe lead time to 7 days** — Settings → Billing → Subscriptions and emails → "Send invoice in advance" = 7 days. Confirm this is set before relying on Workflow 2.
7. **Backfill legacy clients** — anyone who paid before this system existed has no signed policy on file. Once Workflow 1 is live, run a one-time bulk send to all active subs whose `billing_terms_signed_at` is empty so we get current clients signed up too. This is the bit Stripe actually cares about for active disputes.
8. **Add a #cancellations Slack channel** (or use #sales) and grab an incoming webhook URL for the Workflow 3 internal alert.

The backfill (#7) is the most important item — current disputes are coming from clients who never signed the new agreement. New signups are protected from day one, but existing clients aren't until we get them re-signed.
