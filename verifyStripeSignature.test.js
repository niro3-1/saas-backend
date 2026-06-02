const assert = require('assert');
const crypto = require('crypto');
const test = require('node:test');

const verifyStripeSignature = require('./verifyStripeSignature');

function signPayload(payload, secret, timestamp) {
    return crypto
        .createHmac('sha256', secret)
        .update(`${timestamp}.${payload}`)
        .digest('hex');
}

test('accepts a valid Stripe v1 signature for the raw request body', () => {
    const secret = 'whsec_test_secret';
    const payload = '{"id":"evt_123","type":"checkout.session.completed"}';
    const timestamp = 1_700_000_000;
    const signature = signPayload(payload, secret, timestamp);

    const result = verifyStripeSignature(
        {
            headers: {
                'stripe-signature': `t=${timestamp},v1=${signature}`,
            },
            rawBody: payload,
        },
        { secret, now: timestamp },
    );

    assert.strictEqual(result, true);
});

test('rejects an invalid Stripe signature', () => {
    const secret = 'whsec_test_secret';
    const payload = '{"id":"evt_123"}';
    const timestamp = 1_700_000_000;

    const result = verifyStripeSignature(
        {
            headers: {
                'stripe-signature': `t=${timestamp},v1=bad_signature`,
            },
            rawBody: payload,
        },
        { secret, now: timestamp },
    );

    assert.strictEqual(result, false);
});

test('rejects requests without a raw body', () => {
    const result = verifyStripeSignature(
        {
            headers: {
                'stripe-signature': 't=1700000000,v1=unused',
            },
            body: { id: 'evt_123' },
        },
        { secret: 'whsec_test_secret', now: 1_700_000_000 },
    );

    assert.strictEqual(result, false);
});

test('rejects stale signatures outside the tolerance window', () => {
    const secret = 'whsec_test_secret';
    const payload = '{"id":"evt_123"}';
    const timestamp = 1_700_000_000;
    const signature = signPayload(payload, secret, timestamp);

    const result = verifyStripeSignature(
        {
            headers: {
                'stripe-signature': `t=${timestamp},v1=${signature}`,
            },
            rawBody: payload,
        },
        { secret, now: timestamp + 301 },
    );

    assert.strictEqual(result, false);
});
