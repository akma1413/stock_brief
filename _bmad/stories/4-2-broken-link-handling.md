# Story 4.2: Broken Link Handling

**Goal:** Detect and handle broken source links to improve user experience.

## User Story
As a user,
I want to be notified if a source link is broken,
So that I don't encounter a frustrating 404 page.

## Acceptance Criteria
- [ ] Intercept clicks on source links in the briefing.
- [ ] (MVP) Simulate a link check or handle a specific "broken" mock URL.
- [ ] If the link is "broken", prevent navigation and show a Toast notification ("Source unavailable").
- [ ] If the link is valid, open in a new tab as usual.

## Technical Notes
- **UI:** Update `TermHighlighter` to handle link clicks.
- **Logic:** Add a `handleLinkClick` function.
- **Browsing:** Due to CORS, we might just simulate the check (e.g., if URL contains "broken").
- **Component:** Use Shadcn `useToast` hook for feedback.
