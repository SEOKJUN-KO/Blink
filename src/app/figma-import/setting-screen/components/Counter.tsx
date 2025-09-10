import React from 'react';
import { SVGIcon } from '@/app/components/SVGIcon';
import { BlinkViewModel } from '@/app/features/eyeBlink/presenter/BlinkPresenter';
import { BlinkViewController } from '@/app/features/eyeBlink/controller/BlinkViewController';

interface CounterProps {
  vm: BlinkViewModel;
  controller: BlinkViewController;
}

const Counter: React.FC<CounterProps> = ({ vm, controller }) => {
  const increment = () => {
    if ( vm.warningThreshold >= 15 ) { return }
    controller.setThreshold(vm.warningThreshold+1);
  };
  const decrement = () => {
    if ( vm.warningThreshold <= 3 ) { return }
    controller.setThreshold(vm.warningThreshold-1);
  };

  return (
    <div className="flex items-center gap-4">
      <button onClick={decrement} disabled={vm.warningThreshold <= 3}>
        <SVGIcon
          name={ vm.warningThreshold <= 3 ? 'MinusBtnDisabled' : 'MinusBtn' }
          width={20}
          height={20}
        />
      </button>
      <span className="text-body font-medium text-text-black-900 w-[40px] text-center">
        {vm.warningThreshold}초
      </span>
      <button onClick={increment}>
        <SVGIcon
          name={ vm.warningThreshold >= 15 ? 'PlusBtnDisabled' : 'PlusBtn' }
          width={20}
          height={20}
        />
      </button>
    </div>
  );
};

export default Counter;
