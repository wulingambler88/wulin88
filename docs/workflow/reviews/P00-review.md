# P00 independent review

- Phase: P00 (workflow preparation only)
- Reviewed candidate SHA: `8222a29c259906d711436469e7fade73c13ed3b5`
- Reviewer task identity: `/root/p00_review` (independent reviewer; did not author candidate)
- Date: 2026-09-10
- Decision: **REVISE**
- Next permitted phase: **P00 document corrections and resubmission only. P01 is not authorized.**

## Evidence inspected

Read AGENTS.md, START_HERE.md, DESIGN.md, PHASES.md, ACCEPTANCE.md, both model prompts, P00-handoff.md and the PR template. Inspected the actual [target reference](../../references/target-town.png), which is the supplied pastel town design (not a runtime screenshot).

The worktree was clean and HEAD equalled the reviewed candidate before this review report was written. The baseline-to-candidate diff contains only ten workflow/reference files, with no game source changes. `git ls-remote origin` confirmed:

- `main`: `81f4c9871190abc078c26b050884f26a70da09bb`
- `codex/graphics-upgrade`: `8222a29c259906d711436469e7fade73c13ed3b5`
- `codex/review-workflow`: `8222a29c259906d711436469e7fade73c13ed3b5`

Origin is `https://github.com/wulingambler88/wulin88.git`. The remote advertises the exact locally inspected content commit, including the reference and workflow files. The independent review gate, immutable SHA requirement, no self-approval, preserved player saves, and final user approval before main merge are clearly stated.

## Required corrections

1. **P00 acceptance scope contradicts the common checklist.** ACCEPTANCE.md labels all gameplay checks as required for every phase, and its decision rule rejects any untested required item. P00-handoff.md instead says gameplay checks are NOT_TESTED because P00 is document-only, while PHASES.md defines only remote/document criteria for P00. State an explicit P00 exception in ACCEPTANCE.md: workflow/diff/reference/remote checks apply, runtime visual and game regression checks are not applicable to this metadata-only phase. Also make the generic reviewer prompt route P00 to that checklist. Without this, a PASS would silently waive written requirements.

2. **P01–P04 evidence and test paths are not permitted by their scope rows.** The delivery rules require screenshots, capture metadata, tests and handoffs for each phase, but their allowed-path rows omit `screenshots/phases/PXX`, `docs/workflow/reviews/PXX-handoff.md` and targeted tests/capture scripts. The text explicitly forbids out-of-row modifications. Add a narrowly scoped common allowance for each active phase's evidence, handoff and relevant verification files, plus a clear rule that phase-status advancement belongs to the reviewer. Do not require builders to violate scope to deliver mandatory evidence.

3. **P00 candidate handoff is branch-relative rather than immutable.** P00-handoff.md instructs future reviewers to resolve `origin/codex/review-workflow`, while the reviewer prompt requires a full candidate SHA from the handoff. Record the exact candidate SHA in a subsequent handoff metadata commit so subsequent movement of the branch cannot change what was submitted for review.

## Checks not performed

Game execution, npm checks, gameplay interactions and runtime screenshots: **NOT_TESTED**. No game changes were part of P00, but the current common acceptance wording does not yet mark those checks inapplicable. This report grants no visual or gameplay acceptance. Branch protection and required CI remain explicitly unconfigured; they are not represented as enforced server gates.

After corrections, submit a new exact workflow candidate SHA with its handoff for independent P00 review. PHASES.md remains AWAITING_REVIEW; no implementation phase was advanced.
