# ADR-002: Single Repository, Not Polyrepo

**Status:** Accepted
**Date:** 2026-08-14

## Context

A sister project at Cognisive Labs, Kram, splits into four repositories
(hub/docs, API, web, infra) because it spans two incompatible toolchains
(Elixir/Mix and TypeScript/pnpm) across a multi-person team with clear
per-repo ownership boundaries.

Cake Lake is a single JavaScript/TypeScript codebase (see
[ADR-001](ADR-001-tech-stack.md)), built by a small team (effectively one
external build, no client-side engineering org to divide ownership across),
for a client with one shop today. There's no toolchain split, no team big
enough to need repo-level ownership boundaries, and no independent-deploy
requirement — the frontend and backend ship together at this stage.

## Decision

Everything lives in this one repository, `cognisivelabs/cakelake`:
planning docs, design-system mirror, prototype, and — once development
starts — the `app/` codebase itself (Next.js frontend + Express backend as
sibling directories, or a lightweight workspace if that becomes useful).

No separate `cakelake-api`, `cakelake-web`, or `cakelake-infra` repos.

## Rationale

**The reason Kram split doesn't apply here.** Kram's polyrepo decision
(see Kram ADR-007) turns on toolchain incompatibility: Elixir/Mix and
TypeScript/pnpm share nothing, so splitting lets each use its native
tooling without one wrapping the other. Cake Lake's frontend and backend
are both JavaScript — the toolchain argument for splitting doesn't exist.

**One repo matches one small build.** There's no multi-team ownership
question to resolve with repo boundaries — repo-per-concern solves a
coordination problem Cake Lake doesn't have yet. If that changes (a real
client-side team forms, frontend and backend get built by different
people on different schedules), this ADR is exactly the kind of decision
to revisit and supersede.

**Keeps the planning trail and the code trail in one place.** The
project's whole reason for existing as a repo *before* any code was written
was to keep requirements, design references, and decisions versioned
together (see root [README](../../README.md), "Workflow"). Splitting into
a hub-plus-code-repos structure now would separate that trail from the code
it justifies, for no toolchain benefit.

## Consequences

- Simple local setup: clone one repo, work in `app/frontend` and
  `app/backend` (or equivalent) as needed
- One CI/CD pipeline to set up, not several — acceptable since frontend and
  backend changes are expected to ship together at this scale and cadence
- If `app/` grows large enough that frontend and backend builds start
  meaningfully slowing each other down in CI, that's the trigger to revisit
  this decision — not before
- No cross-repo issue-linking process needed (contrast with Kram's
  `Closes cognisivelabs/kram#XX` convention) — issues, if tracked formally
  at all, live against this one repo

## Alternatives Considered

**Polyrepo, mirroring Kram (hub + api + web + infra)**
Would provide clean ownership boundaries and independent deploy pipelines.
Rejected: those benefits solve a multi-team coordination problem this
project doesn't have. The overhead (four repos to clone, cross-repo issue
linking, four CI pipelines) is pure cost with no offsetting benefit at
Cake Lake's scale.

**Monorepo tooling (Turborepo/Nx) within this one repo**
Considered for when `app/` is scaffolded — frontend and backend as workspace
packages with shared types. Not rejected, just not decided yet: it's a
reasonable choice once there's actual code to organize, but adopting build
orchestration tooling before there's a build to orchestrate would be
premature. Revisit at that point, informed by whatever shared-code needs
actually show up (e.g. sharing TypeScript types for the API contract
between frontend and backend).
