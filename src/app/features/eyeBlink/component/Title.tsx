import React from 'react';
import ActivityIndicatorAnimation from './ActivityIndicatorAnimation';

type Props = {
  status: 'Play' | 'Pause';
};


const Title: React.FC<Props> = ({ status }) => {
  return (
    <div className="text-center">
      <div className='w-[283px] h-[34px] flex justify-center items-center'>
      { status === "Pause" ?
        <h1 className="font-pretendard text-title font-semibold text-primary-scale-500">Blink</h1> :
        <div className='flex justify-center'>
          <ActivityIndicatorAnimation isRunning={true} />
        </div>
      }
      </div>
      
      { status === "Pause" ?
        <p className="mt-6 font-pretendard text-sub-title font-regular text-text-black-700">
          집중 속 잊기 쉬운 <span className='text-primary-scale-500'>눈 깜빡임,</span><br />
          건강한 눈 습관을 되찾도록 도와드릴게요
        </p> :
        <p className="mt-6 font-pretendard text-sub-title font-regular text-text-black-700">
          정확한 눈 깜빡임 인식을 위해<br />
          <span className='text-secondary-scale-500'>카메라 정면을 응시</span>해주세요
        </p>
      }
      
    </div>
  );
};

export default Title;
