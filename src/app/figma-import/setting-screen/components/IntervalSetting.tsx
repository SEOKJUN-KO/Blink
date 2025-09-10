
import React from 'react';
import Counter from './Counter';

interface IntervalSettingProps {
  interval: number;
  onIntervalChange: (newInterval: number) => void;
}

const IntervalSetting: React.FC<IntervalSettingProps> = ({ interval, onIntervalChange }) => {
  return (
    <div className="p-6">
      <h2 className="text-caption font-medium text-text-black-500 mb-4">간격 설정</h2>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-body font-medium text-text-black-900">눈 깜빡임 간격</h3>
          <p className="text-caption font-medium text-text-black-300 mt-1">
            눈 깜빡임이 없을 때 알림을 받을 간격을 설정해주세요. <br />
            건강한 눈 깜빡임은 3~4초, 작업 중 알림 방해를 최소화하려면 7~8초를 고려해 보세요.
          </p>
        </div>
        <Counter value={interval} onValueChange={onIntervalChange} />
      </div>
    </div>
  );
};

export default IntervalSetting;
