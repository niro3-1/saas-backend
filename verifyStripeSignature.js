// Code to verify Stripe-Signature header against STRIPE_WEBHOOK_SECRET

const crypto = require('crypto');

function verifyStripeSignature(req) {
    const signature = req.headers['stripe-signature'];
    const payload = JSON.stringify(req.body);
    const expectedSignature = crypto
        .createHmac('sha256', process.env.STRIPE_WEBHOOK_SECRET)
        .update(payload)
        .digest('hex');

    return signature === expectedSignature;
}

module.exports = verifyStripeSignature;