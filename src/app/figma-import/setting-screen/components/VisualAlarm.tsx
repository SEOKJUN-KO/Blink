
import React from 'react';
import Toggle from './Toggle';
import { BlinkViewModel } from '@/app/features/eyeBlink/presenter/BlinkPresenter';
import { BlinkViewController } from '@/app/features/eyeBlink/controller/BlinkViewController';

interface VisualAlarmProps {
  vm: BlinkViewModel;
  controller: BlinkViewController;
}

const VisualAlarm: React.FC<VisualAlarmProps> = ({ vm, controller }) => {
  return (
    <div className="flex items-center justify-between py-4">
      <div>
        <h3 className="text-body font-medium text-text-black-900">시각 알림</h3>
        <p className="text-caption font-medium text-text-black-300 mt-1">
          설정된 간격 안에 눈을 깜빡이지 않을 경우, PIP 창에서 시각적인 알림을 표시합니다.
        </p>
      </div>
      <Toggle isOn={vm.pipOn} doToggleOn={() => controller?.addWarnTool('PIP', {}) } doToggleOff={() => controller.deleteWarnTool('PIP')}/>
    </div>
  );
};

export default VisualAlarm;
