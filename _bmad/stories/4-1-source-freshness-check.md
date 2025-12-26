# Story 4.1: Source Freshness Check

**Goal:** Ensure the reliability of the briefing content by validating that sources are recent (within 24 hours).

## User Story
As a system,
I want to verify that the news sources used are recent (within 24 hours),
So that users don't get outdated information.

## Acceptance Criteria
- [ ] The system can parse the date of a news source/article.
- [ ] News items older than 24 hours from the generation time are filtered out.
- [ ] Only fresh news is included in the briefing generation context.
- [ ] (Mock Implementation) Mock data should include timestamps, and the service should demonstrate filtering logic.

## Technical Notes
- **Backend:** Update `briefing-service.ts` to include `timestamp` in the raw news data structure.
- **Logic:** Add a `filterRecentNews(news[])` helper function.
- **Verification:** Create a test case (or log output) showing old news being dropped.
