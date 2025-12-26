# Story 5.2: Korean Localization (한국어화)

**Goal:** Translate the entire service into Korean.

## User Story
As a Korean user,
I want all content to be in Korean,
So that I can use the app naturally.

## Acceptance Criteria
- [ ] **Static UI:** Translate "Daily Briefing", "Add Stock", "My Portfolio", "Generate", etc.
- [ ] **Alerts/Toasts:** Translate success/error messages.
- [ ] **Mock Content:** Update `briefing-service.ts` to return Korean text for summaries and reasons.
- [ ] **Term Explanations:** Provide definitions in Korean.

## Technical Notes
- **Approach:** Since it's MVP, hardcode Korean strings directly in components and service. No need for `i18n` library yet.
