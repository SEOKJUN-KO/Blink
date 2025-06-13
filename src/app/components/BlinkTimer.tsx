'use client';

interface BlinkTimerProps {
  recentBlinkTime: number;
}

export default function BlinkTimer({ recentBlinkTime }: BlinkTimerProps) {
  return (
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
  );
} 