'use client';

interface BlinkInfoProps {
  lastBlinkInterval: Date;
}

export default function BlinkInfo({ lastBlinkInterval }: BlinkInfoProps) {
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-3 border border-green-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-green-600 font-medium">마지막 깜빡임 간격</p>
          <p className="text-xl font-bold text-green-700">
            {lastBlinkInterval ? `${lastBlinkInterval.toFixed(1)}초` : '--'}
          </p>
        </div>
      </div>
    </div>
  );
} 