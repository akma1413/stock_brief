# Story 3.3: Source Toggle

**Goal:** Allow users to toggle the visibility of source citations to keep the view clean or verified.

## User Story

As a user,
I want to toggle the visibility of source citations,
So that I can choose between a clean view and a verified view.

## Acceptance Criteria

- [ ] A mechanism to toggle "Show Sources" is available in the UI (Briefing Controls).
- [ ] When "Show Sources" is OFF, citations are hidden.
- [ ] When "Show Sources" is ON, citations appear as clickable hyperlinks (e.g., [Bloomberg] -> opens URL).
- [ ] The preference is saved to user settings.
- [ ] Works for both Summary and Detailed Analysis views.

## Technical Notes

- **Data Format:** Sources should be embedded using Markdown link syntax: `[Source Name](URL)`.
- **Rendering:** Update `TermHighlighter` to parse and render these links as external anchors (`target="_blank"`).
- **Settings:** Add `showSources` boolean to `UserSettings`.
