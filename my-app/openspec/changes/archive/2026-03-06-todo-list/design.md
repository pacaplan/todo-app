## Context

Fresh Next.js 16 scaffold (App Router, Tailwind CSS v4, TypeScript) with no features built yet. The app currently shows the default create-next-app landing page. We are building a client-side TODO list with localStorage persistence — no backend.

## Goals / Non-Goals

**Goals:**
- Implement all `todo-crud` spec requirements (add, toggle, delete, persistence, empty state)
- Clean component separation with a custom hook for state and persistence
- Work entirely client-side without a backend

**Non-Goals:**
- Server-side rendering of TODO data
- Backend API, database, or user accounts
- Drag-to-reorder, categories, priorities, or due dates
- Testing infrastructure (out of scope for this change)

## Decisions

### Component structure: multi-file split

```
app/
  page.tsx              Server component, imports TodoList
  components/
    TodoList.tsx         "use client" orchestrator
    TodoItem.tsx         Single item with inline delete confirmation
    AddForm.tsx          Text input + submit button
  hooks/
    useTodos.ts          State management + localStorage persistence
```

**Rationale**: Separating concerns makes each file focused and testable. The hook encapsulates all state logic, keeping components purely presentational.

### Data model

```typescript
interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}
```

- `id` generated via `crypto.randomUUID()`
- `createdAt` stores `Date.now()` at creation time

### Sorting strategy

The `useTodos` hook returns items sorted: active items first (by createdAt ascending), then completed items (by createdAt ascending). Sorting is done in the hook so components don't need to worry about ordering.

### Delete confirmation: inline

When the user clicks delete, the delete button transforms into Cancel/Confirm buttons within the same item row. No browser dialogs or modals. State for the confirmation is local to `TodoItem`.

### localStorage persistence

- Load from localStorage on mount using `useEffect` (avoids SSR hydration mismatch)
- Save to localStorage on every state change via `useEffect`
- Wrap all localStorage calls in try/catch; if unavailable, silently fall back to in-memory state only
- Storage key: `"todos"`

### Data flow

```
page.tsx (server)
  └─ TodoList (client)
       ├─ useTodos() → { todos, addTodo, toggleTodo, deleteTodo }
       ├─ AddForm → calls addTodo(text)
       ├─ TodoItem × N → calls toggleTodo(id), deleteTodo(id)
       └─ Empty state → shown when todos.length === 0
```

## Risks / Trade-offs

- **No SSR for TODO content** — The page shell renders server-side but TODO items hydrate client-side. Acceptable since all data is local.
- **localStorage size limit (~5MB)** — Not a realistic concern for a text-based TODO list.
- **No undo beyond confirmation** — Once deletion is confirmed, it's permanent. Acceptable for this scope.

## Migration Plan

No migration needed — this is a greenfield feature replacing the default landing page. No rollback concerns.

## Open Questions

None — scope and architecture are straightforward.
