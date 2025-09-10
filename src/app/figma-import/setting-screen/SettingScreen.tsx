'use client';

import React from 'react';
import SettingHeader from './components/SettingHeader';
import IntervalSetting from './components/IntervalSetting';
import AlarmSetting from './components/AlarmSetting';
import { BlinkViewModel } from '@/app/features/eyeBlink/presenter/BlinkPresenter';
import { BlinkViewController } from '@/app/features/eyeBlink/controller/BlinkViewController';

interface SettingScreenProps {
  onClose: () => void;
  vm: BlinkViewModel;
  controller: BlinkViewController;
}

const SettingScreen: React.FC<SettingScreenProps> = ({ onClose, vm, controller }) => {
  return (
    <div className="w-[776px] h-[458px] bg-white rounded-md border border-gray-scale-100">
      <SettingHeader onClose={onClose} />
      <IntervalSetting vm={vm} controller={controller} />
      <div className="h-[1px] bg-gray-scale-50 mx-6"></div>
      <AlarmSetting vm={vm} controller={controller}
      />
    </div>
  );
};

export default SettingScreen;
