# Story 6.3: LLM Briefing Generation (Gemini)

**Goal:** Generate summaries using Google Gemini API.

## User Story
As a user,
I want high-quality AI summaries,
So that I understand *why* the stock moved.

## Acceptance Criteria
- [ ] **Provider:** Google Gemini API.
    - Model: `gemini-1.5-flash` or `gemini-2.0-flash` (Fast & Cost-effective).
    - *Constraint:* Needs User's API Key (`GEMINI_API_KEY`).
- [ ] **Prompt:**
    - Context: List of news headlines/summaries + Stock Movement (Change %).
    - Task: "Explain why [Ticker] moved [Change%] today in 3 sentences + 3 bullet points."
    - Tone: Use user setting (Professional/Easy/Witty).
    - Language: Korean.
    - Output: JSON format.
- [ ] **Output:** Valid JSON fitting `StockBriefing` interface.

## Technical Notes
- Install `@google/generative-ai`.
- Create `.env.local` for `GEMINI_API_KEY`.
