# Excel Interview

### A live, in-browser Excel assessment for hiring — real work on a real grid, not a cheatable take-home.

A browser-based tool that lets a hiring manager watch a candidate do actual Excel work during a video call. The candidate works in a real spreadsheet with a live formula engine; the tool grades technique automatically and seals the result so it can't be tampered with.

**[▶ Live tool](https://michaelnocito.github.io/excel-interview/)** &nbsp;·&nbsp; **[Result viewer](https://michaelnocito.github.io/excel-interview/viewer.html)**

---

## Why it exists

Take-home Excel tests are easy to game — a candidate can paste an answer or have someone else do it. This runs the assessment **live, in front of the interviewer**, on a real grid, and grades *how* the answer was reached, not just the final value. A hardcoded number scores differently from a correct formula.

## How it works

1. The interviewer enters the candidate's name, picks a task template, and sets where results should be emailed.
2. The candidate works through a sequence of timed migration tasks in a real spreadsheet (lookup, format, clean, split, combine, validate).
3. Each cell is graded on **both** the displayed value **and** the underlying formula:
   - **Correct** — right answer, right method
   - **Hardcoded** — right answer typed by hand instead of computed (flagged as an anti-cheat signal)
   - **Incorrect** — wrong result
4. On completion the candidate sees a neutral "Session Complete" screen with a reference code — **no score is shown to the candidate.**
5. The full result is sealed (AES-GCM encrypted) and auto-downloaded; the interviewer opens it in the **viewer** for a per-task, cell-by-cell breakdown.

## Task templates

Five selectable templates, each built on the same six-task spine:

| Template | Scenario |
|---|---|
| Data Migration Analyst — Entry | Clean 8-row migration set |
| Data Migration Analyst — Mid/Senior | 12-row set with messy edge cases |
| Finance | Vendor invoices / GL reconciliation |
| Junior Data Analyst | Product sales |
| Data Analyst | Customer transactions with dedup + lookup |

Skills covered: `VLOOKUP` / lookups · number formatting · text cleanup (`TRIM`/`PROPER`/`UPPER`) · splitting columns · combining keys with formulas · validation logic (`IF`).

## Tech

- **100% client-side, no backend** — fully static, hosted on GitHub Pages.
- Real spreadsheet grid + formula engine via [Univer](https://univer.ai) (Apache-2.0).
- React shell (Vite build).
- Autosave to IndexedDB every 10s with mid-session recovery.
- Sealed result export (AES-GCM) + optional emailed results (EmailJS).
- Grading reads both displayed values and formulas to distinguish computed answers from hardcoded ones.

## Status

Working and live. Email delivery of results requires three EmailJS keys set as repository secrets; without them everything works and the sealed result still downloads locally.

---

*Built by [Michael Nocito](https://www.linkedin.com/in/michaelnocito).*
