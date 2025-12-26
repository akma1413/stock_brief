# Story 5.1: Design Overhaul (Mobile-First & Typography)

**Goal:** Refine the UI for a premium, readable, mobile-first experience.

## User Story
As a user,
I want the app to look and feel like a high-quality mobile app,
So that the reading experience is comfortable and focused.

## Acceptance Criteria
- [ ] **Layout:** Enforce `max-w-[480px]` and `mx-auto` on the root container to simulate a mobile app on desktop.
- [ ] **Typography:**
    - Increase base font size (e.g., `text-base` -> `text-lg` or generic scale up).
    - Ensure high contrast and readability.
- **Controls:**
    - "Remove" button: Change from solid red to subtle ghost button or 'X' icon.
    - "Add Stock": improved styling.
- **Overall:** Clean up spacing and padding.

## Technical Notes
- **Files:** `layout.tsx`, `BriefingDashboard.tsx`, `SettingsForm.tsx`.
- **Tailwind:** Use `prose` or custom classes for typography.
