import TodoList from "./components/TodoList";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-3xl px-4 py-16">
        <TodoList />
      </main>
    </div>
  );
}
