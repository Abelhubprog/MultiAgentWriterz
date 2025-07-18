flowchart TD
    %% ───────────────────────── 1  FRONT‑END  ─────────────────────────
    subgraph FE["🖥️  Front‑end (React 19 + Vite)"]
        direction TB
        FE0["User types prompt  
              ⬇️ drags ≤50 files (≤100 MB each)"] --> FE1
        FE1["ContextUploader  
            • tus‑js resumable upload  
            • shows thumbnails + progress"] --> FE2
        FE2["POST /api/files  
            returns file_ids[]"] --> FE3
        FE3["POST /api/chat {prompt, mode, file_ids}"] --> FE4
        FE4["WebSocket /ws/{trace_id}  
            🔄 AgentTimeline + ChatMessages  
            streams Node events"] --> FE5
        FE5["DownloadMenu  
            DOCX / PDF / PPT / ZIP  
            presigned URL"] --> FE6
        FE6["WalletButton (Dynamic.xyz)  
            Coinbase Pay ✚ PayStack"]        
    end

    %% ───────────────────────── 2  FASTAPI CORE  ─────────────────────────
    FE3 --> A_INTENT

    subgraph A_INTENT["Intent Layer"]
        A1["enhanced_user_intent"] --> A2
        A2["intelligent_intent_analyzer"] --> A3
        A3["user_intent (fallback)"]
    end

    A_INTENT --> B_PLAN

    subgraph B_PLAN["Planning Layer"]
        B1["planner"] -->|select graph YAML| B2
        B2["methodology_writer (if research)"]
        B2 --> B3["loader (seed docs)"]
    end

    %% ───────────────  FILE PRE‑PROCESSING (CELERY)  ───────────────
    FE1 -. async .-> C_EMBED

    subgraph C_EMBED["File Chunk & Embed  (Celery)"]
        direction TB
        C1["chunk_splitter  
            • PDF 1 400 char windows  
            • DOC/TXT by paragraph  
            • images → Gemini Vision caption  
            • audio → Whisper transcript"] --> C2
        C2["embedding_service  
            → Supabase pgvector"] --> C3
        C3["vector_storage"],
        style C_EMBED stroke-dasharray: 4 4
    end

    %% ───────────────────────── 3  RUNTIME GRAPH  ─────────────────────────
    B_PLAN --> C_RESEARCH

    subgraph C_RESEARCH["Research Swarm"]
        C_R0["search_base + search_*"] --> C_R1
        C_R1["research_swarm/* specialists"] --> C_R2
        C_R2["source_filter"] --> C_R3
        C_R3["source_verifier"] --> C_R4
        C_R4["prisma_filter"] --> C_R5
        C_R5["privacy_manager"]
    end

    C_RESEARCH --> D_AGG

    subgraph D_AGG["Aggregation & RAG"]
        D1["aggregator"] --> D2["rag_summarizer  
        🔍 pgvector similarity(top 8)"]
        D2 --> D3["memory_retriever"]
        D3 --> D4["memory_writer"]
    end

    D_AGG --> E_AUTHOR

    subgraph E_AUTHOR["Writing Swarm"]
        E1["writer (Gemini 2.5 Pro) 🚀  
            streams paragraphs"] --> E2
        E2["writing_swarm helpers  
             • academic_tone  
             • clarity_enhancer  
             • structure_optimizer  
             • style_adaptation"] --> E3
        E3["citation_master"]
    end

    E_AUTHOR --> F_FORMAT

    subgraph F_FORMAT["Formatting / QA"]
        F1["formatter_advanced"] --> F2
        F2["citation_audit"] --> F3
        F3["qa_swarm/*"] --> F4
        F4["evaluator"] --> F5["evaluator_advanced"]
    end

    F_FORMAT --> G_META

    subgraph G_META["Meta / Recovery"]
        G1["swarm_intelligence_coordinator"] --> G2
        G2["emergent_intelligence_engine"] --> G3
        G3["fail_handler_advanced  
            ↺ retry w/ cheaper model"] --> G4
        G4["source_fallback_controller"] --> G5["synthesis"]
    end

    G_META --> H_DERIV

    subgraph H_DERIV["Derivatives & Compliance"]
        H1["slide_generator"] --> H2
        H2["derivatives (charts, infographics)"] --> H3
        H3["turnitin_advanced  
             • Celery poll → similarity"] --> H4
        H4["arweave (optional)"]
    end

    H_DERIV --> I_RESP

    subgraph I_RESP["📤  UnifiedResponse"]
        I1["JSON -> /api/chat response"] --> I2["WebSocket events  
                • stream  
                • cost_usd  
                • plagiarism_score  
                • derivative_ready"]
    end

    %% ────────── SUPPORTING SERVICES (SIDE‑CHANNELS) ──────────
    subgraph S1["Redis / Cost & Cache"]
        S1a["llm_service → cache(prompt,model)"] 
        S1b["token_tracker → usd ledger"]
    end
    S1a --> E_AUTHOR
    S1a --> C_RESEARCH
    S1b --> I_RESP

    subgraph S2["Admin & Billing"]
        ADM1["/api/admin/models  
              → Redis model_override:*"] --> A_INTENT
        PAY1["/api/payments  
              PayStack / Coinbase"] --> S1b
    end

Below is a **master inventory + consolidation plan** for every file and folder in the *frontend/* tree you posted.
Read it top‑down once, then follow the **“Action”** column to decide whether to **keep, move, merge or delete**. When you finish, you’ll have **one clean Turborepo** (Next 14‑app router) with a *shared UI package* and *a single Vite “playground”* for rapid prototyping—no duplication, no dead code paths.

---

## 1 Top‑level files (root of `frontend/`)

| Path                       | Role today                          | Action                                                       |
| -------------------------- | ----------------------------------- | ------------------------------------------------------------ |
| `components.json`          | Shadcn code‑gen manifest (Vite app) | **Move** → `apps/web/components.json`                        |
| `eslint.config.js`         | Vite lint rules                     | **Merge** into `/HandyWriterz/packages/eslint-config/`       |
| `tailwind.config.ts`       | Tailwind for Vite app               | Keep *temporarily* until migration finishes, then delete     |
| `vite.config.ts` `vitest*` | Vite build + test for legacy app    | **Keep** (playground)                                        |
| `index.html`               | Entry for Vite dev server           | Keep                                                         |
| `pnpm-lock.yaml`           | Root lock file                      | Replace by workspace root lock in Turborepo (already exists) |
| `.env.example`             | FE env sample                       | Merge keys into `apps/web/.env.example`                      |

---

\## 2 `frontend/src/`  —the **legacy Vite React app**

### 2.1 Root TS/JS files

| File            | Purpose               | Action                                                          |
| --------------- | --------------------- | --------------------------------------------------------------- |
| `App.tsx`       | Vite SPA router shell | **KEEP** (playground)                                           |
| `main.tsx`      | Vite entry            | keep                                                            |
| `global.css`    | Tailwind base         | copy to `packages/ui/styles/globals.css` then import in Next.js |
| `vite-env.d.ts` | Vite typing           | keep (playground)                                               |

\### 2.2 `app/tests/`
Vitest health test; keep for CI sanity while migrating.

### 2.3 `components/`

The folder is already subdivided. Proposed mapping:

| Sub‑folder                                                                                                                                | Representative files | Target package                                                                                         |
| ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------ |
| root atoms (`CTA`, `FeatureCard`, `FeatureGrid`, `Header`, `Footer`, `Hero`, `HowItWorks`, `WelcomeScreen`)                               | marketing‑only       | **Move** → `apps/web/app/(marketing)/` or delete if duplicated in Next.js landing                      |
| `admin/ModelConfigPanel.tsx`                                                                                                              | admin UI             | **Move** → `apps/web/app/admin/models/page.tsx`                                                        |
| `chat/*` (`ContextUploadMenu`, `MicButton`)                                                                                               | chat input extras    | **Move** → `packages/ui/src/components/chat/`                                                          |
| `nav/UserPopover.tsx`                                                                                                                     | avatar popover       | **Move** → `packages/ui/src/components/nav/`                                                           |
| `ui/` primitives (button, card, popover, select, textarea …)                                                                              | Shadcn generated     | **DELETE dupes**; identical versions already live in Turborepo `packages/ui`. Keep only one set there. |
| `FileUploadZone.tsx`                                                                                                                      | drag‑and‑drop        | **Move** → `packages/ui/src/components/chat/`                                                          |
| `AgentActivityDisplay.tsx`, `ActivityTimeline.tsx`, `AgentActivityStream.tsx`, `ChatHistory.tsx`, `ChatMessagesView.tsx`, `InputForm.tsx` | core chat panel      | **Move** → `apps/web/app/chat/` directory                                                              |

### 2.4 `hooks/`, `lib/`, `store/`

| Folder                                        | Use         | Action                                                                                           |
| --------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------ |
| `hooks/useDynamicAuth.ts` `useWallet.ts`      | Web3 auth   | **Move** → `packages/ui/src/hooks/`                                                              |
| `lib/dynamic.ts, utils.ts, walletProvider.ts` | helper libs | Combine into single `lib/web3.ts` in UI package                                                  |
| `store/usePrefs.ts`                           | Zustand     | Move to `apps/web/src/store` (only for playground) or convert to Next.js server components later |

\### 2.5 `pages/`

These Vite pages = marketing+dash demos. If you keep the Vite playground, leave them; for production, replicate in Next.js `app/` router and delete here.

---

\## 3 `frontend/web/HandyWriterz/` —the **Turborepo workspace**

This is the long‑term keeper.

### 3.1 `apps/web/`

| Path                       | Purpose                   | Action                                |
| -------------------------- | ------------------------- | ------------------------------------- |
| `app/layout.tsx`           | Next.js root layout       | Keep                                  |
| `app/page.tsx`             | index (marketing landing) | keep / extend                         |
| `tailwind.config.ts`       | Tailwind shared           | keep; extend with any missing colours |
| `components/providers.tsx` | Theme & Radix provider    | keep                                  |

Add:

```
app/chat/page.tsx          → imports ChatPanel from packages/ui
app/originality/[id]/page  → Turnitin workbench
app/admin/models/page.tsx  → Model config panel
```

\### 3.2 Packages

| Package                             | Purpose                                    | Action                                                  |
| ----------------------------------- | ------------------------------------------ | ------------------------------------------------------- |
| `packages/ui`                       | Shadcn primitives + shared chat components | **Centralise all UI primitives here** (merge from Vite) |
| `eslint-config` `typescript-config` | base configs                               | keep                                                    |
| `apps/*`                            | only `web` so far                          | keep                                                    |

---

\## 4 Deduplication summary

| Keep                                                    | Remove                                                   |
| ------------------------------------------------------- | -------------------------------------------------------- |
| **Turborepo** (`frontend/web/HandyWriterz`) — prod code | Duplicate Shadcn components from old `src/components/ui` |
| **Vite app** (`frontend/src`) — playground/dev only     | any marketing components that get rebuilt in Next.js     |
| single `tailwind.config.ts` at workspace root           | `frontend/tailwind.config.ts` once migration done        |
| single ESLint + TS configs under workspace              | old root `eslint.config.js`, `tsconfig.*.json`           |

---

\## 5 Updated final structure (after migration)

```
frontend/
└── HandyWriterz/              # ← Turborepo root
    ├── apps/
    │   └── web/
    │       ├── app/
    │       │   ├── layout.tsx
    │       │   ├── page.tsx
    │       │   ├── chat/page.tsx
    │       │   ├── originality/[traceId]/page.tsx
    │       │   └── admin/models/page.tsx
    │       ├── components.json
    │       ├── tailwind.config.ts
    │       └── next.config.mjs
    ├── packages/
    │   └── ui/
    │       ├── src/components/
    │       │   ├── ui primitives (button, card …)
    │       │   ├── chat/
    │       │   │   ├── PromptEditor.tsx
    │       │   │   ├── ContextUploadMenu.tsx
    │       │   │   ├── MicButton.tsx
    │       │   │   └── AgentTimeline.tsx
    │       │   ├── nav/UserPopover.tsx
    │       │   └── admin/ModelConfigPanel.tsx
    │       ├── src/hooks/
    │       │   ├── useDynamicAuth.ts
    │       │   └── useWallet.ts
    │       └── styles/globals.css
    ├── packages/eslint-config/
    ├── packages/typescript-config/
    └── turbo.json
playground/                   # optional: old Vite SPA kept for quick demos
    └── (copy of former frontline src)
```

---

\## 6 What to do next

1. **Move files** following the map (Git `mv` to preserve history).
2. Update **import paths** (`@/components/ui/button` → `@ui/button` via `paths` in `tsconfig.json`).
3. Adjust **Tailwind `content`** arrays to include `packages/ui/**/*.{ts,tsx}`.
4. Run `pnpm i && turbo build` — both Next.js and playground should compile.
5. Delete duplicate configs once build passes.
6. Add **Playwright test** ensuring `/chat` renders from Next.js route.

After this sweep, the frontend tree is coherent: **Next.js (prod) + UI monorepo package** with zero duplication; the old Vite SPA remains only as an optional sandbox until the whole team feels comfortable deleting it.

