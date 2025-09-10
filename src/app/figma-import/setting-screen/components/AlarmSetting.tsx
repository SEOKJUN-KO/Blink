
import React from 'react';
import VisualAlarm from './VisualAlarm';
import SoundAlarm from './SoundAlarm';

interface AlarmSettingProps {
  isVisualAlarmOn: boolean;
  onVisualAlarmToggle: () => void;
  isSoundAlarmOn: boolean;
  onSoundAlarmToggle: () => void;
}

const AlarmSetting: React.FC<AlarmSettingProps> = ({
  isVisualAlarmOn,
  onVisualAlarmToggle,
  isSoundAlarmOn,
  onSoundAlarmToggle,
}) => {
  return (
    <div className="p-6">
      <h2 className="text-caption font-medium text-text-black-500 mb-2">알림 방식</h2>
      <VisualAlarm isOn={isVisualAlarmOn} onToggle={onVisualAlarmToggle} />
      <SoundAlarm isOn={isSoundAlarmOn} onToggle={onSoundAlarmToggle} />
    </div>
  );
};

export default AlarmSetting;
