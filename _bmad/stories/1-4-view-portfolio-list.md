# Story 1.4: View Portfolio List

Status: ready-for-dev

## Story

As a user,
I want to view the list of stocks I have added to my portfolio,
so that I can manage my watchlist and confirm my selections.

## Acceptance Criteria

1. **Given** a user is logged in
   **When** they visit the Briefing/Dashboard page
   **Then** they see a list of stocks from their `user_portfolios` table.
2. **And** the list displays Ticker, Name, and Exchange for each stock.
3. **And** the list allows deleting/removing a stock (basic management).
4. **And** the list updates automatically when a new stock is added (via revalidation or state update).

## Tasks / Subtasks

- [ ] Data Fetching
  - [ ] Implement `getPortfolio()` in `src/features/portfolio/service.ts` (Server-side fetch).
- [ ] UI Implementation
  - [ ] Create `src/features/portfolio/components/PortfolioList.tsx`.
  - [ ] Display list of stocks.
  - [ ] Add "Remove" button with `deleteFromPortfolio` Server Action.
- [ ] Page Integration
  - [ ] Add `<PortfolioList />` to `src/app/(dashboard)/briefing/page.tsx` (using Suspense for loading state).

## Dev Notes

### Architecture & Tech Stack
- **Fetching:** Server Components (`page.tsx` or `PortfolioList` as async component) directly calling Supabase.
- **Actions:** Use `revalidatePath` after delete to refresh the list instantly.

### Project Structure Notes
- `src/features/portfolio/service.ts`: Dedicated data fetching layer.
