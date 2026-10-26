# Top 50 Senior Full-Stack & React Technical Interview Questions

---

## Section 1: React 18 & 19 Core Mental Models

### Q1: What is the Virtual DOM and does React 18 still use it?
**Answer:** The Virtual DOM is a lightweight JavaScript object representation of the real DOM. React creates two trees during render: the current tree and the work-in-progress tree. React uses the reconciliation algorithm (Fiber) to compute minimal diffs and applies them to the real DOM in the commit phase. In React 18, the Virtual DOM is managed concurrently via Fiber nodes that can pause and resume rendering work based on priority.

### Q2: What causes a React component to re-render?
**Answer:**
1. Change in local state (`useState`, `useReducer`).
2. Parent component re-renders (unless wrapped in `React.memo` with shallow prop equality).
3. Value of a subscribed `Context` changes.
*Note: Props changing does NOT cause a child to render on its own; it re-renders because the PARENT re-rendered.*

### Q3: Why is mutating state directly bad in React?
**Answer:** React determines whether to re-render by comparing previous and next state references using `Object.is()`. If you mutate an object directly (`user.name = 'John'`), the object reference remains identical, so React assumes no change occurred and bails out of rendering. Direct mutation also breaks time-travel debugging and concurrent rendering.

### Q4: When would you use `useLayoutEffect` instead of `useEffect`?
**Answer:** `useEffect` runs asynchronously **after** the browser paints the screen to avoid blocking visual updates. `useLayoutEffect` runs synchronously **before** the browser paints. You use it only when measuring DOM elements (e.g., getting element width/height) or synchronously mutating the DOM to prevent visual flickering.

### Q5: How do React 18 Concurrent Features (`useTransition`, `useDeferredValue`) work?
**Answer:** Concurrent features allow React to mark state updates as non-urgent transitions. While urgent updates (like typing in an input field) render immediately, non-urgent transitions (like filtering a heavy data table) are calculated in the background and can be interrupted if the user types again.

---

## Section 2: State Management & Architecture

### Q6: Why choose TanStack Query over Redux Toolkit for server data?
**Answer:** Redux requires manual state definitions for data, loading, and error states, plus manual actions and reducers for fetching. TanStack Query is purpose-built for server cache: it provides automated background refetching, request deduplication, cache invalidation, pagination, and optimistic updates out of the box with zero boilerplate.

### Q7: Explain Optimistic Updates and how you handle rollbacks.
**Answer:** In an optimistic update, the client updates its UI cache immediately upon user interaction before the backend REST response returns. During `onMutate`, we snapshot the current cache. If the backend fails (`onError`), we roll back the cache to the snapshot. Finally (`onSettled`), we invalidate the query to ensure the client stays synchronized with the backend truth.

### Q8: How does Zustand compare to the Context API?
**Answer:** The Context API triggers re-renders across all consuming components whenever the context value reference changes, often requiring complex memoization splits. Zustand uses selector-based subscriptions (`useAppStore(state => state.language)`): a component re-renders ONLY when the specific selected slice of state changes, resulting in superior performance.

---

## Section 3: Decoupled & Enterprise Architecture

### Q9: How do you design a decoupled "React on Mendix" architecture?
**Answer:** Mendix runs headless as the core business logic, domain model, security, and workflow engine, publishing REST endpoints or OData services. A modern React SPA (built with Vite or Next.js) serves as the presentation layer, consuming Mendix APIs using OAuth/Bearer tokens. This allows bespoke consumer-grade UX (such as React Flow graph editors) while preserving Mendix's robust enterprise data modeling and role-based access controls.

### Q10: How did you implement an in-browser workflow studio with React Flow?
**Answer:** React Flow provides interactive canvas nodes and edges. We created custom node components (Approval, Milestone, Condition) with connection handles. On edit, the frontend validates the directed acyclic graph (DAG) structure and serializes it into a JSON workflow definition schema sent to a headless Mendix REST endpoint, where custom Java validates business rules and stores the state machine definition.

---

## Section 4: Web Security & QA

### Q11: Where should JWT access tokens and refresh tokens be stored?
**Answer:** Refresh tokens must be stored in `HttpOnly`, `Secure`, `SameSite=Strict` cookies to prevent access via JavaScript XSS attacks. Short-lived Access Tokens (e.g. 10–15 minutes) should be kept in memory (a variable or Zustand store), refreshed automatically via an interceptor before expiration.

### Q12: How do you prevent XSS attacks in React?
**Answer:** React automatically escapes all string expressions embedded in JSX `{expression}`. Vulnerabilities only arise when using `dangerouslySetInnerHTML`, `eval()`, or unvalidated `href="javascript:..."` attributes. For rich text, always sanitize using libraries like `DOMPurify`.

### Q13: How does Playwright handle end-to-end testing with Arabic RTL?
**Answer:** In Playwright, we can toggle the application to Arabic, verify that the `html[dir="rtl"]` attribute is active, and inspect that flex and grid layouts have mirrored appropriately. We also integrate `@axe-core/playwright` to automatically audit WCAG 2.1 AA accessibility compliance across all interactive flows.
