# Qian Hui Avatar City — staged delivery rules

Read docs/workflow/START_HERE.md, DESIGN.md, PHASES.md and ACCEPTANCE.md before task work. This workflow supersedes older completion reports as the source of current phase status. User instructions take precedence.

## Builder

- Work only on the assigned phase on codex/graphics-upgrade. Never implement later phases before reviewer PASS.
- Preserve existing gameplay, purchases, saves and customization. Do not reset user data to make screenshots look correct.
- Read the assigned phase's allowed paths. Shared src/main.ts and src/style.css edits must be limited to the named phase feature. No unrelated refactoring.
- Submit code, relevant tests, real runtime screenshots, capture metadata and a handoff. No mockup may stand in for a running-game screenshot.
- Commit and push the phase, record its full code commit SHA in the handoff, and STOP with status AWAITING_REVIEW.
- Never author your own PASS, merge main, force-push, or rewrite reviewed commits.
- Fix REVISE findings in the same phase, make a new commit, and resubmit.

## Reviewer

- Review the submitted SHA in a separate task or checkout. Do not trust a builder's completion report as evidence.
- Inspect diff, run checks, operate the changed features and compare screenshots with the reference.
- Write docs/workflow/reviews/PXX-review.md: exact reviewed SHA, PASS or REVISE, evidence, outstanding defects, and next authorized phase.
- PASS applies only to the reviewed code. Later source changes require fresh review. Review-only metadata commits may follow the reviewed code.
- Only the planner/reviewer may advance phase status.
- Main merge requires every phase PASS, final regression PASS and the user's final approval.

## Repository hygiene

Do not commit credentials, local saves, dependencies or build output. Use existing dependencies. Report failed checks honestly. Do not treat a Git commit, push or green automated check as visual acceptance.
