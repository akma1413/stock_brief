# Story 1.1: Google Login (Supabase Auth)

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to sign up or log in using my Google account,
so that I can quickly access the service without remembering another password.

## Acceptance Criteria

1. **Given** a user is on the login page
   **When** they click "Sign in with Google"
   **Then** they are redirected to the Google OAuth provider
2. **And** upon successful authentication, they are redirected back to the dashboard
3. **And** a user profile is created in Supabase if it doesn't exist

## Tasks / Subtasks

- [ ] Configure Supabase Auth
  - [ ] Enable Google Provider in Supabase Dashboard (Manual Step/Verify)
  - [ ] Configure Redirect URLs in Supabase
- [ ] Implement Auth Logic
  - [ ] Create `src/lib/supabase/client.ts` (Supabase Client)
  - [ ] Create `src/lib/supabase/server.ts` (Server Client)
  - [ ] Create `src/features/auth/hooks/use-auth.ts` (Auth Hook)
  - [ ] Create `src/features/auth/stores/use-auth-store.ts` (Zustand Store)
- [ ] Implement UI
  - [ ] Create `src/app/(auth)/login/page.tsx`
  - [ ] Create `src/features/auth/components/LoginForm.tsx` (or LoginButton)
  - [ ] Add "Sign in with Google" button using Shadcn UI
- [ ] Handle Callback
  - [ ] Create `src/app/auth/callback/route.ts` for OAuth exchange

## Dev Notes

### Architecture & Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Auth:** Supabase Auth (SSR Support required)
- **State:** Zustand for client-side session state
- **Styling:** Tailwind CSS + Shadcn/ui

### Implementation Details
- Use `@supabase/ssr` for Next.js App Router integration.
- Ensure `middleware.ts` is set up to refresh sessions.
- **Naming Conventions:**
  - Components: `PascalCase` (e.g., `LoginButton.tsx`)
  - Hooks/Utils: `kebab-case` (e.g., `use-auth.ts`)
  - Database: `snake_case` (e.g., `user_profiles`)

### Project Structure Notes
- `src/app/(auth)/login/page.tsx`: Login Page Route
- `src/features/auth/`: Feature directory for Auth components and logic
- `src/lib/supabase/`: Supabase configuration

### References
- [Architecture](file:///Users/shin/stock_brief/_bmad-output/architecture.md)
- [Supabase SSR Docs](https://supabase.com/docs/guides/auth/server-side/nextjs)

## Dev Agent Record

### Agent Model Used

Antigravity (Google DeepMind)

### Debug Log References

### Completion Notes List

### File List
