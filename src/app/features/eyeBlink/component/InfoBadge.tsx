import React from 'react';

interface InfoBadgeProps {
    treshold?: number;
    soundOn?: boolean;
    pipOn?: boolean;
}

const InfoBadge: React.FC<InfoBadgeProps> = ({ treshold = 7, soundOn = false, pipOn = false }) => {
  return (
    <div className="bg-gray-scale-50 rounded-md px-5 py-2">
      <p className="font-pretendard text-caption font-medium text-text-black-500">
        {treshold}초마다 • 시각 알림 {pipOn ? 'ON' : 'OFF'} • 소리 알림 {soundOn ? 'ON' : 'OFF'}
      </p>
    </div>
  );
};

export default InfoBadge;
