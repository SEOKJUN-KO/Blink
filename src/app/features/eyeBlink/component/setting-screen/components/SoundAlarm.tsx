
import React from 'react';
import Toggle from './Toggle';
import { BlinkViewModel } from '@/app/features/eyeBlink/presenter/BlinkPresenter';
import { BlinkViewController } from '@/app/features/eyeBlink/controller/BlinkViewController';

interface SoundAlarmProps {
  vm: BlinkViewModel;
  controller: BlinkViewController;
}

const SoundAlarm: React.FC<SoundAlarmProps> = ({ vm, controller }) => {
  return (
    <div className="flex items-center justify-between mt-5">
      <div>
        <h3 className="text-body font-medium text-text-black-900">소리 알림</h3>
        <p className="text-caption font-medium text-text-black-300 mt-1">
          설정된 간격 안에 눈을 깜빡이지 않을 경우, 소리로 알림을 재생합니다.
        </p>
      </div>
      <Toggle isOn={vm.soundOn} doToggleOn={() => controller.addWarnTool('Sound', {volumn: 50})} doToggleOff={() => controller.deleteWarnTool('Sound')} />
    </div>
  );
};

export default SoundAlarm;
