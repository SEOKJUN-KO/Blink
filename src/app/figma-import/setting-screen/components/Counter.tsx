import React from 'react';
import { SVGIcon } from '@/app/components/SVGIcon';

interface CounterProps {
  value: number;
  onValueChange: (newValue: number) => void;
}

const Counter: React.FC<CounterProps> = ({ value, onValueChange }) => {
  const increment = () => onValueChange(value + 1);
  const decrement = () => onValueChange(value > 0 ? value - 1 : 0);

  return (
    <div className="flex items-center gap-4">
      <button onClick={decrement} disabled={value <= 0}>
        <SVGIcon
          name={value <= 0 ? 'MinusBtnDisabled' : 'MinusBtn'}
          width={20}
          height={20}
        />
      </button>
      <span className="text-body font-medium text-text-black-900 w-[40px] text-center">
        {value}초
      </span>
      <button onClick={increment}>
        <SVGIcon name='PlusBtn' width={20} height={20} />
      </button>
    </div>
  );
};

export default Counter;
