import React from 'react';
import { SVGIcon } from '../components/SVGIcon';

const Header = () => {
  return (
    <header className="flex items-center justify-between w-full h-14 bg-white px-14">
      <div className="font-pretendard text-Body font-semibold text-Primary-500">Blink</div>
      <div className="flex items-center space-x-4">
        <SVGIcon name={'Setting'} width={24} height={24} />
      </div>
    </header>
  );
};

export default Header;
