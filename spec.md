# Take-Home Task

# Company‑Data Mini‑Platform

**Goal:** Build a small, production‑style system that ingests a messy company CSV, cleans & enriches the data, stores it in Postgres, and exposes a minimal API + React UI so we can filter the records by **country**, **employee size**, and **domain**.

> Stack: TypeScript • Next.js • React • Postgres (we recommend Supabase) • Deployed on Vercel
> 

Approx. time‑box: **2–3 focused hours** — ship something lean but functional.

---

## Assets Provided

- [**dirty_real_companies_sample.csv**](https://docs.google.com/spreadsheets/d/1-HBD1vQcxToZJErtmyEgXLZTUxIiE2e6_usI-8O8Egc/edit?usp=sharing) (25 rows).
    
    Needs heavy cleaning: inconsistent domains, locations, country codes, employee‑size formats, missing values, etc.
    

---

## 1 — Functional Requirements

| # | User Story | Acceptance Criteria |
| --- | --- | --- |
| 1 | **Upload CSV** | Drag‑and‑drop or file picker uploads the provided file to `POST /api/upload`. 

Back‑end parses, *cleans* & *enriches (with AI agents)*, then upserts rows into Postgres. |
| 2 | **Filter Companies** | Front‑end table lists companies with three filters: `country`, `employee_size`, `domain` (partial match). Uses `GET /api/companies` with query params. |
| 3 | **Ingest More Data** | Same upload endpoint accepts additional CSVs later. Duplicate handling is graceful. |

### Cleaning & Enrichment

- **country** → English country name (e.g., `"us"` → `United States`).
- **employee_size** → One bucket from:
    
    `1‑10`, `11‑50`, `51‑200`, `201‑500`, `501‑1 000`, `1 001‑5 000`, `5 001‑10 000`, `10 000+`.
    
- **domain** → lower‑case valid host (no spaces). Blank if unknown.
- **city** etc. are optional; store raw row in one `raw_json` column for traceability.

> Enrichment freedom: heuristics, public APIs, or LLM calls — document your approach.
> 

---

## 2 — API

```
GET  /api/companies?country=United%20States&employee_size=201-500&domain=amazon
POST /api/upload; multipart/form-data (CSV file)

```

*(Optional helpers)*

```
GET /api/countries
GET /api/employee-sizes

```

---

## 3 — Deliverables

1. **Live Vercel URL** demonstrating upload → table view → filtered results.
2. Public **Git repository** with:
    - All source (Next.js app & cleaning logic).
3. *(Optional)* 90‑second Loom/video walkthrough.

---

## 4. Evaluation

We want to see *how you think*: your design notes, structuring of the unorganized problem, and the trade‑offs you considered during implementation.

---

## 5 — Hints & Tips

- Supabase makes Postgres effortless.
- Don’t over‑engineer.
- Use any table/grid component you like (e.g., shadcn/ui + TanStack Table).
- Ask any questions :)

---

### Submission

1. **Email/DM** the Vercel link + repo when you’re done.
2. We’ll schedule a 30‑min review call to dive into choices & next steps.

Looking forward to seeing what you build!