import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoList from "../TodoList";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] ?? null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: jest.fn((index: number) => Object.keys(store)[index] ?? null),
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

let uuidCounter = 0;
Object.defineProperty(globalThis, "crypto", {
  value: {
    randomUUID: () => `test-uuid-${++uuidCounter}`,
  },
});

beforeEach(() => {
  localStorageMock.clear();
  jest.clearAllMocks();
  uuidCounter = 0;
});

describe("TodoList", () => {
  // Scenario: Empty state - No items exist
  test("shows placeholder message when no items exist", () => {
    render(<TodoList />);
    expect(screen.getByText("No tasks yet")).toBeInTheDocument();
  });

  // Scenario: Successful item creation
  test("adds a new todo item when text is submitted", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const input = screen.getByPlaceholderText(/add/i);
    await user.type(input, "Buy groceries");
    await user.keyboard("{Enter}");

    expect(screen.getByText("Buy groceries")).toBeInTheDocument();
    expect(input).toHaveValue("");
  });

  // Scenario: Empty input submission
  test("does not add item when empty input is submitted", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    screen.getByPlaceholderText(/add/i);
    await user.keyboard("{Enter}");

    expect(screen.getByText("No tasks yet")).toBeInTheDocument();
  });

  // Scenario: Mark item as complete (toggle + strikethrough)
  test("marks item as complete with strikethrough when toggled", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const input = screen.getByPlaceholderText(/add/i);
    await user.type(input, "Test item");
    await user.keyboard("{Enter}");

    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);

    expect(checkbox).toBeChecked();
    // Check for strikethrough styling
    const text = screen.getByText("Test item");
    expect(text).toHaveClass("line-through");
  });

  // Scenario: Mark item as incomplete
  test("marks item as incomplete when toggled again", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const input = screen.getByPlaceholderText(/add/i);
    await user.type(input, "Test item");
    await user.keyboard("{Enter}");

    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);
    await user.click(checkbox);

    expect(checkbox).not.toBeChecked();
  });

  // Scenario: Delete with confirmation - shows cancel/confirm
  test("shows confirmation buttons when delete is clicked", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const input = screen.getByPlaceholderText(/add/i);
    await user.type(input, "Item to delete");
    await user.keyboard("{Enter}");

    const deleteBtn = screen.getByRole("button", { name: /delete/i });
    await user.click(deleteBtn);

    expect(screen.getByRole("button", { name: /confirm/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  // Scenario: Confirm deletion
  test("removes item when deletion is confirmed", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const input = screen.getByPlaceholderText(/add/i);
    await user.type(input, "Item to delete");
    await user.keyboard("{Enter}");

    const deleteBtn = screen.getByRole("button", { name: /delete/i });
    await user.click(deleteBtn);

    const confirmBtn = screen.getByRole("button", { name: /confirm/i });
    await user.click(confirmBtn);

    expect(screen.queryByText("Item to delete")).not.toBeInTheDocument();
    expect(screen.getByText("No tasks yet")).toBeInTheDocument();
  });

  // Scenario: Cancel deletion
  test("keeps item when deletion is cancelled", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const input = screen.getByPlaceholderText(/add/i);
    await user.type(input, "Item to keep");
    await user.keyboard("{Enter}");

    const deleteBtn = screen.getByRole("button", { name: /delete/i });
    await user.click(deleteBtn);

    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelBtn);

    expect(screen.getByText("Item to keep")).toBeInTheDocument();
    // Delete button should be back
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });
});
