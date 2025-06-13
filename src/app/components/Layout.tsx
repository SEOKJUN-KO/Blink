export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <main className="flex flex-col gap-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md w-full max-w-md">
        {children}
      </main>
    </div>
  );
} 