"use client";

import { useTodos } from "../hooks/useTodos";
import AddForm from "./AddForm";
import TodoItem from "./TodoItem";

export default function TodoList() {
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();

  return (
    <div className="mx-auto w-full max-w-lg p-4">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        TODO List
      </h1>
      <AddForm onAdd={addTodo} />
      <div className="mt-4">
        {todos.length === 0 ? (
          <p className="py-8 text-center text-gray-500">No tasks yet</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
