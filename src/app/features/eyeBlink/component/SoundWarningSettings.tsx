'use client';

import { useMemo, memo } from 'react';

interface WarningSettingsProps {
  isWarningEnabled: boolean;
  onToggleWarning: () => void;
}

const SoundWarningSettings = memo(function WarningSettings({ 
  isWarningEnabled, 
  onToggleWarning, 
}: WarningSettingsProps) {
  const warningToggleStyle = useMemo(() => {
    return isWarningEnabled ? 'bg-orange-500' : 'bg-gray-300';
  }, [isWarningEnabled]);

  const warningTogglePosition = useMemo(() => {
    return isWarningEnabled ? 'translate-x-6' : 'translate-x-1';
  }, [isWarningEnabled]);

  return (
    <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-3 border border-orange-100">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-orange-600 font-medium">소리 경고</span>
          <button
            onClick={onToggleWarning}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${warningToggleStyle}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${warningTogglePosition}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
});

export default SoundWarningSettings;