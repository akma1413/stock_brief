# Story 2.2: Briefing Dashboard (Overview List)

Status: ready-for-dev

## Story

As a user,
I want to see my daily briefing structured as a clear list with a market overview,
so that I can quickly scan the most important changes without reading a wall of text.

## Acceptance Criteria

1. **Given** the briefing has been generated
   **When** the result is displayed
   **Then** it is NOT just a markdown blob, but a structured UI.
2. **And** the top section shows a "1-Line Market Overview" (e.g., "Tech stocks rally, Energy falls").
3. **And** the main section is a List of Stocks.
4. **And** each stock item shows:
   - Ticker & Name
   - Today's Price Change (Green/Red color coding)
   - A short 1-sentence summary of *why* it moved.

## Tasks / Subtasks

- [ ] Backend / Service Update
  - [ ] Update `briefing-service.ts` to return **Structured Data (JSON)** instead of a string.
  - [ ] Define interface: `BriefingData { marketOverview: string, stocks: StockBriefing[] }`.
  - [ ] Update Mock Generator to produce this JSON.
- [ ] UI Implementation
  - [ ] Create `MarketOverview` component (Header).
  - [ ] Create `StockBriefingItem` component (Card/Row).
  - [ ] Update `BriefingGenerator` to parse/render this structured data.

## Dev Notes

### Data Structure
```typescript
interface StockBriefing {
  ticker: string;
  price: string;
  change: string; // e.g. "+1.2%"
  changeColor: 'green' | 'red' | 'grey';
  summary: string;
}

interface BriefingData {
  date: string;
  marketOverview: string;
  stocks: StockBriefing[];
}
```

This story transitions us from "text generation" to "UI generation".
