# Story 6.2: Real News Aggregation

**Goal:** Fetch recent news for context.

## User Story
As a system,
I need rich, recent news context,
So that I can summarize what happened.

## Acceptance Criteria
- [ ] **API:** Use a free/freemium news provider.
    - Candidate 1: **Yahoo Finance News** (via `yahoo-finance2` - easiest, no key).
    - Candidate 2: **Google Search / Bing Search** (requires key).
    - **Decision:** Start with Yahoo Finance News since we use it for quotes. It's free and aligned with tickers.
- [ ] **Service:** `fetchNews(ticker)` function.
- [ ] **Filter:** Last 24-48 hours only.

## Technical Notes
- `yahooFinance.search(ticker, { newsCount: 5 })` or `yahooFinance.quoteSummary(ticker, { modules: ['news'] })`.
