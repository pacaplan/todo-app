# todo-crud Specification

## Purpose
TBD - created by archiving change todo-list. Update Purpose after archive.
## Requirements
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

