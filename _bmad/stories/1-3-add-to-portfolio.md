# Story 1.3: Add to Portfolio

Status: ready-for-dev

## Story

As a user,
I want to add a searched stock to my portfolio,
so that I can receive daily briefings about it.

## Acceptance Criteria

1. **Given** a user has found a stock in the search results
   **When** they click the "Add" button
   **Then** the stock is added to their `user_portfolios` in the database
2. **And** the UI updates to show the stock is added (e.g., button changes to "Added").
3. **And** duplicate additions are prevented (if already in portfolio, button should be disabled or handle gracefully).
4. **And** appropriate error handling (e.g., network error, auth error) is in place.

## Tasks / Subtasks

- [ ] Database Setup
  - [ ] Create `user_portfolios` table in Supabase (SQL migration/script).
    - `id` (UUID, primary key)
    - `user_id` (UUID, foreign key to auth.users)
    - `ticker` (String)
    - `name` (String, optional but good for display)
    - `exchange` (String)
    - `created_at` (Timestamp)
  - [ ] Set up RLS policies (Users can only select/insert/delete their own rows).
- [ ] Backend Implementation
  - [ ] Create `src/app/api/portfolio/route.ts` (POST) or Server Action.
  - [ ] Implement insert logic using Supabase Client.
- [ ] UI Implementation
  - [ ] Update `StockSearch.tsx` to handle "Add" click.
  - [ ] Call API/Action and manage loading/success state.
  - [ ] (Optional) Optimistic UI update.

## Dev Notes

### Architecture & Tech Stack
- **Database:** Supabase PostgreSQL.
- **RLS:** Critical for security. `auth.uid() = user_id`.
- **API:** Simple POST request to `/api/portfolio` is sufficient.

### Project Structure Notes
- `src/features/portfolio/hooks/use-add-stock.ts`: Optional hook for mutation logic.

### References
- [Architecture](file:///Users/shin/stock_brief/_bmad-output/architecture.md)
