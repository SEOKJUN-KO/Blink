
import React from 'react';
import { SVGIcon } from '@/app/components/SVGIcon';

interface SettingHeaderProps {
  onClose: () => void;
}

const SettingHeader: React.FC<SettingHeaderProps> = ({ onClose }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-gray-scale-50 rounded-t-md">
      <h1 className="text-body font-medium text-text-black-900">Blink 알림 설정</h1>
      <button onClick={onClose}>
        <SVGIcon name="CloseSmall" width={26} height={26} />
      </button>
    </header>
  );
};

export default SettingHeader;
