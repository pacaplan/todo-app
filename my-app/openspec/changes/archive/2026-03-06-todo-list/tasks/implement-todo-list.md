# Task: Implement TODO list

## Goal

Build the complete TODO list feature — add, toggle, delete items with localStorage persistence — replacing the default Next.js landing page with a functional TODO app.

## Background

You MUST read these files before starting:
- `openspec/changes/todo-list/design.md` for full design details
- `openspec/changes/todo-list/specs/todo-crud/spec.md` for all acceptance criteria

This is a fresh Next.js 16 App Router project with Tailwind CSS v4 and TypeScript. The only app code is the default create-next-app landing page at `app/page.tsx`, which should be replaced entirely.

**Component structure (multi-file split):**

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

**Data model:**

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

**Key design decisions:**

- **Sorting**: `useTodos` returns items sorted — active items first (by createdAt ascending), then completed items (by createdAt ascending). Sorting happens in the hook.
- **Delete confirmation**: Inline, not a browser dialog. When the user clicks delete, the delete button transforms into Cancel/Confirm buttons within the same item row. Confirmation state is local to `TodoItem`.
- **localStorage persistence**: Load on mount via `useEffect` (avoids SSR hydration mismatch). Save on every state change via `useEffect`. Wrap all localStorage calls in try/catch — if unavailable, silently fall back to in-memory state. Storage key: `"todos"`.
- **Data flow**: `page.tsx` (server) renders `TodoList` (client). `TodoList` calls `useTodos()` which returns `{ todos, addTodo, toggleTodo, deleteTodo }`. `AddForm` calls `addTodo(text)`. Each `TodoItem` calls `toggleTodo(id)` and `deleteTodo(id)`.
- **Empty input**: Silently ignored (no error shown, no item added).
- **Empty state**: Show a placeholder message (e.g., "No tasks yet") when `todos.length === 0`.
- **Styling**: Use Tailwind CSS. Completed items get strikethrough styling.

## Spec

### Requirement: Add Item

The system SHALL allow users to create new TODO items by submitting text via an input form.

#### Scenario: Successful item creation
- **WHEN** user submits non-empty text in the add form
- **THEN** a new incomplete TODO item is added to the list and the input is cleared

#### Scenario: Empty input submission
- **WHEN** user submits empty or whitespace-only input
- **THEN** no item is added and no error is shown (silent no-op)

### Requirement: Toggle Completion

The system SHALL allow users to toggle TODO items between complete and incomplete states.

#### Scenario: Mark item as complete
- **WHEN** user toggles an incomplete item
- **THEN** the item is marked complete with strikethrough styling and moves to the bottom of the list

#### Scenario: Mark item as incomplete
- **WHEN** user toggles a complete item
- **THEN** the item is marked incomplete and moves back among active items

### Requirement: Delete Item

The system SHALL allow users to delete TODO items with a confirmation step.

#### Scenario: Delete with confirmation
- **WHEN** user clicks delete on an item
- **THEN** a confirmation prompt is shown before removal

#### Scenario: Confirm deletion
- **WHEN** user confirms the deletion prompt
- **THEN** the item is permanently removed from the list

#### Scenario: Cancel deletion
- **WHEN** user cancels the deletion prompt
- **THEN** the item remains unchanged in the list

### Requirement: Persistence

The system SHALL persist TODO items to localStorage so they survive page refreshes.

#### Scenario: Save on mutation
- **WHEN** items are added, toggled, or deleted
- **THEN** the updated list is saved to localStorage

#### Scenario: Restore on load
- **WHEN** the page loads and localStorage contains saved items
- **THEN** those items are restored to the list

#### Scenario: localStorage unavailable
- **WHEN** localStorage is unavailable (e.g., private browsing)
- **THEN** the app functions normally with in-memory state only, without showing an error (items will not persist across refreshes)

### Requirement: Empty State

The system SHALL display a placeholder message when the TODO list contains no items.

#### Scenario: No items exist
- **WHEN** no items exist in the list
- **THEN** a placeholder message is displayed (e.g., "No tasks yet")

## Done When

All eleven spec scenarios above are satisfied. The app renders a functional TODO list at the root route with add, toggle, delete (with inline confirmation), localStorage persistence, and empty state placeholder.
