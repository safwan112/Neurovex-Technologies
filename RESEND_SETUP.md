# Resend setup for the Neurovex contact form

The existing `/contact` and `/en/contact` forms call the server-only Astro
`submitContact` action. It sends one notification to `contact@neurovex.ma`
from `Neurovex Website <website@neurovex.ma>`. The visitor's address is the
Reply-To address. The action never puts `RESEND_API_KEY` into browser code.

## Production setup

1. Create or sign in to the Neurovex Resend account.
2. Add `neurovex.ma` as a sending domain in Resend.
3. Add the DNS records **shown by Resend** in the domain's DNS provider. Use
   those exact records; they are not stored or guessed in this repository.
4. Wait for Resend to report the domain as verified.
5. Create an API key with the narrowest available permission that permits
   sending email from this domain.
6. Add the key as the server-side production environment variable
   `RESEND_API_KEY` in the deployment platform. Do not prefix it with `PUBLIC_`
   or commit it to Git.
7. Confirm `website@neurovex.ma` is allowed as a From address by Resend.
8. Deploy the site and verify that the server action is included in the
   deployed Astro/Vercel output.
9. Submit one real test via `https://neurovex.ma/contact` using an address you
   control. Repeat on `/en/contact` only if bilingual routing needs checking.
10. Confirm the notification arrives at `contact@neurovex.ma`, including its
    plain-text and HTML content.
11. Click Reply and confirm the recipient is the visitor email used in the
    test. Do not use an unrelated person's email for testing.

An unverified domain, absent key, or provider rejection must leave the visitor
on the form with an error; it must never show a delivery success message.

## Abuse and operational follow-up

The action trims and validates fields, limits their lengths, applies a
16 KiB Content-Length guard when the header is present, and keeps a hidden
honeypot. These measures do not provide reliable per-IP rate limiting across
serverless instances. Configure rate limits and bot protection at the
deployment edge if the form receives abusive traffic. Avoid logging submitted
personal data or the Resend key. Monitor Resend delivery and suppression
events in the Resend dashboard.
