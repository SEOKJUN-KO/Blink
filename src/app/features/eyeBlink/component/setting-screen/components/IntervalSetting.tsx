
import React from 'react';
import Counter from './Counter';
import { BlinkViewModel } from '@/app/features/eyeBlink/presenter/BlinkPresenter';
import { BlinkViewController } from '@/app/features/eyeBlink/controller/BlinkViewController';

interface IntervalSettingProps {
  vm: BlinkViewModel;
  controller: BlinkViewController;
}

const IntervalSetting: React.FC<IntervalSettingProps> = ({ vm, controller }) => {
  return (
    <div className="px-[56px] py-[28px]">
      <h2 className="text-caption font-medium text-text-black-500 mb-5">간격 설정</h2>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-body font-medium text-text-black-900">눈 깜빡임 간격</h3>
          <p className="text-caption font-medium text-text-black-300 mt-1">
            눈 깜빡임이 없을 때 알림을 받을 간격을 설정해주세요. <br />
            건강한 눈 깜빡임은 3~4초, 작업 중 알림 방해를 최소화하려면 7~8초를 고려해 보세요.
          </p>
        </div>
        <Counter vm={vm} controller={controller} />
      </div>
    </div>
  );
};

export default IntervalSetting;
