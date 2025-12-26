# Story 3.1: In-Context Briefing Settings

Status: ready-for-dev

## Story

As a user,
I want to adjust the briefing style (Tone, Length) directly while reading,
so that I can instantly see the content clearer without leaving the page.

## Acceptance Criteria

1. **Given** I am viewing the Briefing Dashboard or Detail View
   **When** I change a setting (e.g., Tone Slider: Professional <-> Witty)
   **Then** the briefing content immediately regenerates/updates to reflect the new style.
2. **And** this change applies globally to all sections (Overview and all Stocks).
3. **And** the selected setting is saved as my new default for next time.

## Tasks / Subtasks

- [ ] UI Implementation
  - [ ] Create `SettingsToolbar` component (Tone Selector, Length Toggle).
  - [ ] Embed `SettingsToolbar` into `BriefingDashboard` (top right or header).
  - [ ] (Optional) Add controls to `StockDetailDialog` header? -> *Start with Dashboard first*.
- [ ] Interaction Logic
  - [ ] When value changes -> Call `updateUserSettings` (optimistic UI?).
  - [ ] Trigger re-generation of briefing content automatically.


## Dev Notes

### Schema
```sql
create table user_settings (
  user_id uuid references auth.users primary key,
  tone text default 'professional', -- 'professional', 'beginner', 'witty'
  length text default 'concise',    -- 'concise', 'detailed'
  updated_at timestamp with time zone default timezone('utc'::text, now())
);
```
