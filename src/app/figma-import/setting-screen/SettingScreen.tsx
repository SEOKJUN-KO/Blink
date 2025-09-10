'use client';

import React, { useState } from 'react';
import SettingHeader from './components/SettingHeader';
import IntervalSetting from './components/IntervalSetting';
import AlarmSetting from './components/AlarmSetting';

interface SettingScreenProps {
  onClose: () => void;
}

const SettingScreen: React.FC<SettingScreenProps> = ({ onClose }) => {
  const [interval, setInterval] = useState(7);
  const [isVisualAlarmOn, setIsVisualAlarmOn] = useState(true);
  const [isSoundAlarmOn, setIsSoundAlarmOn] = useState(false);

  return (
    <div className="w-[776px] h-[458px] bg-white rounded-md border border-gray-scale-100">
      <SettingHeader onClose={onClose} />
      <IntervalSetting interval={interval} onIntervalChange={setInterval} />
      <div className="h-[1px] bg-gray-scale-50 mx-6"></div>
      <AlarmSetting
        isVisualAlarmOn={isVisualAlarmOn}
        onVisualAlarmToggle={() => setIsVisualAlarmOn(!isVisualAlarmOn)}
        isSoundAlarmOn={isSoundAlarmOn}
        onSoundAlarmToggle={() => setIsSoundAlarmOn(!isSoundAlarmOn)}
      />
    </div>
  );
};

export default SettingScreen;
