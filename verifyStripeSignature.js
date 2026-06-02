const crypto = require('crypto');

const DEFAULT_TOLERANCE_SECONDS = 300;

function getHeader(headers, name) {
    if (!headers) {
        return undefined;
    }

    return headers[name] || headers[name.toLowerCase()];
}

function getRawBody(req) {
    if (Buffer.isBuffer(req.rawBody) || typeof req.rawBody === 'string') {
        return req.rawBody;
    }

    if (Buffer.isBuffer(req.body) || typeof req.body === 'string') {
        return req.body;
    }

    return undefined;
}

function parseStripeSignatureHeader(header) {
    return header.split(',').reduce(
        (acc, item) => {
            const separator = item.indexOf('=');

            if (separator === -1) {
                return acc;
            }

            const key = item.slice(0, separator);
            const value = item.slice(separator + 1);

            if (key === 't') {
                acc.timestamp = Number(value);
            }

            if (key === 'v1') {
                acc.signatures.push(value);
            }

            return acc;
        },
        { timestamp: undefined, signatures: [] },
    );
}

function timingSafeEqualHex(left, right) {
    if (typeof left !== 'string' || typeof right !== 'string') {
        return false;
    }

    const leftBuffer = Buffer.from(left, 'hex');
    const rightBuffer = Buffer.from(right, 'hex');

    if (leftBuffer.length !== rightBuffer.length) {
        return false;
    }

    return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function verifyStripeSignature(req, options = {}) {
    const secret = options.secret || process.env.STRIPE_WEBHOOK_SECRET;
    const signatureHeader = getHeader(req.headers, 'stripe-signature');
    const rawBody = getRawBody(req);
    const toleranceSeconds =
        options.toleranceSeconds ?? DEFAULT_TOLERANCE_SECONDS;

    if (!secret || !signatureHeader || rawBody === undefined) {
        return false;
    }

    const { timestamp, signatures } =
        parseStripeSignatureHeader(signatureHeader);

    if (!Number.isFinite(timestamp) || signatures.length === 0) {
        return false;
    }

    const now = options.now || Math.floor(Date.now() / 1000);

    if (
        toleranceSeconds !== null &&
        Math.abs(now - timestamp) > toleranceSeconds
    ) {
        return false;
    }

    const signedPayload = `${timestamp}.${rawBody.toString('utf8')}`;
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(signedPayload)
        .digest('hex');

    return signatures.some((signature) =>
        timingSafeEqualHex(signature, expectedSignature),
    );
}

module.exports = verifyStripeSignature;
