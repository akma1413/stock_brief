# Story 6.1: Real Stock Price Data

**Goal:** Fetch and display real stock quotes.

## User Story
As a user,
I want to see current stock prices,
So that my portfolio reflects reality.

## Acceptance Criteria
- [ ] **Library:** Use `yahoo-finance2` (already in package.json?). If not, install.
- [ ] **Service:** Update `briefing-service.ts` (or create `stock-data-service.ts`) to fetch quotes.
    - Input: Ticker symbol
    - Output: Price, Change %, Currency, Company Name?
- [ ] **Optimization:** Batch fetch if possible to avoid rate limits.
- [ ] **Fallback:** Handle API failures gracefully (e.g., maintain mock or show error).

## Technical Notes
- `yahoo-finance2` is a popular unofficial wrapper. It might be flaky in serverless environments without proper headers/cookies, but fine for MVP local.
