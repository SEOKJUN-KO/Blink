import React from 'react';
import { SVGIcon } from '../../../components/SVGIcon';

interface HeaderProps {
  onSettingClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSettingClick }) => {
  return (
    <header className="flex items-center justify-between w-full h-14 bg-white px-14">
      <div className="font-pretendard text-body font-semibold text-primary-scale-500">Blink</div>
      <div className="flex items-center space-x-4 cursor-pointer" onClick={onSettingClick}>
        <SVGIcon name={'Setting'} width={24} height={24} />
      </div>
    </header>
  );
};

export default Header;
