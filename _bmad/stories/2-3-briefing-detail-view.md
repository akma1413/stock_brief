# Story 2.3: Briefing Detail View

Status: ready-for-dev

## Story

As a user,
I want to click on a stock in the briefing list to see a detailed report,
so that I can understand the specific news and market dynamics affecting that stock in depth.

## Acceptance Criteria

1. **Given** the briefing dashboard is displayed
   **When** I click on a stock card
   **Then** a Detail View (Modal or Panel) opens.
2. **And** the view displays the Stock Name and Ticker prominently.
3. **And** it displays a "Detailed Reason" section (longer than the dashboard summary).
4. **And** it displays a list of "Key Events/News" related to today's movement.
5. **And** I can close the view to return to the dashboard.

## Tasks / Subtasks

- [ ] Backend / Service Update
  - [ ] Update `StockBriefing` interface to include `details` (long text) and `keyEvents` (array of strings).
  - [ ] Update Mock Generator to populate these new fields.
- [ ] UI Implementation
  - [ ] Create `StockDetailModal` (using Shadcn Dialog).
  - [ ] Make `StockBriefingCard` clickable.
  - [ ] Wire up state in `BriefingDashboard` to track `selectedStock`.

## Dev Notes

### Data Structure Update
```typescript
interface StockBriefing {
  // ... existing fields
  detailedAnalysis: string;
  relatedNews: string[];
}
```

### UX
- Use a **Dialog** (Modal) for the detail view.
- Content should look like a mini-report.
