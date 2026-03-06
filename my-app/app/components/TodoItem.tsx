"use client";

import { useState } from "react";
import type { Todo } from "../hooks/useTodos";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const [confirming, setConfirming] = useState(false);

  return (
    <li className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="h-4 w-4 rounded"
      />
      <span
        className={`flex-1 ${
          todo.completed ? "line-through text-gray-400" : "text-gray-900 dark:text-white"
        }`}
      >
        {todo.text}
      </span>
      {confirming ? (
        <div className="flex gap-2">
          <button
            onClick={() => setConfirming(false)}
            className="rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="rounded px-2 py-1 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            Confirm
          </button>
        </div>
      ) : (
        <button
          onClick={() => setConfirming(true)}
          className="rounded px-2 py-1 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          Delete
        </button>
      )}
    </li>
  );
}
