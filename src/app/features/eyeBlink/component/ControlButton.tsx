'use client';

import { useMemo, memo } from 'react';

interface ControlButtonProps {
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
}

const ControlButton = memo(function ControlButton({ isRunning, onStart, onStop }: ControlButtonProps) {
  const buttonText = useMemo(() => {
    return isRunning ? '모니터링 중지' : '모니터링 시작';
  }, [isRunning]);

  const buttonIcon = useMemo(() => {
    return isRunning ? '⏹️' : '▶️';
  }, [isRunning]);

  const buttonStyle = useMemo(() => {
    return isRunning
      ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-200'
      : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-200';
  }, [isRunning]);

  return (
    <button 
      className={`w-full py-3 rounded-2xl font-semibold text-base transition-all duration-300 transform active:scale-95 ${buttonStyle}`}
      onClick={isRunning ? onStop : onStart}
    >
      <span className="flex items-center justify-center space-x-2">
        <span>{buttonIcon}</span>
        <span>{buttonText}</span>
      </span>
    </button>
  );
});
export default ControlButton;