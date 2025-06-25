export default function StaticContent() {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-3">
        Blink
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
        눈의 건강한 사용을 위한 첫걸음
      </p>
      <div className="mt-4 flex items-center justify-center space-x-1">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
} 