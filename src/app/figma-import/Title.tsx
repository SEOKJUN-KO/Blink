import React from 'react';
import ActivityIndicatorAnimation from './ActivityIndicatorAnimation';

type Props = {
  status: 'Play' | 'Pause';
};


const Title: React.FC<Props> = ({ status }) => {
  return (
    <div className="text-center">
      { status === "Pause" ?
        <h1 className="font-pretendard text-title font-semibold text-primary-scale-500">Blink</h1> :
        <div className='flex justify-center'>
          <ActivityIndicatorAnimation isRunning={true} />
        </div>
      }
      
      { status === "Pause" ?
        <p className="mt-3 font-pretendard text-sub-title font-regular text-text-white-800">
          집중 속 잊기 쉬운 눈 깜빡임,<br />
          건강한 눈 습관을 되찾도록 도와드릴게요
        </p> :
        <p className="mt-3 font-pretendard text-sub-title font-regular text-text-black-700">
          정확한 눈 깜빡임 인식을 위해<br />
          카메라 정면을 응시해주세요
        </p>
      }
      
    </div>
  );
};

export default Title;
