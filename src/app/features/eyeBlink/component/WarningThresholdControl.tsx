'use client';

import { memo } from 'react';

interface WarningThresholdControlProps {
  warningThreshold: number;
  onUpdateThreshold: (threshold: number) => void;
}

const WarningThresholdControl = memo(function WarningThresholdControl({
  warningThreshold,
  onUpdateThreshold,
}: WarningThresholdControlProps) {
  return (
    <div className="flex items-center justify-between bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-3 border border-orange-100">
      <span className="text-xs text-orange-600 font-medium">경고 임계값</span>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onUpdateThreshold(Math.max(1, warningThreshold - 1))}
          className="w-6 h-6 rounded-full bg-orange-200 text-orange-600 text-xs font-bold hover:bg-orange-300"
        >
          -
        </button>
        <span className="text-xs font-medium text-orange-700 min-w-[2rem] text-center">
          {warningThreshold}초
        </span>
        <button
          onClick={() => onUpdateThreshold(warningThreshold + 1)}
          className="w-6 h-6 rounded-full bg-orange-200 text-orange-600 text-xs font-bold hover:bg-orange-300"
        >
          +
        </button>
      </div>
    </div>
  );
});

export default WarningThresholdControl;
