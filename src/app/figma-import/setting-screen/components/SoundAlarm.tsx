
import React from 'react';
import Toggle from './Toggle';

interface SoundAlarmProps {
  isOn: boolean;
  onToggle: () => void;
}

const SoundAlarm: React.FC<SoundAlarmProps> = ({ isOn, onToggle }) => {
  return (
    <div className="flex items-center justify-between py-4">
      <div>
        <h3 className="text-body font-medium text-text-black-900">소리 알림</h3>
        <p className="text-caption font-medium text-text-black-300 mt-1">
          설정된 간격 안에 눈을 깜빡이지 않을 경우, 소리로 알림을 재생합니다.
        </p>
      </div>
      <Toggle isOn={isOn} onToggle={onToggle} />
    </div>
  );
};

export default SoundAlarm;
