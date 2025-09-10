import React from 'react';
import VisualAlarm from './VisualAlarm';
import SoundAlarm from './SoundAlarm';
import { BlinkViewModel } from '@/app/features/eyeBlink/presenter/BlinkPresenter';
import { BlinkViewController } from '@/app/features/eyeBlink/controller/BlinkViewController';

interface AlarmSettingProps {
  vm: BlinkViewModel;
  controller: BlinkViewController;
}

const AlarmSetting: React.FC<AlarmSettingProps> = ({
  vm,
  controller,
}) => {
  return (
    <div className="py-7 px-14">
      <h2 className="text-caption font-medium text-text-black-500 mb-5">알림 방식</h2>
      <VisualAlarm vm={vm} controller={controller} />
      <SoundAlarm vm={vm} controller={controller} />
    </div>
  );
};

export default AlarmSetting;
