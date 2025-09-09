import React, { useState, useEffect } from 'react';
import { SVGIcon } from '@/app/components/SVGIcon';

interface ActivityIndicatorAnimationProps {
  isRunning: boolean;
}

const ActivityIndicatorAnimation: React.FC<ActivityIndicatorAnimationProps> = ({ isRunning }) => {
  const [indicatorIndex, setIndicatorIndex] = useState(1);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isRunning) {
      intervalId = setInterval(() => {
        setIndicatorIndex(prevIndex => (prevIndex % 3) + 1);
      }, 200); // 200ms마다 이미지 변경
    } else {
      setIndicatorIndex(1); // 모니터링 중지 시 초기 상태로 복원
    }
    return () => clearInterval(intervalId);
  }, [isRunning]);

  return (
    <SVGIcon name={`ActivityIndicator${indicatorIndex}`} width={40} height={8} />
  );
};

export default ActivityIndicatorAnimation;
