---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
inputDocuments: []
documentCounts:
  briefs: 0
  research: 0
  brainstorming: 0
  projectDocs: 0
workflowType: 'prd'
lastStep: 11
project_name: 'stock_brief'
user_name: 'Macpro14'
date: '2025-12-23T16:32:44+09:00'
---

# Product Requirements Document - stock_brief

**Author:** Macpro14
**Date:** 2025-12-23T16:32:44+09:00

## Executive Summary

**Stock Brief**는 바쁜 직장인 투자자를 위해, 매일 아침 전날의 내 주식 계좌 변동 원인을 개인화된 3줄 요약으로 명확하게 설명해주는 웹 서비스입니다.

기존 MTS나 정보 채널들이 제공하는 파편화된 뉴스나 실시간 속보 대신, 사용자의 실제 보유 종목(포트폴리오)과 연동하여 "내 돈이 왜 변했는지"에 대한 직접적인 인과관계를 쉽고 빠르게 전달합니다. 이를 통해 사용자는 정보 탐색에 들이는 시간을 획기적으로 줄이고, 자신의 투자 현황을 명확하게 파악할 수 있습니다.

### What Makes This Special

1.  **Hyper-Personalization (초개인화):** 시장 전체의 시황이 아닌, 철저히 '내 계좌'와 '내 보유 종목'에 기반한 분석만을 제공합니다.
2.  **Contextual "Why" (맥락적 인과관계):** 단순한 등락률 표시가 아니라, 해당 변동이 발생한 구체적인 이유를 신뢰할 수 있는 출처를 기반으로 설명합니다.
3.  **Time-Efficiency (시간 효율성):** 커뮤니티나 유튜브를 헤맬 필요 없이, 접속 즉시 3개의 핵심 불렛 포인트로 전날의 변동 내역을 완벽하게 브리핑받을 수 있습니다.

## Project Classification

**Technical Type:** Web App (Mobile-First Dashboard)
**Domain:** Fintech (Investment/Personal Finance)
**Complexity:** High (Data Integration, Personalized Content Generation)
**Project Context:** Greenfield - New Project

## Success Criteria

### User Success (사용자 성공)

- **Session Duration:** 사용자가 앱 접속 후 **약 3분간** 콘텐츠를 소비하고 만족하며 나가는 것을 목표
- **Self-Contained:** 외부 앱 없이 이 서비스 하나로 충분함

### Business Success (비즈니스 성공)

| 지표 | 정의 |
|---|---|
| **D+0 계좌 연동 완료율** | 첫 세션 내 투자종목현황 연동 완료한 사용자 비율 |
| **D+0 1분 잔존율** | 연동 완료 후 1분 이상 서비스에 머무는 사용자 비율 |
| **D+3 리텐션** | 가입 후 3일 내 재방문하는 사용자 비율 |

### Technical Success (기술적 성공)

- **Timeliness:** 매일 **오전 8시** 전까지 개인화 리포트 생성 완료
- **Source Citation:** 모든 변동 원인 설명에 **출처 URL** 포함
- **Freshness Check:** 출처 최신성 자동 점검 및 오류 수정 로직

## Product Scope

### MVP (최소 기능 제품)

| 기능 | 설명 |
|---|---|
| **계좌 연동/입력** | MTS 연동 또는 수동 종목 입력 |
| **전체 브리핑 (3줄 요약)** | 전날 내 계좌 전체의 변동 요약 |
| **종목별 브리핑 (3줄 요약)** | 각 보유 종목별 변동 원인 설명 |
| **모바일 웹** | Mobile-First 반응형 웹앱 |
| **정보 길이 조절** | 슬라이더로 1문장 / 3문장 / 3문단 중 선택 |
| **용어 설명 팝업** | 처음 보는 용어 탭 시 설명 팝업 표시 |
| **출처 노출 토글** | On/Off 버튼으로 출처 표시 여부 간편 설정 |

### Growth (Post-MVP)

- 푸시 알림 / 카카오톡 알림톡
- 주간/월간 종합 리포트
- 커뮤니티 기능

### Vision (Future)

- AI 기반 "다음에 주목할 이슈" 예측
- 증권사 API 직접 연동 (실시간 잔고 동기화)

## User Journeys

### Journey 1: 김민수 - "매일 아침의 숙제에서 해방되다"

**페르소나:** 김민수, 32세, 핀테크 스타트업 기획자, 주식 투자 3년차, 보유 종목 7개 (미국 4개, 한국 3개)

**배경:** 민수는 매일 출근 전 10~15분을 네이버 증권, 토스증권 커뮤니티, 유튜브를 돌아다니며 "어제 왜 NVDA가 4% 올랐지?", "삼성전자는 왜 또 빠졌어?"를 파악하는 데 쓴다. 정보는 파편화되어 있고, 믿을 만한 설명을 찾기도 어렵다. 이 과정이 피곤하지만, 안 하면 불안하다.

---

**🎬 Opening Scene (발견):**
어느 날 밤, 민수는 토스증권 커뮤니티에서 본인이 관심 있는 종목 분석글을 찾다가, 유독 깔끔하게 정리된 글 하나를 발견한다. "어제 테슬라가 오른 3가지 이유" - 읽어보니 딱 내가 원하던 수준의 설명이다. 댓글을 보니 작성자가 "이건 Stock Brief에서 제공한 분석입니다"라며 링크를 걸어뒀다. 호기심에 클릭.

**🎬 Rising Action (온보딩):**
랜딩페이지에서 "매일 아침, 내 계좌 변동 이유를 3줄로 요약해드립니다"라는 문구를 본다. "오, 이거 딱 내가 필요했던 거잖아." 가입 버튼을 누르고, 토스 계좌 연동을 진행한다. 1분도 안 걸린다. 연동이 완료되자마자 화면에 "내일 오전 8시에 첫 브리핑을 받아보세요!"라는 메시지가 뜬다.

**🎬 Climax (첫 번째 브리핑):**
다음 날 아침 7시 55분, 알람보다 먼저 눈을 뜬 민수. 습관적으로 토스증권 앱을 열려다가 Stock Brief 알림이 와 있는 걸 본다. 열어보니:

> **📊 어제 내 계좌: +1.2% (+43,200원)**
> 1. NVDA +4.1%: 젠슨 황 CEO의 CES 기조연설 기대감으로 반도체 섹터 전반 상승 [출처: Bloomberg]
> 2. 삼성전자 -1.5%: 외국인 순매도 지속, 환율 영향 [출처: 한경]
> 3. AAPL +0.8%: 비전프로 국내 출시 임박 소식 [출처: Reuters]

민수는 고개를 끄덕인다. "아, 그래서 그랬구나." 평소 15분 걸리던 일을 30초 만에 끝냈다.

**🎬 Resolution (새로운 일상):**
2주 후, 민수는 더 이상 여러 앱을 돌아다니지 않는다. 아침에 Stock Brief 하나만 열면 된다. 궁금하면 각 종목을 탭해서 더 자세한 설명을 보고, 용어가 어려우면 탭해서 팝업 설명을 본다. 출근 전 루틴이 10분 단축됐고, 불안감도 줄었다. 동료에게 "이거 써봐, 진짜 편해"라며 링크를 공유한다.

---

### Journey Requirements Summary

| 요구사항 | 기능 |
|---|---|
| 발견 경로 | 커뮤니티/SNS 공유 기능, 바이럴 콘텐츠 생성 |
| 온보딩 | 증권사 계좌 연동 (1분 이내), 간편 회원가입 |
| 핵심 경험 | 전체 계좌 요약 (3줄), 종목별 상세 설명, 출처 링크 |
| 개인화 | 정보 길이 조절, 용어 설명 팝업 |
| 확산 | 친구에게 공유하기 기능 |

## Web App Specific Requirements

### Project-Type Overview

**Stock Brief**는 **SPA(Single Page Application)** 아키텍처 기반의 모바일 퍼스트 웹앱입니다. 실시간 데이터 처리나 오프라인 기능 없이, 매일 미리 생성된 브리핑 콘텐츠를 빠르게 전달하는 데 집중합니다.

### Technical Architecture Considerations

| 항목 | 결정 |
|---|---|
| **Architecture** | SPA (Single Page Application) |
| **Target Browser** | Chrome (Mobile & Desktop) |
| **PWA Support** | 불필요 (홈 화면 추가, 오프라인 미지원) |
| **Real-time Updates** | 불필요 (매일 오전 8시 배치 생성) |
| **Responsive Design** | Mobile-First |

### Implementation Considerations

- **Framework:** React/Vue/Svelte 등 SPA 프레임워크 사용
- **Routing:** Client-side routing (React Router 등)
- **State Management:** 간단한 상태 관리 (Context API 또는 Zustand)
- **API:** RESTful API로 브리핑 데이터 fetch
- **Performance:** 초기 로딩 최적화 (코드 스플리팅, lazy loading)

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Problem-Solving MVP
**목표:** 핵심 문제(매일 아침 변동 이유 찾기)를 최소한의 기능으로 해결
**리소스:** 소규모 팀 (프론트엔드 1명, 백엔드 1명, AI/데이터 1명)

### MVP Feature Set (Phase 1)

**Core User Journey 지원:** 김민수 Journey (발견 → 온보딩 → 첫 브리핑 → 일상화)

**Must-Have 기능:**

| 기능 | 설명 | 우선순위 |
|---|---|---|
| 계좌 연동/수동 입력 | MTS 연동 또는 수동 종목 입력 | P0 |
| 전체 브리핑 (3줄 요약) | 전날 내 계좌 전체의 변동 요약 | P0 |
| 종목별 브리핑 (3줄 요약) | 각 보유 종목별 변동 원인 설명 | P0 |
| 정보 길이 조절 | 슬라이더로 1문장/3문장/3문단 선택 | P0 |
| 용어 설명 팝업 | 처음 보는 용어 탭 시 설명 팝업 | P1 |
| 출처 노출 토글 | On/Off 버튼으로 출처 표시 여부 설정 | P1 |

### Post-MVP Features

**Phase 2 (Growth):**
- 푸시 알림 / 카카오톡 알림톡 발송
- 주간/월간 종합 리포트
- 친구에게 공유하기 기능

**Phase 3 (Expansion):**
- 커뮤니티 기능 (같은 종목 보유자 반응 공유)
- AI 기반 "다음에 주목할 이슈" 예측
- 증권사 API 직접 연동 (실시간 잔고 동기화)

### Risk Mitigation Strategy

**Technical Risks:** LLM 기반 콘텐츠 생성 정확도 → 초기에는 수동 검수 병행, 점진적 자동화
**Market Risks:** 사용자 습관 형성 실패 → D+3 리텐션 지표로 초기 검증, 빠른 피봇
**Resource Risks:** 인력 부족 시 → MVP를 P0 기능에만 집중, P1은 후속 배포

## Functional Requirements

### 사용자 계정 & 온보딩

- **FR1:** 사용자는 회원가입 및 로그인을 할 수 있다
- **FR2:** 사용자는 증권사 계좌를 연동하여 보유 종목을 자동으로 가져올 수 있다
- **FR3:** 사용자는 보유 종목을 수동으로 입력/수정/삭제할 수 있다

### 브리핑 콘텐츠

- **FR4:** 사용자는 전날 전체 포트폴리오의 변동 원인을 3줄 요약으로 확인할 수 있다
- **FR5:** 사용자는 개별 종목별 변동 원인을 3줄 요약으로 확인할 수 있다
- **FR6:** 사용자는 각 변동 원인에 대한 출처(뉴스/공시 링크)를 확인할 수 있다
- **FR7:** 시스템은 매일 오전 8시 이전에 모든 사용자의 개인화 브리핑을 생성한다

### 개인화 설정

- **FR8:** 사용자는 정보의 길이를 1문장/3문장/3문단 중 선택할 수 있다
- **FR9:** 사용자는 용어를 탭하여 설명 팝업을 볼 수 있다
- **FR10:** 사용자는 출처 노출 여부를 On/Off 할 수 있다

### 데이터 품질

- **FR11:** 시스템은 제공되는 출처의 최신성을 자동으로 점검한다
- **FR12:** 시스템은 오래된 출처나 링크 오류 발생 시 자동 수정 또는 플래그 처리한다

## Non-Functional Requirements

### Performance

- **NFR1:** 초기 로딩 시간(LCP)은 3G 네트워크 환경에서도 **2.5초 이내**여야 한다.
- **NFR2:** 브리핑 페이지 전환은 **0.3초 이내**에 반응해야 한다.

### Security

- **NFR3:** 모든 사용자 데이터(보유 종목, 자산 가치)는 **AES-256 암호화**되어 저장된다.
- **NFR4:** 증권사 연동 토큰은 서버에 저장되지 않고, 클라이언트 세션 내에서만 유지되거나 안전한 키 관리 시스템(KMS)을 통해서만 접근한다.

### Reliability

- **NFR5:** 매일 오전 8시 브리핑 생성 작업의 성공률은 **99.9%** 이상이어야 한다.
- **NFR6:** 외부 뉴스 소스 링크가 유효하지 않을 경우, 자동으로 대체 링크를 찾거나 해당 항목을 비활성화해야 한다.
