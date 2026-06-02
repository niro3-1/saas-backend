// Updated JWT to include subscription tier metadata
// Example code here

// Structured logging implementation
const logger = require('some-logger');

function logJwtCreation(data) {
    logger.info('Creating JWT', { data });
}

// Call the logging function when creating JWT
logJwtCreation({ tier: 'premium', userId: '12345' });