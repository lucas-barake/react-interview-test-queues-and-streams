## The Problem

You're building a chat application similar to Slack or Discord. While messages have a `readAt: DateTime | null` property, the front-end needs to mark them as read.

## Context

The application displays messages in a scrollable feed. When a message becomes visible and the user has actively viewed it (i.e., the document is in focus), we need to mark it as read on the server. However, sending individual requests for each message would overwhelm the server.

## Core Requirements

Your solution should implement a read status tracking system that batches updates based on two triggers: either reaching 25 messages or a 5-second time window, whichever comes first. The system should handle network failures gracefully and ensure no messages are incorrectly marked as read.

As messages scroll into view while the document is in focus, the UI should optimistically mark them as read. These status updates need to be batched and sent to the server efficiently.

## Technical Challenges

The system must be resilient to network failures. When a batch update fails, implement a retry mechanism with exponential backoff, starting at 500ms and doubling with each attempt, up to 3 retries. During network outages, failed batches should be queued and automatically retried when connectivity resumes.

If a batch fails all retry attempts, the system should reset the read status of affected messages and make them eligible for future batching.

## Testing Scenarios

Your solution will be tested under various conditions:

- Rapid scrolling through many messages
- Browser tab switching while messages are being processed
- Network disconnections during batch processing
- Recovery after extended offline periods

## Time Limit

You have 1 hour to implement this solution. Focus on building a robust system that handles edge cases gracefully while maintaining clean, maintainable code.

## Evaluation Criteria

Your solution will be evaluated on its resilience to network issues, proper use of React patterns, memory management, and overall code organization. We're particularly interested in how you handle race conditions and edge cases.
