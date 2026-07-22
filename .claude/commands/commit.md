Commit changes with a conventional commit message. Supports two modes depending on the argument passed.

Follow the following commit type convention:

-   `build:` changes to build system or external dependencies
-   `ci:` changes to CI configuration files and scripts
-   `docs:` documentation only changes
-   `feat:` a new feature
-   `fix:` a bug fix
-   `perf:` a code change that improves performance
-   `refactor:` a code change that neither fixes a bug nor adds a feature
-   `style:` changes that do not affect the meaning of the code
-   `test:` adding missing tests or correcting existing tests

---

## Mode 1: `/commit` (default)

Commit already-staged changes.

Steps:

1. Run `git diff --staged` to review what is staged. If nothing is staged, run `git diff` and `git status` to check for unstaged changes — if there are unstaged changes, stage them all with `git add -A` and proceed; if there are no unstaged changes either, tell the user and stop.
2. Draft a single-line commit message in the format `<type>: <description>` based on the staged diff. The description must reflect the overall intent of **all** staged changes — not just the most prominent or first change. If changes span multiple files or areas, identify the common theme or broader scope and describe that. The description should be lowercase, imperative mood, and under 72 characters total. No period at the end. Never include "Co-Authored-By" or any trailer lines.
3. Run `git commit -m "<message>"`.

---

## Mode 2: `/commit split`

Split unstaged changes into multiple focused, meaningful commits.

Steps:

1. Run `git diff` (unstaged) and `git status` to see all unstaged modifications and untracked files. If there are no unstaged changes, tell the user and stop.
2. Analyse the diff and group the changes into logical commits — each commit should represent one meaningful unit of work (e.g. a feature, a bug fix, a refactor). Prefer fewer, broader commits over many tiny ones. Group related files together even if they touch different layers (e.g. a handler + its spec + a DTO change that all serve the same feature belong in one commit). Only split when the changes are clearly unrelated in intent.
3. Present the proposed groupings to the user as a numbered list before doing anything. Each entry should show: the files involved, the commit type, and a draft commit message. Then use `AskUserQuestion` with two options — **"Approve and commit"** (proceeds with the plan as-is) and **"Adjust"** (user provides changes before committing) — so the user can confirm with a single click.
4. Once confirmed, for each group in order:
   a. Stage only the relevant files/hunks with `git add <files>` (use `-p` for partial staging if a file spans multiple groups).
   b. Commit with `git commit -m "<message>"`.
5. After all commits are done, run `git log --oneline -<n>` (where n is the number of commits made) so the user can see the result.

Rules:
- Never include "Co-Authored-By" or any trailer lines.
- Each commit message must follow `<type>: <description>` — lowercase, imperative mood, under 72 characters, no period.
- Do not stage or commit unrelated changes together.
