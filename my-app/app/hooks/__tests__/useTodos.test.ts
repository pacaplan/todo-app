import { renderHook, act } from "@testing-library/react";
import { useTodos } from "../useTodos";

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

// Mock crypto.randomUUID
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

describe("useTodos", () => {
  // Scenario: Successful item creation
  test("adds a new incomplete todo item when non-empty text is submitted", () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo("Buy groceries");
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].text).toBe("Buy groceries");
    expect(result.current.todos[0].completed).toBe(false);
    expect(result.current.todos[0].id).toBeDefined();
    expect(result.current.todos[0].createdAt).toBeDefined();
  });

  // Scenario: Empty input submission
  test("does not add item when empty text is submitted", () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo("");
    });

    expect(result.current.todos).toHaveLength(0);
  });

  test("does not add item when whitespace-only text is submitted", () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo("   ");
    });

    expect(result.current.todos).toHaveLength(0);
  });

  // Scenario: Mark item as complete
  test("toggles an incomplete item to complete", () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo("Test item");
    });

    const id = result.current.todos[0].id;

    act(() => {
      result.current.toggleTodo(id);
    });

    expect(result.current.todos[0].completed).toBe(true);
  });

  // Scenario: Mark item as incomplete
  test("toggles a complete item back to incomplete", () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo("Test item");
    });

    const id = result.current.todos[0].id;

    act(() => {
      result.current.toggleTodo(id);
    });
    act(() => {
      result.current.toggleTodo(id);
    });

    expect(result.current.todos[0].completed).toBe(false);
  });

  // Scenario: Sorting - active first, then completed
  test("returns active items first then completed items, sorted by createdAt", () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo("First");
    });
    act(() => {
      result.current.addTodo("Second");
    });
    act(() => {
      result.current.addTodo("Third");
    });

    // Complete the first item
    const firstId = result.current.todos[0].id;
    act(() => {
      result.current.toggleTodo(firstId);
    });

    // Active items should come first, completed last
    expect(result.current.todos[0].text).toBe("Second");
    expect(result.current.todos[1].text).toBe("Third");
    expect(result.current.todos[2].text).toBe("First");
    expect(result.current.todos[2].completed).toBe(true);
  });

  // Scenario: Confirm deletion
  test("removes an item when deleted", () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo("To delete");
    });

    const id = result.current.todos[0].id;

    act(() => {
      result.current.deleteTodo(id);
    });

    expect(result.current.todos).toHaveLength(0);
  });

  // Scenario: Save on mutation
  test("saves todos to localStorage on mutation", () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo("Persist me");
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "todos",
      expect.any(String)
    );

    const saved = JSON.parse(
      localStorageMock.setItem.mock.calls[
        localStorageMock.setItem.mock.calls.length - 1
      ][1]
    );
    expect(saved).toHaveLength(1);
    expect(saved[0].text).toBe("Persist me");
  });

  // Scenario: Restore on load
  test("restores todos from localStorage on mount", () => {
    const existingTodos = [
      {
        id: "existing-1",
        text: "Saved item",
        completed: false,
        createdAt: 1000,
      },
    ];
    // Set data in the mock store so the lazy initializer can read it
    localStorageMock.setItem("todos", JSON.stringify(existingTodos));
    jest.clearAllMocks(); // Clear setItem call count from setup

    const { result } = renderHook(() => useTodos());

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].text).toBe("Saved item");
  });

  // Scenario: localStorage unavailable
  test("functions normally when localStorage throws", () => {
    localStorageMock.getItem.mockImplementationOnce(() => {
      throw new Error("localStorage unavailable");
    });

    const { result } = renderHook(() => useTodos());

    // Should not throw, should start with empty array
    expect(result.current.todos).toHaveLength(0);

    act(() => {
      result.current.addTodo("In-memory only");
    });

    expect(result.current.todos).toHaveLength(1);
  });
});
