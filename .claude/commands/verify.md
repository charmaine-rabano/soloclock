Run the project's verification loop: lint, typecheck, and format check. There is no test runner configured in this repo, so these three checks stand in for it (see CLAUDE.md).

Steps:

1. Run `npm run lint`, `npm run typecheck`, and `npm run format:check`. Run them in that order; you may run them independently but report on all three regardless of earlier failures.
2. Summarize pass/fail for each of the three checks.
3. If any failed, show the relevant error output and fix the issues directly (e.g. run `npm run format` for formatting issues, edit code for lint/type errors), then re-run the failed check(s) to confirm they pass.
4. Do not commit anything as part of this command.
