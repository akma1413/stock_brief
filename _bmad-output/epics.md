---
stepsCompleted: []
inputDocuments: ['/Users/shin/stock_brief/_bmad-output/prd.md', '/Users/shin/stock_brief/_bmad-output/architecture.md', '/Users/shin/stock_brief/_bmad-output/ux-design-specification.md']
---

# stock_brief - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for stock_brief, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: 사용자는 회원가입 및 로그인을 할 수 있다
FR2: 사용자는 증권사 계좌를 연동하여 보유 종목을 자동으로 가져올 수 있다
FR3: 사용자는 보유 종목을 수동으로 입력/수정/삭제할 수 있다
FR4: 사용자는 전날 전체 포트폴리오의 변동 원인을 3줄 요약으로 확인할 수 있다
FR5: 사용자는 개별 종목별 변동 원인을 3줄 요약으로 확인할 수 있다
FR6: 사용자는 각 변동 원인에 대한 출처(뉴스/공시 링크)를 확인할 수 있다
FR7: 시스템은 매일 오전 8시 이전에 모든 사용자의 개인화 브리핑을 생성한다
FR8: 사용자는 정보의 길이를 1문장/3문장/3문단 중 선택할 수 있다
FR9: 사용자는 용어를 탭하여 설명 팝업을 볼 수 있다
FR10: 사용자는 출처 노출 여부를 On/Off 할 수 있다
FR11: 시스템은 제공되는 출처의 최신성을 자동으로 점검한다
FR12: 시스템은 오래된 출처나 링크 오류 발생 시 자동 수정 또는 플래그 처리한다

### NonFunctional Requirements

NFR1: 초기 로딩 시간(LCP)은 3G 네트워크 환경에서도 2.5초 이내여야 한다.
NFR2: 브리핑 페이지 전환은 0.3초 이내에 반응해야 한다.
NFR3: 모든 사용자 데이터(보유 종목, 자산 가치)는 AES-256 암호화되어 저장된다.
NFR4: 증권사 연동 토큰은 서버에 저장되지 않고, 클라이언트 세션 내에서만 유지되거나 안전한 키 관리 시스템(KMS)을 통해서만 접근한다.
NFR5: 매일 오전 8시 브리핑 생성 작업의 성공률은 99.9% 이상이어야 한다.
NFR6: 외부 뉴스 소스 링크가 유효하지 않을 경우, 자동으로 대체 링크를 찾거나 해당 항목을 비활성화해야 한다.

### Additional Requirements

- **Starter Template:** Next.js (App Router) + TypeScript + Tailwind + ESLint (Architecture)
- **Database:** Supabase (PostgreSQL) (Architecture)
- **Auth:** Supabase Auth (Google OAuth + Email) (Architecture/User Request)
- **State Management:** Zustand (Architecture)
- **Styling:** Tailwind CSS + Shadcn/ui (Architecture/UX)
- **API:** Next.js API Routes (Route Handlers) (Architecture)
- **Security:** RLS Policies (Architecture)
- **Responsive:** Mobile-First (360px+) (UX)
- **Layout:** App-Like Container on Desktop (Max 480px) (UX)
- **Navigation:** Swipe Left/Right, Tap Center (UX)
- **Accessibility:** WCAG AA (Contrast 4.5:1, aria-labels, Keyboard Nav) (UX)
- **Feedback:** Haptic Feedback, Completion Sound/Vibration (UX)
- **Loading:** Skeleton UI (UX)

### FR Coverage Map

{{requirements_coverage_map}}

## Epic List

### Epic 1: User Onboarding & Portfolio Setup
**Goal:** Enable users to sign up and manually build their portfolio by searching and adding stock tickers.
**FRs covered:** FR1, FR2 (Scope Adjusted), FR3, NFR3, NFR4

### Epic 2: Daily Briefing Core
**Goal:** Generate and display a personalized 3-line summary briefing for the user's portfolio on-demand when they visit the app.
**FRs covered:** FR4, FR5, FR6, FR7, NFR1, NFR5

### Epic 3: Personalization & Interaction
**Goal:** Allow users to customize the briefing depth and interact with difficult terms for better understanding.
**FRs covered:** FR8, FR9, FR10, NFR2

### Epic 4: Data Quality & Maintenance
**Goal:** Ensure the reliability of the briefing content by validating sources and managing broken links.
**FRs covered:** FR11, FR12, NFR6

## Epic 1: User Onboarding & Portfolio Setup

**Goal:** Enable users to sign up and manually build their portfolio by searching and adding stock tickers.

### Story 1.1: Google Login (Supabase Auth)

As a user,
I want to sign up or log in using my Google account,
So that I can quickly access the service without remembering another password.

**Acceptance Criteria:**

**Given** a user is on the login page
**When** they click "Sign in with Google"
**Then** they are redirected to the Google OAuth provider
**And** upon successful authentication, they are redirected back to the dashboard
**And** a user profile is created in Supabase if it doesn't exist

### Story 1.2: Manual Ticker Search

As a user,
I want to search for stocks by ticker symbol or company name,
So that I can find the stocks I own to add them to my portfolio.

**Acceptance Criteria:**

**Given** a user is on the "Add Stock" screen
**When** they enter a search term (e.g., "Apple" or "AAPL")
**Then** the system queries a free financial API (e.g., Yahoo Finance)
**And** displays a list of matching stocks with Ticker, Name, and Exchange
**And** handles empty results or API errors gracefully

### Story 1.3: Add to Portfolio

As a user,
I want to select a stock from search results and add it to my portfolio,
So that the service knows which stocks to brief me on.

**Acceptance Criteria:**

**Given** a user views search results
**When** they click the "Add" button on a stock
**Then** the stock is saved to the `user_portfolios` table in Supabase
**And** the user sees a success confirmation (Toast)
**And** the "Add" button changes to "Added" or the item is visually marked

### Story 1.4: View Portfolio List

As a user,
I want to see a list of all stocks I have added,
So that I can verify my portfolio is correct.

**Acceptance Criteria:**

**Given** a user has added stocks
**When** they visit the dashboard or settings page
**Then** they see a list of their portfolio stocks
**And** they can remove a stock if needed

## Epic 2: Daily Briefing Core

**Goal:** Generate and display a personalized 3-line summary briefing for the user's portfolio on-demand when they visit the app.

### Story 2.1: On-Demand Briefing Generation Engine

As a user,
I want the system to generate a fresh briefing when I visit the app,
So that I get the most up-to-date explanation for my portfolio's performance using the latest news.

**Acceptance Criteria:**

**Given** a user visits the dashboard
**When** there is no briefing generated for the current day
**Then** the system fetches yesterday's market close data for the user's portfolio
**And** fetches the latest relevant news (up to the current time)
**And** uses an LLM to generate:
  1. Overall Portfolio Summary (Total Return + 3 Key Drivers)
  2. Individual Stock Summaries (Return + 3 Reasons)
**And** saves this content to the database to avoid re-generation on refresh

### Story 2.2: Briefing Dashboard (Overview List)

As a user,
I want to see a list of my stocks sorted by movement magnitude,
So that I can quickly identify the most significant changes and choose what to read first.

**Acceptance Criteria:**

**Given** the briefing data is ready
**When** the user views the dashboard
**Then** the top section displays a **1-Line Market Overview** (e.g., "Nasdaq dropped due to inflation fears")
**And** below that, a **"Top Mover" Highlight** shows the user's stock with the biggest change + a 1-line reason
**And** below that, a **Stock List** displays all portfolio stocks with Icon, Name, Price, and Change %
**And** tapping a stock in the list opens the **Briefing Card** for that specific stock

### Story 2.4: Market Data Ingestion (Indices & Movers)
As a system,
I want to fetch major market indices and top moving stocks,
So that I can objectively identify the day's market trend.

**Acceptance Criteria:**
- [ ] **Indices:** Fetch current price and change % for S&P 500, NASDAQ 100, and Russell 2000.
- [ ] **Top Movers:** Fetch list of "Top Gainers" and "Most Active" stocks (Top 5 each).
- [ ] **Frequency:** Fetch this data alongside the user's portfolio update.

### Story 2.5: Integrated Market Insight Generation
As a user,
I want a "Market Summary" that explains the "Why" behind the market's moves and connects it to my portfolio,
So that I understand the bigger picture before looking at my specific stocks.

**Acceptance Criteria:**
- [ ] **Input:** Combine Market Indices + Top Movers + Global Market News + User Portfolio List.
- [ ] **AI Processing:** Use LLM to:
    1. Identify the primary market driver (Macro/Sector).
    2. Explain why the "Top Movers" moved (using news).
    3. Generate a 1-line "Implication for your portfolio".
- [ ] **Output:** Return a structured `MarketInsight` object (Outlook, Macro Events, Sector Highlight, Portfolio Implication).

### Story 2.3: Briefing Detail View

As a user,
I want to tap on a briefing card to see more details,
So that I can verify the source of the information or see a chart.

**Acceptance Criteria:**

**Given** a user is viewing a briefing card
**When** they tap the "More" button or the card center
**Then** a Detail Sheet (Modal) opens up
**And** it displays the full news headlines/links (Sources) used for the summary
**And** it displays a simple price chart for that stock

## Epic 3: Personalization & Interaction

**Goal:** Allow users to customize the briefing depth and interact with difficult terms for better understanding.

### Story 3.1: Briefing Length Control

As a user,
I want to adjust the length of the briefing (Short/Standard/Long),
So that I can consume information according to my available time.

**Acceptance Criteria:**

**Given** a user is viewing a briefing card
**When** they adjust the length slider (or toggle)
**Then** the text content updates dynamically (e.g., 1 sentence vs 3 bullets vs 1 paragraph)
**And** the preference is saved for future briefings

### Story 3.2: Term Explanation Popup

As a user,
I want to tap on difficult financial terms to see an explanation,
So that I can understand the context without leaving the app.

**Acceptance Criteria:**

**Given** a briefing contains technical terms (e.g., "Short Selling", "FOMC")
**When** the user taps the underlined term
**Then** a popup or bottom sheet appears with a simple definition
**And** the user can close it to return to reading

### Story 3.3: Source Toggle

As a user,
I want to toggle the visibility of source citations,
So that I can choose between a clean view and a verified view.

**Acceptance Criteria:**

**Given** a user is reading a briefing
**When** they toggle "Show Sources"
**Then** the source links (e.g., [Bloomberg]) appear or disappear from the text

## Epic 4: Data Quality & Maintenance

**Goal:** Ensure the reliability of the briefing content by validating sources and managing broken links.

### Story 4.1: Source Freshness Check

As a system,
I want to verify that the news sources used are recent (within 24 hours),
So that users don't get outdated information.

**Acceptance Criteria:**

**Given** the system is fetching news
**When** a news item is older than 24 hours
**Then** it is excluded from the context for the LLM
**And** only recent news is used for generation

### Story 4.2: Broken Link Handling

As a system,
I want to detect if a source link is broken,
So that users don't encounter 404 errors.

**Acceptance Criteria:**

**Given** a generated briefing contains links
**When** a user taps a link and it returns a 404 or 500 error (detected via periodic check or on-click if possible)
**Then** the system should ideally have filtered this out during generation
**And** (MVP) Display a toast "Source unavailable" if the link is dead
### Epic 5: UI Polish & Localization
**Goal:** Refine the user interface for a premium mobile-first experience and localize the service to Korean.
**FRs covered:** N/A (User Feedback)

## Epic 5: UI Polish & Localization

**Goal:** Refine the user interface for a premium mobile-first experience and localize the service to Korean.

### Story 5.1: Design Overhaul (Mobile-First & Typography)

As a user,
I want a legible, mobile-optimized interface with subtle controls,
So that I can focus on the content without visual distractions.

**Acceptance Criteria:**
- [ ] **Mobile Layout:** Ensure the app stays within a mobile-like container (max-w-md) on desktop, centered.
- [ ] **Typography:** Increase global font sizes for better readability. Headings and body text should be larger.
- [ ] **Subtle Actions:** Change the "Remove" button in the portfolio list to be less prominent (e.g., small icon or ghost button).
- [ ] **Aesthetics:** Apply "Premium" feel (spacing, clear hierarchy).

### Story 5.2: Korean Localization

As a Korean user,
I want to use the service in my native language,
So that I can understand the financial insights effortlessly.

**Acceptance Criteria:**
- [ ] **UI Text:** Translate all static UI elements (Headers, Buttons, Labels, Toasts) to Korean.
- [ ] **Mock Data:** Update `briefing-service.ts` to generate Korean mock briefings and terms.
- [ ] **Date/Currency:** Format dates and currency appropriate for Korean users (if applicable).

### Epic 6: Real Data Integration
**Goal:** Replace mock data with real-time financial data, news, and AI-generated insights.
**FRs covered:** FR7, FR11, NFR6

## Epic 6: Real Data Integration

**Goal:** Replace mock data with real-time financial data, news, and AI-generated insights.

### Story 6.1: Real Stock Price Data
As a user,
I want to see real-time or delayed stock prices for my portfolio,
So that I know the actual value of my holdings.

**Acceptance Criteria:**
- [ ] **API:** Integrate `yahoo-finance2` (or similar) to fetch real quotes.
- [ ] **Backend:** Update `briefing-service.ts` to fetch price/change from API.
- [ ] **Display:** Show actual Price and Change % in Dashboard and Detail View.

### Story 6.2: Real News Aggregation
As a system,
I want to fetch recent news articles for each portfolio ticker,
So that the AI has relevant context to summarize.

**Acceptance Criteria:**
- [ ] **API:** Integrate a News API (e.g., NewsAPI.org, Bing News, or SERP API).
- [ ] **Filtering:** Fetch only news from the last 24 hours.
- [ ] **Content:** Retrieve Headline, Source, Date, and URL.

### Story 6.3: LLM Briefing Generation
As a user,
I want unique, AI-generated summaries based on real news,
So that I get a truly personalized briefing, not a template.

**Acceptance Criteria:**
- [ ] **API:** Integrate OpenAI (GPT-4o/mini) or Gemini API.
- [ ] **Prompt Engineering:** Create a prompt that takes news metadata and generates a 3-line summary + 3 key reasons.
- [ ] **Integration:** Connect News -> LLM -> Frontend response.

## Epic 7: Authoritative Sources & Cross-Validation (RAG)

**Goal:** Enhance briefing reliability by integrating premium/authoritative news sources (WSJ, Seeking Alpha, Korea Economic Daily) and using RAG for cross-validation.

### Story 7.1: Authoritative News Fetching
As a system,
I want to fetch news from specific high-reliability domains (WSJ, Bloomberg, Hankyung),
So that the AI briefings are based on credible journalism rather than generic feeds.

**Acceptance Criteria:**
- [ ] **Scraping/API:** Implement logic to fetch from specific domains (using specialized APIs or scraping if permitted).
- [ ] **Source Weighting:** Prioritize articles from these sources over generic ones.

### Story 7.2: RAG Implementation
As a system,
I want to store retrieved news articles in a vector database,
So that I can semantically search for the most relevant context for each stock.

**Acceptance Criteria:**
- [ ] **Database:** Configure Supabase pgvector.
- [ ] **Embedding:** Generate embeddings for news headlines/summaries (using Gemini Embedding or OpenAI).
- [ ] **Retrieval:** Retrieve top 3 relevant articles per stock tick before generation.

### Story 7.3: Cross-Validation Logic
As a user,
I want the AI to verify facts across multiple sources,
So that hallucinations or single-source errors are minimized.

**Acceptance Criteria:**
- [ ] **Logic:** LLM prompt should explicitly compare sources ("According to WSJ..., but Reuters says...").
- [ ] **Conflict Resolution:** If sources disagree, mention the discrepancy.
