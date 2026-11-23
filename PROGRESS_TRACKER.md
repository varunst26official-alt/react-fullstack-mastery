# 📊 React & Full-Stack Career Transformation: Progress Tracker

> **Candidate:** Varun Senthilkumar (3 Years Enterprise Mendix Experience)  
> **Target Role:** Senior Full-Stack Engineer / Enterprise Decoupled Architect  
> **Target Compensation:** ₹18.0L – ₹22.0L+ LPA (India) / AED 18,000 – 25,000 / month (Dubai Tax-Free)  
> **Learning Philosophy:** Deep first-principles knowledge (understanding browser memory, runtime internals, and enterprise patterns instead of surface-level syntax).

---

## 🎯 Current Status (Last Updated: 23-Nov-2026)

| Metric | Status |
| :--- | :--- |
| **Current Phase** | **Phase 1: React 18 & Runtime Internals** |
| **Pace & Style** | Slow, rigorous, deep-dive with Mendix enterprise parallels |
| **Live Project** | **Personal Cash Ledger** running locally at `http://127.0.0.1:5173/` |
| **Git Identity** | Configured with personal credentials (`Varunst26official@gmail.com`) |

---

## ✅ Completed & Deeply Understood Milestones

### 1. The React Runtime & Component Model
- [x] **Component Architecture vs Mendix Snippets**: Unidirectional data flow, functional purity, JSX compilation.
- [x] **Props (Parameters)**: Read-only inputs passed from parent to child, immutability rules.
- [x] **Vite & Tooling Setup**: Fixed IPv6 timeout bug by binding explicitly to IPv4 (`127.0.0.1:5173`) in `vite.config.ts`.
- [x] **Linter Ecosystem**: ESLint vs Oxlint (Rust-based performance, 50x speed).

### 2. Deep Dive: `useState` & Memory Internals
- [x] **The JavaScript Function Paradox**: How React functions remember variables across executions without global scope pollution.
- [x] **The Fiber Node**: State lives outside the component function inside an invisible linked list of hook objects on the Fiber node.
- [x] **The Rule of Hooks**: Why hooks cannot be called inside `if` statements or loops (React relies strictly on execution order pointer).
- [x] **Immutability & Reference Equality (`===`)**: Why modifying `user.balance = 30000` directly fails (shallow reference comparison `0x0042F1 === 0x0042F1`), and why object spread `{ ...user }` generates a new memory address.
- [x] **Stale Closures & Functional Updates**: How `setInterval` or async callbacks trap frozen snapshots of state, and why `setBalance(prev => prev + 100)` bypasses closure scope to read live Fiber queues.

### 3. Collections, Forms & Lifecycle
- [x] **Lists & `.map()`**: Replicating Mendix List Views in declarative JSX.
- [x] **The `key` Prop Reconciliation**: Acting as the Mendix Object GUID for Virtual DOM diffing.
- [x] **Controlled Inputs**: Binding form fields via `value` and `onChange`.
- [x] **Derived State vs Stored State**: Computing Net Balance, Total Income, and Total Expense on-the-fly instead of storing redundant state in `useState`.
- [x] **`useEffect` Master Rules**: Empty dependency `[]` (Page On-Enter), dependencies `[state]` (On-Change), and cleanup `return () => {}` (Page On-Leave).

---

## 🗺️ 90-Day Master Roadmap Progress

### Phase 1: React 18 & Runtime Internals (Days 1–30) — *IN PROGRESS*
- [x] **Week 1:** Component Composition, Virtual DOM & Runtime Engine
- [x] **Week 2:** Strict TypeScript Types, Interfaces & Props
- [x] **Week 3:** Fiber Reconciliation, `useState` Memory Model & `useEffect` Lifecycle
- [ ] **Week 4:** Custom Hooks Suite (`useLocalStorage`, `useDebounce`, `useClickOutside`)

### Phase 2: Enterprise State & Next.js 15 Full-Stack (Days 31–60) — *UP NEXT*
- [ ] **Week 5:** Zustand Global Store Architecture (Session Entity parallel, persistent storage)
- [ ] **Week 6:** TanStack Query v5 (Server-state caching, background refetching, 3 API states)
- [ ] **Week 7:** Next.js 15 App Router, Server Components & Server Actions
- [ ] **Week 8:** PostgreSQL Database Modeling, Prisma ORM & HttpOnly JWT Authentication

### Phase 3: Production Hardening & Offer Escalation (Days 61–90)
- [ ] **Week 9:** Build a Custom React 18 Pluggable Widget for Mendix Studio Pro
- [ ] **Week 10:** Automated Playwright E2E Testing Suite
- [ ] **Week 11:** Frontend System Design Rehearsal & Naukri Profile Overhaul
- [ ] **Week 12:** The 3-Offer Escalator Strategy & Salary Negotiation Bidding War

---

## 📅 Tomorrow's Agenda (Next Session):

1. **Recap & Verification**: Quick sanity check on the `useState` Fiber memory model and stale closure mechanics.
2. **Real-Time Application Practice**: Build a live ticking financial rate simulator using `useState` and functional updates (`prev`) to see closure protection live in action.
3. **Custom Hooks Deep Dive**: Implement `useDebounce` (the #1 senior interview question) to search transactions smoothly without lag.
4. **Zustand Global Store**: Move ledger state from `App.tsx` into `FinanceStore.ts` and share it across components without prop drilling.

---
*Maintained by Varun Senthilkumar · Personal Git Repository Tracking*
