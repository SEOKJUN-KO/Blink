'use client';

import { useMemo, memo } from 'react';

interface StatusIndicatorProps {
  isRunning: boolean;
}

const StatusIndicator = memo(function StatusIndicator({ isRunning }: StatusIndicatorProps) {
  const statusText = useMemo(() => {
    return isRunning ? '모니터링 중...' : '대기 중';
  }, [isRunning]);

  const statusColor = useMemo(() => {
    return isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-300';
  }, [isRunning]);

  return (
    <div className="flex items-center justify-center space-x-2">
      <div className={`w-2 h-2 rounded-full ${statusColor}`}></div>
      <span className="text-xs text-gray-600">
        {statusText}
      </span>
    </div>
  );
});
export default StatusIndicator;