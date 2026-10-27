# GO SAVE — PocketSmart AI: Your Smart Budget & Recommendation Assistant

GO SAVE is a responsive, student-centric personal finance and budget recommendation web application designed for students and individuals to track income and expenses in Indian Rupees (₹), set monthly and category budget caps, monitor savings goals, and receive personalized, practical financial recommendations through a server-side Gemini AI assistant.

> [!IMPORTANT]
> **Confirmed User Review & Design Decisions:**
> - **Application Branding**: Titled **GO SAVE** (Subtitle: *PocketSmart AI — Your Smart Budget & Recommendation Assistant*), proudly featuring the attribution badge: **Made by simple boys**.
> - **Demo Scenario**: Pre-configured with the **Day Scholar Commuter** financial profile (₹10,000 monthly budget, public transit/metro passes, college canteen expenses, textbooks/stationery, college project prints, and recreational pocket money).
> - **AI Advisor Tone**: **Practical Advisor** focusing on transparent category breakdown, practical student cutback opportunities, actionable daily tips, and disciplined milestone progression without fabricating financial figures.
> - **Calculation Integrity**: Financial balances, totals, remaining funds, and savings rates are 100% deterministically calculated in TypeScript. Gemini is strictly utilized for contextual advice and analysis.

---

## 1. Overview & Core Concept

- **What It Does**:
  - Provides a single-glance personal finance dashboard displaying Total Income, Total Expenses, Remaining Balance, and Savings Rate.
  - Allows full management (Add, Edit, Delete, Filter, Search) of transactions categorized into Food, Travel, Education, Shopping, Bills, Health, Entertainment, and Other.
  - Interactive Monthly & Category Budget Planner with dynamic progress indicators and visual threshold alerts (approaching 80%, exceeding 100%).
  - Multi-goal Savings Tracker calculating timeline progress, remaining required savings, and milestone health.
  - Server-side Gemini AI Financial Assistant (`gemini-3.8-flash`) delivering data-grounded insights, customized recommendations, and quick prompt chips.
  - LocalStorage persistence with seamless 1-click sample data load and complete reset capability.
- **Target Audience / Persona**: College students, commuters, day scholars, and young adults managing fixed monthly allowances or stipends.
- **Key Value**: Replaces guesswork with disciplined budget visibility, real-time math accuracy, and intelligent savings guidance suitable for college viva demonstration.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **First-Time Load**: Lands on a populated dashboard via pre-loaded "Day Scholar Commuter" demo data (₹10,000 income, realistic expenses) with option to reset or start fresh.
2. **Transaction Management**: User clicks "+ New Transaction", fills out description, ₹ amount, type (Income/Expense), category, and date. Dashboard stats, category breakdown, budget utilization, and AI context sync immediately.
3. **Budget Planning & Warning**: User sets monthly overall budget limit and category caps (e.g. ₹2,000 for Travel, ₹3,000 for Food). Visual warning badges and progress meters alert user when nearing or crossing limits.
4. **Savings Goals**: User sets a goal (e.g., "Semester Exam Fee & Certification", "Laptop Upgrade Fund"), sets target ₹ and date, logs contributions, and visualizes milestone percentage.
5. **Smart AI Assistant Tab & Drawer**: User can ask pre-populated questions ("How can I save more money?", "Which category has the highest spending?", "Suggest a budget for next month") or custom queries. Gemini analyzes actual totals and provides realistic tips.

### Visual Identity & Theme
- **Color Palette**:
  - Primary Canvas: Deep Navy Blue headers and accents (`#0A192F`, `#0F2444`), crisp clean white surfaces (`#FFFFFF`), and soft cool slate canvas (`#F8FAFC`).
  - Brand Accent: Vivid Teal (`#0D9488` / `#14B8A6`) for primary interactive buttons, goal milestones, and positive savings metrics.
  - Status Indicators: Emerald Green (`#16A34A`) for Income/Positive Balance, Crimson/Rose (`#E11D48`) for Expenses/Over-budget, Amber (`#D97706`) for budget warning zones.
- **Typography & Hierarchy**:
  - Display Font: `Plus Jakarta Sans` for clean, professional executive dashboard hierarchy.
  - Body & Form: `DM Sans` for readable microcopy and field inputs.
  - Data Numerals: Monospace tabular numbers (`font-mono tabular-nums`) for currency figures (₹) to prevent visual misalignment.
- **Layout Structure**:
  - Top Bar Contract: Brand zone ("GO SAVE" with teal pocket emblem), Navigation tabs (Dashboard, Transactions, Budget Planner, Savings Goals, AI Advisor), and Viva Demo / Reset action buttons.
  - Footer & Attribution: Prominent, elegant footer lockup: *"GO SAVE · Made by simple boys"* with educational disclaimer note.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Server-Side Gemini API via Vite Middleware & Express Proxy**
  - *Chosen Approach*: Expose `/api/ai/advisor` on the server using `@google/genai` and `gemini-3.8-flash`. API key remains strictly on the server (`process.env.GEMINI_API_KEY`).
  - *Why*: Complies with AI Studio security standards and guarantees that zero client-side keys are exposed.
- **Decision 2: Deterministic Financial Engine vs. AI Interpretation**
  - *Chosen Approach*: Pure TypeScript state engine for all sums, remaining balance, savings rate, and category rollups. AI receives structured JSON context and is prohibited from inventing transactions or asserting fake math.
  - *Why*: Ensures 100% calculation accuracy for college evaluation and financial trustworthiness.
- **Decision 3: LocalStorage with One-Click Demo Seeder**
  - *Chosen Approach*: Automatically sync state to `localStorage` under `gosave_financial_data_v1`. Provide "Load Demo Data" (Day Scholar ₹10k preset) and "Reset to Fresh" buttons.
  - *Why*: Reliable demonstration in sandboxed browsers without requiring external database accounts.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        GO SAVE Web Application                         │
├────────────────────────────────────────────────────────────────────────┤
│ [Top Navigation: Brand "GO SAVE" | Tabs | Demo Seeder | Reset]        │
├────────────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────┐  ┌────────────────────────────────────────┐ │
│  │   Financial Summary   │  │       Category & Budget Visuals        │ │
│  │  - Total Income (₹)   │  │  - Spending by Category (Donut/Bars)   │ │
│  │  - Total Expense (₹)  │  │  - Monthly Budget Utilization Meter    │ │
│  │  - Remaining Balance  │  │  - Active Over-Budget Warnings         │ │
│  │  - Savings Rate (%)   │  │  - Recent Transactions Feed            │ │
│  └───────────────────────┘  └────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────────────────────┤
│  [Views: Transactions Ledger | Budget Planner | Goals | AI Assistant]  │
├────────────────────────────────────────────────────────────────────────┤
│                       LocalStorage State Layer                         │
│       (transactions, budgets, savings goals, preferences)              │
├────────────────────────────────────────────────────────────────────────┤
│             Server-Side Gemini Route: /api/ai/advisor                  │
│       (Express / Vite Middleware with @google/genai SDK)               │
├────────────────────────────────────────────────────────────────────────┤
│        Footer: "GO SAVE — Made by simple boys" · Academic Viva Demo    │
└────────────────────────────────────────────────────────────────────────┘
```

### Core Entities & Types
- `Transaction`: `{ id: string; description: string; amount: number; type: 'income' | 'expense'; category: TransactionCategory; date: string; notes?: string }`
- `CategoryBudget`: `{ category: TransactionCategory; limit: number }`
- `MonthlyBudget`: `{ totalLimit: number; categoryBudgets: Record<TransactionCategory, number> }`
- `SavingsGoal`: `{ id: string; name: string; targetAmount: number; currentAmount: number; targetDate: string; category?: string }`
- `AdvisorMessage`: `{ id: string; role: 'user' | 'assistant'; text: string; timestamp: string }`

### Verification & Quality Gates
- Compile clean check with `tsc --noEmit` and `compile_applet`.
- Verify Indian Rupee (₹) formatting with negative balance handling.
- Verify add/edit/delete flows for transactions and real-time chart synchronization.
- Test server-side Gemini prompt responses and offline error handling.
