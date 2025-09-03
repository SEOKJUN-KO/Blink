'use client';

import { useState, useEffect } from 'react';

interface BlinkInfoProps {
  lastBlinkAt: Date | null;
  isRunning: boolean;
}

export default function BlinkInfo({ lastBlinkAt, isRunning }: BlinkInfoProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  useEffect(() => {
    if (lastBlinkAt && isRunning) {
      const interval = setInterval(() => {
        const now = new Date();
        const diff = (now.getTime() - lastBlinkAt.getTime()) / 1000;
        setElapsedTime(Number(diff.toFixed(2)));
      }, 100);
      return () => clearInterval(interval);
    } else {
      setElapsedTime(0);
    }
  }, [lastBlinkAt, isRunning]);

  // 최대 999.99초까지 6글자(최대 "999.99")로 고정, 숫자 아닌 경우 '--'로 6글자 맞춤
  const formattedElapsed =
    lastBlinkAt
      ? elapsedTime.toFixed(1).padStart(6, ' ')
      : '  --  ';

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-3 border border-green-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-green-600 font-medium">마지막 깜빡임 간격</p>
          <p
            className="text-xl font-bold text-green-700"
            style={{
              fontVariantNumeric: 'tabular-nums',
              minWidth: '4.5em', // minWidth를 줄여서 왼쪽 여백 감소
              display: 'inline-block',
              textAlign: 'left',
            }}
          >
            {isRunning ? formattedElapsed : '  --  '}초
          </p>
        </div>
      </div>
    </div>
  );
} 