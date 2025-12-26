# Story 2.1: On-Demand Briefing Generation

Status: ready-for-dev

## Story

As a user,
I want to manually trigger the generation of my daily briefing,
so that I can get the latest updates on my portfolio immediately.

## Acceptance Criteria

1. **Given** a user has stocks in their portfolio
   **When** they click "Generate Briefing"
   **Then** the system fetches the latest data (mock or real) for those stocks.
2. **And** the system generates a textual summary (Markdown format) incorporating the stock data.
3. **And** the UI shows a "Generating..." loading state during the process.
4. **And** the final briefing is displayed in the "Briefing Content" area.
5. **And** if the portfolio is empty, the button is disabled or shows a prompt to add stocks.

## Tasks / Subtasks

- [ ] Backend (Server Actions/API)
  - [ ] Create `generateBriefing()` Server Action in `src/features/briefing/actions.ts`.
  - [ ] Implement a Mock Generator service (simulating LLM delay and output) to start.
  - [ ] Fetch user's portfolio tickers inside the action.
- [ ] UI Implementation
  - [ ] Create `BriefingGenerator` component (Button + Status).
  - [ ] Create `BriefingDisplay` component (Markdown renderer).
  - [ ] Integrate into `briefing/page.tsx`.

## Dev Notes

### Architecture
- **Service Layer:** `src/features/briefing/service.ts` -> `generateBriefingContent(tickers: string[])`.
- **Initial Implementation:** Use a robust Mock Generator that returns a structured Markdown string. This confirms the UI/UX flow before connecting a real paid LLM API.
- **State Management:** Use `useState` in the client component to handle the generated content string.

### Mock Data Format
```markdown
## Daily Briefing for [Date]

### 🍎 Apple (AAPL)
- **Price:** $185.20 (+1.2%)
- **News:** Apple released new Vision Pro features today...

### 🚗 Tesla (TSLA)
- **Price:** $240.50 (-0.5%)
- **News:** Cybertruck production ramps up...
```
