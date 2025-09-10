
import React from 'react';

interface ToggleProps {
  isOn: boolean;
  doToggleOn: () => void;
  doToggleOff: () => void;
}

const Toggle: React.FC<ToggleProps> = ({ isOn, doToggleOn, doToggleOff }) => {
  const handleToggle = () => {
    if (isOn) {
      doToggleOff();
    } else {
      doToggleOn();
    }
  };

  return (
    <div
      onClick={handleToggle}
      className={`relative w-[44px] h-[24px] rounded-full cursor-pointer transition-colors duration-300 ease-in-out ${
        isOn ? 'bg-brand-green' : 'bg-gray-scale-100'
      }`}
    >
      <div
        className={`absolute bg-white rounded-full shadow-md transform transition-all duration-300 ease-in-out ${
          isOn
            ? 'w-[18px] h-[18px] top-[3px] left-[21px]'
            : 'w-[12px] h-[12px] top-[6px] left-[6px]'
        }`}
      />
    </div>
  );
};

export default Toggle;

