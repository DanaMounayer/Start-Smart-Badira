# Task 2 — Finding the Data

Which datasets could actually support a preeclampsia model, and which two to pursue first.

## The deliverable

**[`BADIRA-Task2-Finding-the-Data.pdf`](BADIRA-Task2-Finding-the-Data.pdf)** — nine candidate datasets
examined, assessed and ranked, with 15 numbered sources cited in the text and inside every table.

## The finding that decides everything

> **Row count is not sample size.** The number of women who actually developed preeclampsia is what
> limits any model — and it does not follow cohort size.

RAHMA is the largest cohort on the list (14,568 women) and has the smallest usable case count
(~175, at the reported 1.2% rate). MFMU HRA has 2,539 women and far more cases, because it was
deliberately built from high-risk pregnancies.

## The recommendation

| | Dataset | Why |
|---|---|---|
| **1st** | **MFMU HRA** — High-Risk Aspirin trial | Case count is the binding constraint, and this is the only dataset built to contain cases. 606 women with previous preeclampsia — the strongest checklist factor, and the field nuMoM2b cannot provide. |
| **2nd** | **nuMoM2b** | The only candidate with real measurements over time (three antenatal visits plus delivery), which is what a risk-over-time model needs. |

They are chosen **as a pair**: nuMoM2b is nulliparous by design, so six of the eighteen Woman Schema
fields are structurally empty — exactly what HRA supplies.

**And the practical fact that settles it:** nuMoM2b, MFMU HRA and MFMU LRA are held in the same
repository (NICHD DASH). One application, one Data Use Agreement and one authorised university
signature reach all three.

## Files

| File | What it is |
|---|---|
| `BADIRA-Task2-Finding-the-Data.pdf` / `.docx` | The assessment, with citations |
| `BADIRA-Task2-Schema-Mapping.xlsx` | Woman Schema fields mapped against each candidate dataset |
