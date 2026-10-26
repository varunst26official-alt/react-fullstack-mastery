# Decoupled "React on Mendix" Architecture Blueprint

---

## 1. Architectural Philosophy: Why Decouple?

Standard Mendix applications run with **Atlas UI** widgets tightly coupled to the Mendix client runtime.  
While rapid for simple CRUD apps, Atlas UI reaches limits when:
1. Enterprise clients require bespoke, high-performance web applications (e.g. interactive graph canvases, high-density data grids).
2. End-users need in-browser runtime workflow design tools (which Mendix Studio Pro cannot provide to non-developers).
3. The client demands strict WCAG 2.1 AA accessibility standards and high-fidelity Arabic (RTL) layouts.

```
+-----------------------------------------------------------------------------------+
|                        Decoupled Headless Mendix System                           |
+-----------------------------------------------------------------------------------+
|  [ Presentation Tier: Modern React SPA ]                                          |
|  - React 18.3 + TypeScript 5.6 + Vite 6.4                                         |
|  - React Flow 12 (In-Browser Workflow Designer)                                   |
|  - Dynamic English & Arabic (RTL) Switching                                       |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          | RESTful APIs / OAuth Bearer Tokens
                                          v
+-----------------------------------------------------------------------------------+
|  [ Application & Workflow Tier: Mendix 11 Headless Engine ]                       |
|  - Headless Mendix Runtime (REST endpoints, published OData)                      |
|  - Custom Approval Workflow Engine (State Machine, Timers, Delegations)           |
|  - Core Java Extensions for High-Throughput Processing                            |
|  - Model-as-Code: 64 Programmatic MDL Scripts executed via mxcli                  |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|  [ Data & Audit Tier ]                                                            |
|  - PostgreSQL Database (Optimized B-tree Indexes, Foreign Key Constraints)        |
|  - Enterprise Audit Logs & Immutable History Tables                               |
+-----------------------------------------------------------------------------------+
```

---

## 2. Solving Workflow Modifiability via React Flow 12

In Mendix, workflow definitions must be drawn in Studio Pro and deployed as binaries. Business users cannot alter workflows in the browser.

### The Decoupled Solution:
1. **Frontend Canvas:** React Flow 12 renders nodes (Approval, Condition, Notification, Milestone) and edges (transitions).
2. **Serialization:** The frontend serializes the React Flow graph into a clean JSON Schema:
   ```json
   {
     "workflowId": "WF_KHDA_FINANCE_01",
     "version": "1.2.0",
     "nodes": [
       { "id": "n1", "type": "start", "label": "Submission" },
       { "id": "n2", "type": "approval", "role": "Finance_Director", "slaHours": 48 },
       { "id": "n3", "type": "end", "label": "Approved" }
     ],
     "edges": [
       { "source": "n1", "target": "n2" },
       { "source": "n2", "target": "n3", "condition": "AMOUNT < 50000" }
     ]
   }
   ```
3. **Execution:** Sent to Mendix via `POST /api/v1/workflows/definitions`. A custom Java action validates the graph (detecting circular loops and orphan branches) and persists the state machine rules into Mendix entities.

---

## 3. Model-as-Code (MDL) via `mxcli`

To ensure 100% reproducible builds and continuous integration (CI/CD):
- 64 numbered MDL scripts define entities, associations, security rules, and microflow hooks programmatically.
- Executed in CI pipeline:
  ```bash
  mxcli docker check --model-path ./model
  ```
- Result: **0 build errors, zero manual UI clicking, and 100% Git-trackable Mendix changes.**
