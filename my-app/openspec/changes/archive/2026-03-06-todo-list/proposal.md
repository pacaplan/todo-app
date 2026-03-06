## Why

This project is a fresh Next.js scaffold with no features built yet. We need to build the core functionality — a TODO list — to turn this empty shell into a working app. The TODO list is intentionally simple in scope: it serves as a learning exercise for the flokay artifact workflow, and a small, well-understood problem domain lets us focus on the process rather than the problem.

## What Changes

- Replace the default Next.js landing page with a functional TODO list UI
- Add ability to create new TODO items via a text input form
- Add ability to mark TODO items as complete/incomplete (toggle)
- Add ability to delete TODO items
- Persist TODO items to localStorage so they survive page refreshes
- Build as a client-side-only feature (no backend, no API routes)

## Capabilities

### New Capabilities

- `todo-crud`: Core TODO item management — add, toggle completion, and delete items from a list. Includes localStorage persistence and empty-state handling.

### Modified Capabilities

(none — greenfield project)

## Impact

- `app/page.tsx` — replaced entirely with TODO list UI
- New client components for the TODO list, individual items, and add form
- No new dependencies required — React state + localStorage + Tailwind CSS
- No backend, API, or database changes
