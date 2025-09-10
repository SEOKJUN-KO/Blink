
import React from 'react';

interface ToggleProps {
  isOn: boolean;
  onToggle: () => void;
}

const Toggle: React.FC<ToggleProps> = ({ isOn, onToggle }) => {
  return (
    <div
      onClick={onToggle}
      className={`w-[44px] h-[24px] rounded-full p-0.5 cursor-pointer transition-colors duration-300 ease-in-out ${
        isOn ? 'bg-BrandGreen' : 'bg-gray-scale-100'
      }`}
    >
      <div
        className={`w-[18px] h-[18px] bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
          isOn ? 'translate-x-[20px]' : 'translate-x-0'
        }`}
      />
    </div>
  );
};

export default Toggle;
