# Redis Update

Updated to latest version. See [release notes](https://github.com/redis/redis/releases) for details.

## Stripe webhook signature verification

`verifyStripeSignature(req)` expects the original raw request body on
`req.rawBody` or a string/Buffer `req.body`. Stripe signs the exact raw payload,
so parsing JSON before verification will invalidate the signature.
