# Story 3.2: Dynamic Term Explanations

Status: ready-for-dev

## Story

As a user,
I want financial jargon (e.g., "Volatility", "Short") to be interactive,
so that I can tap them to get an AI-generated definition on demand.

## Acceptance Criteria

1. **Given** the briefing text
   **Then** financial terms are distinctively marked (e.g., dotted underline).
2. **When** I click/tap a marked term
   **Then** a Popover appears with a loading state.
3. **And** the system fetches an AI definition for that specific term in real-time.
4. **And** it displays the definition once loaded.

## Tasks / Subtasks

- [ ] Backend / Service
  - [ ] Update Mock Generator to wrap terms in syntax: `{Term}`.
  - [ ] Create `defineTerm(term)` Server Action (Mock AI Explanation).
- [ ] UI Component
  - [ ] Update `TermHighlighter` to parse `{Term}` syntax.
  - [ ] Create `TermPopover` component (Client Side).
      - [ ] Validates "Click" vs "Scroll" (standard click handler).
      - [ ] Fetches definition on open.

## Dev Notes

- **Markup:** Use `{}` for simplicity. e.g. "High {volatility} expected."
- **Interaction:** Click implies intent. Hover is too noisy for "On Demand" generation (and bad for mobile).
