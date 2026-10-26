# React 18 & 19 Rendering Lifecycle & Fiber Architecture

---

## 1. What is React Fiber?

Before React 16, React used the **Stack Reconciler**. It recursed through the component tree synchronously. If a tree was large, the main thread was blocked until the entire tree rendered, causing dropped frames (jank).

**Fiber** is React’s complete rewrite of the reconciliation algorithm:
- Every component instance becomes a **Fiber Node** (a plain JavaScript object acting as a virtual call stack frame).
- Work can be **paused, aborted, prioritized, and resumed**.
- High-priority updates (user typing, mouse clicks) can interrupt low-priority updates (data table rendering, background charts).

---

## 2. The Two Phases of React Rendering

React updates happen in two distinct phases:

```
+--------------------------------------------------------------------------+
| 1. RENDER / RECONCILIATION PHASE (Interruptible, Concurrent)              |
| - React calls your component functions.                                  |
| - Computes the differences (diffs) between previous and new Fiber trees. |
| - Pure calculation: NO DOM changes are made here!                       |
+--------------------------------------------------------------------------+
                                    |
                                    v
+--------------------------------------------------------------------------+
| 2. COMMIT PHASE (Synchronous, Uninterruptible)                           |
| - React applies the diffs to the real DOM (appendChild, removeChild).     |
| - Calls useLayoutEffect synchronously.                                   |
| - Browser paints the pixels on screen.                                   |
| - React executes useEffect callbacks asynchronously.                     |
+--------------------------------------------------------------------------+
```

### The Cardinal Rule:
Because the **Render Phase** can be called multiple times or aborted by React's Concurrent Scheduler, **Component functions must be pure**.
- ❌ **Never** mutate variables outside the component during render.
- ❌ **Never** call APIs or set timeouts directly in the component body.
- ✅ Always isolate side effects inside `useEffect` or event handlers.

---

## 3. Why Components Re-render (and How to Optimize)

A React component re-renders if and only if:
1. **Its local state (`useState`, `useReducer`) changes.**
2. **Its parent component re-renders** (unless wrapped in `React.memo` with shallow prop equality).
3. **A Context value it consumes changes.**

### When to use `React.memo`:
Wrapping every component in `React.memo` is an anti-pattern (it adds comparison overhead). Use it when:
- The component renders frequently with the exact same props.
- The component has a heavy render cost (e.g., SVG charts, complex data grids, interactive canvas nodes like React Flow).
