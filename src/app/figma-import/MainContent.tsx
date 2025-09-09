'use client'

import React, { useEffect, useRef, useState } from 'react';
import Title from './Title';
import InfoBadge from './InfoBadge';
import { PlayButton } from '../components/PlayButton';
import { BlinkViewController } from '../features/eyeBlink/controller/BlinkViewController';
import { BlinkViewModel } from '../features/eyeBlink/presenter/BlinkPresenter';
import { buildBlinkDIContainer } from '../di/BlinkDIContainer';
import { DI_TOKENS } from '../di/DI_Token';

const MainContent = () => {

  const [vm, setVM] = useState<BlinkViewModel | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [controller, setController] = useState<BlinkViewController | null>(null);


  useEffect(() => {
    if (!videoRef.current) return;
    const di = buildBlinkDIContainer({
      videoEl: videoRef.current,
      setVM,
    });

    // 컨트롤러 얻기
    const c = di.get<BlinkViewController>(DI_TOKENS.Blink.Controller);
    // 뷰에서 컨트롤러 메서드 호출
    
    setController(c);
    return () => {
      c.monitorStop()
      di.dispose();
    };
  }, []);
  
  return (
    <main className="flex flex-col items-center justify-center flex-grow">
      <div className="flex flex-col items-center">
        <video
          ref={videoRef}
          className="w-0 h-0 opacity-0"
        />
        <Title />
        <div className="mt-6">
          <InfoBadge />
        </div>
        <div className="mt-16 text-center">
          <PlayButton status={ vm?.isRunning ? 'Play' : 'Pause'} label={vm?.isRunning ? '측정 중지' : '측정 시작'} 
            onStart={() => {
              if (controller) { controller.monitorStart(); } 
              else { alert('error'); }
            }}
            onStop={() => {
              if (controller) { controller.monitorStop(); }
            }}
          />
          <p className="mt-4 font-pretendard text-Caption font-Medium text-TextBlack-500">
            개인정보 수집 안내
          </p>
        </div>
      </div>
    </main>
  );
};

export default MainContent;
