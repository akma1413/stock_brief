# Story 1.2: Manual Ticker Search

Status: ready-for-dev

## Story

As a user,
I want to search for stocks by ticker symbol or company name,
so that I can find the stocks I own to add them to my portfolio.

## Acceptance Criteria

1. **Given** a user is on the "Add Stock" screen (or dashboard search bar)
   **When** they enter a search term (e.g., "Apple" or "AAPL")
   **Then** the system queries a free financial API
2. **And** displays a list of matching stocks with:
   - Ticker Symbol (e.g., AAPL)
   - Company Name (e.g., Apple Inc.)
   - Exchange (e.g., NASDAQ)
3. **And** handles empty results or API errors gracefully (friendly error message).
4. **And** uses a debounced input to minimize API calls.

## Tasks / Subtasks

- [ ] API Integration
  - [ ] Research/Select free API (e.g., `yahoo-finance2` or similar reliable free tier).
  - [ ] Create `src/app/api/stocks/search/route.ts` Route Handler.
  - [ ] Implement search logic with error handling.
- [ ] UI Implementation
  - [ ] Create `src/features/portfolio/components/StockSearch.tsx` component.
  - [ ] Implement Debounced Input ( Shadcn Input + custom hook/utility).
  - [ ] Implement Search Results List (Ticket, Name, Add Button).
- [ ] Portfolio Feature Setup
  - [ ] Create `src/features/portfolio` directory structure.

## Dev Notes

### Architecture & Tech Stack
- **API:** Next.js Route Handlers (`/api/stocks/search?q=...`) to hide API keys (if any) and manage rate limits.
- **Library:** Consider `yahoo-finance2` for easy access to Yahoo Finance data without complex keys, or use a mock if unstable.
- **State:** Local state for search results is fine (no global store needed yet).

### Project Structure Notes
- `src/features/portfolio/`: New feature module.
- `src/lib/api/`: Optional helper for external API calls.

### References
- [Architecture](file:///Users/shin/stock_brief/_bmad-output/architecture.md)
