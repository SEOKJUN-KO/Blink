'use client';

import { useState } from 'react';

export default function Home() {
  const [recentBlinkTime, setRecentBlinkTime] = useState(0); // 예시 값 (초)
  const [blinkInterval, setBlinkInterval] = useState(5); // 기본값 5초
  const [warningSoundEnabled, setWarningSoundEnabled] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <main className="flex flex-col gap-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-4">Blink</h1>

        {/* 최근 깜빡이는데 걸린 시간 */}
        <section className="mb-6 text-center">
          <h2 className="text-2xl font-semibold mb-2">최근 깜빡이는데 걸린 시간</h2>
          <p className="text-5xl font-extrabold text-blue-600 dark:text-blue-400">
            {recentBlinkTime}
            <span className="text-xl">초</span>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            (이 값은 센서로부터 실시간으로 업데이트될 예정입니다)
          </p>
        </section>

        {/* 설정 창 */}
        <section className="border-t pt-6 border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 text-center">설정</h2>

          {/* 깜빡임 주기 설정 */}
          <div className="flex items-center justify-between mb-4">
            <label htmlFor="blinkInterval" className="text-lg font-medium">
              몇 초에 한 번 깜빡일까요?
            </label>
            <input
              type="number"
              id="blinkInterval"
              value={blinkInterval}
              onChange={(e) => setBlinkInterval(Number(e.target.value))}
              min="1"
              className="w-20 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-right"
            />
          </div>

          {/* 경고음 설정 */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">
              설정치보다 늦게 깜빡이면 경고음을 받을까요?
            </span>
            <label htmlFor="warningSoundToggle" className="relative flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="warningSoundToggle"
                checked={warningSoundEnabled}
                onChange={(e) => setWarningSoundEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
              peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 
              peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] 
              after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border 
              after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all 
              dark:border-gray-600 peer-checked:bg-blue-600">
              </div>
            </label>
          </div>
        </section>
      </main>
    </div>
  );
}
