'use client';

interface SettingsProps {
  blinkInterval: number;
  warningSoundEnabled: boolean;
  onBlinkIntervalChange: (value: number) => void;
  onWarningSoundChange: (value: boolean) => void;
  warningVolume: number;
  onWarningVolumeChange: (value: number) => void;
}

export default function Settings({
  blinkInterval,
  warningSoundEnabled,
  onBlinkIntervalChange,
  onWarningSoundChange,
  warningVolume,
  onWarningVolumeChange,
}: SettingsProps) {
  return (
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
          onChange={(e) => onBlinkIntervalChange(Number(e.target.value))}
          min="1"
          className="w-20 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-right"
        />
      </div>

      {/* 경고음 설정 */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-lg font-medium">
          설정치보다 늦게 깜빡이면 경고음을 받을까요?
        </span>
        <label htmlFor="warningSoundToggle" className="relative flex items-center cursor-pointer">
          <input
            type="checkbox"
            id="warningSoundToggle"
            checked={warningSoundEnabled}
            onChange={(e) => onWarningSoundChange(e.target.checked)}
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

      {/* 경고음 볼륨 설정 */}
      <div className="flex items-center justify-between mb-4">
        <label htmlFor="warningVolume" className="text-lg font-medium">
          경고음 볼륨 (0 - 100)
        </label>
        <input
          type="range"
          id="warningVolume"
          min="0"
          max="1"
          step="0.01"
          value={warningVolume}
          onChange={(e) => onWarningVolumeChange(Number(e.target.value))}
          className="w-20 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-right"
        />
      </div>

    </section>
  );
} 