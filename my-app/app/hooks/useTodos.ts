"use client";

import { useState, useEffect, useCallback } from "react";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

const STORAGE_KEY = "todos";

function isValidTodo(t: unknown): t is Todo {
  return (
    t !== null &&
    typeof t === "object" &&
    typeof (t as Todo).id === "string" &&
    typeof (t as Todo).text === "string" &&
    typeof (t as Todo).completed === "boolean" &&
    typeof (t as Todo).createdAt === "number"
  );
}

function loadTodos(): Todo[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(isValidTodo);
    }
  } catch {
    // localStorage unavailable or invalid data - fall back to empty
  }
  return [];
}

function saveTodos(todos: Todo[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // localStorage unavailable - silently ignore
  }
}

function sortTodos(todos: Todo[]): Todo[] {
  const active = todos
    .filter((t) => !t.completed)
    .sort((a, b) => a.createdAt - b.createdAt);
  const completed = todos
    .filter((t) => t.completed)
    .sort((a, b) => a.createdAt - b.createdAt);
  return [...active, ...completed];
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    // Only runs on client; returns [] during SSR since window is undefined
    if (typeof window === "undefined") return [];
    return loadTodos();
  });

  // Save to localStorage on every state change
  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const addTodo = useCallback((text: string) => {
    if (!text.trim()) return;
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      createdAt: Date.now(),
    };
    setTodos((prev) => [...prev, newTodo]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  return {
    todos: sortTodos(todos),
    addTodo,
    toggleTodo,
    deleteTodo,
  };
}
