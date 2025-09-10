'use client'

import React, { useEffect, useRef, useState } from 'react';
import Title from './Title';
import InfoBadge from './InfoBadge';
import { PlayButton } from '../../../components/PlayButton';
import { BlinkViewController } from '../controller/BlinkViewController';
import { BlinkViewModel } from '../presenter/BlinkPresenter';
import { buildBlinkDIContainer } from '../../../di/BlinkDIContainer';
import { DI_TOKENS } from '../../../di/DI_Token';
import SettingScreen from './setting-screen/SettingScreen';
import { CustomPiP } from './CustomPip';

interface Props {
  isSettingVisible: boolean;
  onClose: () => void;
}

const MainContent: React.FC<Props> = ({ isSettingVisible, onClose }) => {

  const [vm, setVM] = useState<BlinkViewModel | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [controller, setController] = useState<BlinkViewController | null>(null);


  useEffect(() => {
    if (!videoRef.current) return;
    const di = buildBlinkDIContainer({
      videoEl: videoRef.current,
      setVM,
    });

    const c = di.get<BlinkViewController>(DI_TOKENS.Blink.Controller);
    
    setController(c);
    return () => {
      c.monitorStop()
      di.dispose();
    };
  }, []);
  
  return (
    <main className="flex flex-col items-center justify-center flex-grow">
      <div className="flex flex-col items-center">
        <Title status={ vm?.isRunning ? 'Play' : 'Pause'}/>
        {/* 0초마다 + 알림 정보 */}
        <InfoBadge treshold={vm?.warningThreshold} soundOn={vm?.soundOn ?? false} pipOn={vm?.pipOn ?? false}/>

        <PlayButton status={ vm?.isRunning ? 'Play' : 'Pause'} label={vm?.isRunning ? '측정 중지' : '측정 시작'} 
          onStart={() => { if (controller) { controller.monitorStart(); }  else { alert('error'); } }}
          onStop={() => { if (controller) { controller.monitorStop(); } }}
        />
        
        <p className="mt-4 font-pretendard text-caption font-medium text-text-black-300">
          개인정보를 수집하지 않으니 안심하세요.
        </p>
      </div>
      {/* 보이진 않지만, 카메라 데이터 분석을 위해 필요 */}
      <video ref={videoRef} className="w-0 h-0 opacity-0" />
      
      {isSettingVisible && vm && controller &&
        <div className="absolute top-0 left-0 w-full h-full bg-black-opacity flex items-center justify-center">
          <SettingScreen onClose={onClose} vm={vm} controller={controller} />
        </div>
      }
      
      { vm?.pipOn && <CustomPiP isRunning={vm?.isRunning ?? false} pipFlick={vm?.pipFlick ?? false} threshold={vm?.warningThreshold ?? 5} /> }
    </main>
  );
};

export default MainContent;
