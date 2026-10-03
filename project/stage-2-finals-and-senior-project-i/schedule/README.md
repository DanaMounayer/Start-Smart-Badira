# Schedule

The project schedule as a Gantt chart, built with the `pgfgantt` LaTeX package.

**[`BADIRA-Gantt.pdf`](BADIRA-Gantt.pdf)** — one A3 landscape page.

## Coverage

36 weeks, September → May. Eight phases, 39 tasks, 7 milestones, covering the full SDLC through
testing.

| Phase | Weeks |
|---|---|
| 1 Planning & requirements | 1–10 |
| 2 Data acquisition & governance | 6–20 |
| 3 System analysis & design | 9–18 |
| 4 Implementation (modules M1–M8) | 16–28 |
| 5 Integration | 27–30 |
| 6 Testing & validation | 26–34 |
| 7 Extension to further clinical tasks | 29–34 |
| 8 Documentation & closure | 1–36 |

Testing starts before implementation ends, because that is how it actually happens. Data acquisition
runs 15 weeks and crosses both semesters — it is the critical path, and the dependency arrows in the
chart show it.

## Editing

`BADIRA-Gantt.tex` compiles with pdfLaTeX (Overleaf works directly). Two macros at the top set the
academic year:

```latex
\newcommand{\YearA}{2025}   % September of this year
\newcommand{\YearB}{2026}   % ... through May of this year
```
