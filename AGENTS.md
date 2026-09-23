# AGENTS.md — Operating Rules for AI Agents

## Standing Authorization & Operating Model
- **Standing Merge Authority**: Governed by `POLICY_MERGE_AUTHORITY.md` (`MERGE-AUTHORITY-2026-09-07`). Land verified work to `main` once local verification gates pass.
- **Dual-Layer Architecture**: This repository hosts both the React 19 / Vite web application and the Google Apps Script backend under `appscript/`. Keep both layers in sync.

## Hard Rules
- NEVER delete files, directories, or core modules unless explicitly requested.
- NEVER commit secrets or live API keys. Use `.env.example` with placeholders only.
- Respect physical cell contiguity and columnar standards in Google Sheets (`DB_Character`, `DB_Scene`, `DB_Camera`).
- Never push untested Apps Script code. Verify syntax with `node -c` and run endpoint verification via `npm test` before deployment.

## Working Style & Evidence Discipline
- Ground all documentation and features in verified code and endpoints — never invent capabilities.
- Keep diffs minimal and scoped to the stated task.
- Verify both the React bundle build (`npm run build`) and live endpoint reachability (`npm run test:reachability`) before merging changes.

## Documentation & Visual Sync
After any verified code, schema, API, or configuration change, check whether the change affects public documentation:
```text
VERIFIED CHANGE
→ IDENTIFY AFFECTED DOC/VISUAL SURFACES
→ UPDATE ONLY THOSE SURFACES
→ VERIFY RELATIVE PATHS + TOC ANCHORS + COMMANDS + DIAGRAM SOURCE
→ RUN npm test TO VALIDATE LOCAL AND LIVE INTEGRITY
```

Key surfaces to maintain:
- `README.md` behavior, architecture diagrams, features, commands, and endpoint specs.
- `metadata.json` and GitHub repository topics/description.
- Mermaid architecture diagrams in docs when data flows or services change.
- In-sheet studio reference tables when new vocabulary columns are added.