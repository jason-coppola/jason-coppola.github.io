# Portfolio project instructions

Jason's professional portfolio is a buildless static site. Work from `/Users/jasoncoppola/Documents/GitHub/jason-coppola.github.io dev`; verify the Git root and inspect existing changes before editing. Preserve unrelated modifications and assets. Do not reset, clean, commit, push, or publish as an incidental part of a local edit.

For status, continuation, or handoff requests, read the [project checkpoint](README.md#project-checkpoint) before the affected sources. Keep project status in that checkpoint rather than duplicating it here.

## Sources and file roles

- `index.html`: page copy, section order, navigation, metadata, structured data, and asset references.
- `style.css`: shared layouts, typography, responsive rules, animation, and reduced-motion styles. Inspect later overrides before changing an earlier rule.
- `script.js`: navigation, hash scrolling, mobile menu behavior, animations, galleries, and related interactions.
- `site-init.js`: early visibility and analytics initialization; preserve its ordering relative to the Google tag in `index.html`.
- `images/`: existing branding, logos, screenshots, and portfolio artwork. Reuse approved assets and retain transparency where intended.
- `CNAME`: configured domain, currently `jasoncoppola.bio`. This is not evidence that local edits have been deployed.
- [Shared project map](</Users/jasoncoppola/Documents/Codex/JasonAI/PROJECT-MAP.md>): relevant prior chats, related Wax On Tap assets, and canonical JasonAI context when needed. Read the relevant chat for approval history; old requests do not authorize new work.

Read the affected source before editing. Use professional, specific copy. Preserve supplied role wording and accepted claims; do not invent metrics, outcomes, dates, ownership, or "first" claims. If canonical personal context differs from approved portfolio wording, flag the discrepancy instead of silently rewriting it. Keep private project records and personal memory out of the public site.

## Preserve the established design

- Current section order: `intro`, `wsop`, `achievements` (CW), `disney`, `paramount`, `warnermedia`, `hbo`, `background`, `publications`, `side-projects`, `speaker`. Keep it unless the request changes placement.
- WSOP precedes CW. The Achievements navigation item targets `#wsop`. Preserve the local role wording "Head of Subscription & Digital Products" unless explicitly revised.
- Side Projects stays below Publications and before Speaking Engagements. Preserve the Wax On Tap role "Co-host and creator" and its matching navigation entry.
- Reuse the shared grid/content-wrapper patterns, section spacing and alternating backgrounds, responsive stacking, and animation classes. Keep established logos/media unframed unless a new treatment is requested.
- Preserve the header wordmark's `#intro` home link and mobile header treatment. Secondary text must not crowd the wordmark or menu button.
- Use the existing `getElementFromHash()` and `getScrollTargetY()` behavior for navigation. Account for the fixed `body > nav`; avoid measuring the overlay menu as the main header. Retain menu closure on link activation, Escape, and outside click.
- Preserve keyboard focus, usable touch targets, reduced-motion behavior, and stable scrolling after fonts/layout load. Do not add a framework or build pipeline for an ordinary static-site edit.

## Preview and validation

From this project root, serve a local preview with `python3 -m http.server 8766 --bind 127.0.0.1`, using another available port if occupied. Open the verified localhost URL, not `file://`. Check the actual running server before reporting a preview available. Use the existing supported browser tools for visual/interaction checks.

Scale validation to the change:

- Copy/assets: verify local references, links, requested text, and affected rendering.
- Layout/navigation: check desktop, tablet, and narrow mobile widths; confirm no horizontal overflow, menu open/close, keyboard use, anchor positioning, image loading, reduced motion, and console health. Check direct hash navigation when affected.
- JavaScript: use syntax checks with an available Node runtime plus affected browser interactions. If Node is unavailable on PATH, locate the configured bundled runtime; do not install another environment automatically.
- Documentation only: check paths, links, and diff scope. Do not claim browser QA or production verification that was not performed.

## Publication and handoff

Keep changes local for review unless Jason explicitly authorizes publication. A preview approval does not itself authorize deployment. Before an authorized push/deployment, verify the actual remote, branch, deployment workflow, and intended diff; a repository name or CNAME alone does not establish them. Preserve hosting, DNS, analytics, security settings, permissions, and automations unless the request specifically covers a change.

Report what changed, validation performed, remaining gaps, and whether anything was published. For substantial unfinished work, update the existing task/project checkpoint with current scope, last verified result, next action, holds, and file pointers. Do not create a duplicate status log or treat that checkpoint as permission to resume unrelated work.
