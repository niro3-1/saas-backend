# Switch to Async + Queue

This change modifies the email service to use asynchronous processing with a queue for handling batch sends. The previous synchronous method has been replaced to improve performance and reliability.

## Changes:
- Updated send_email() to use async/await.
- Implemented a queue system for batch processing.
- Adjusted timeout settings accordingly.

## Benefits:
- Handles larger batches without timeouts.
- Improves overall service responsiveness.
