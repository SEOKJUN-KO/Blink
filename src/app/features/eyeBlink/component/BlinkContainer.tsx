'use client';

import BlinkInfo from './BlinkInfo';
import StatusIndicator from './StatusIndicator';
import ControlButton from './ControlButton';
import VideoDisplay from './VideoDisplay';
import { useEffect, useRef, useState } from 'react';
import { BlinkViewController } from '../controller/BlinkViewController';
import { BlinkViewModel } from '../presenter/BlinkPresenter';
import SoundWarningSettings from './SoundWarningSettings';
import WarningThresholdControl from './WarningThresholdControl';
import { CustomPiP } from './CustomPip';
import { buildBlinkDIContainer } from '@/app/di/BlinkDIContainer';
import { DI_TOKENS } from '@/app/di/DI_Token';

export default function BlinkContainer() {
  
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
  console.log(vm)
  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
      {/* 콘텐츠 영역 */}
      <div className="p-6 space-y-4">
        <VideoDisplay videoRef={videoRef} isRunning={vm?.isRunning ?? false} />
        <BlinkInfo lastBlinkAt={vm?.lastBlinkAt ?? new Date()} isRunning = {vm?.isRunning ?? false} />
        <WarningThresholdControl
          warningThreshold={vm?.warningThreshold ?? 5}
          onUpdateThreshold={(threshold) => controller?.setThreshold(threshold)}
        />
        <SoundWarningSettings 
          isWarningEnabled={vm?.soundOn ?? false}
          onToggleWarning={() => vm?.soundOn ? controller?.deleteWarnTool('Sound') : controller?.addWarnTool('Sound', {volumn: 50})}
        />
        <StatusIndicator isRunning={vm?.isRunning ?? false} />
      </div>

      <CustomPiP isRunning={vm?.isRunning ?? false} />

      {/* 하단 버튼 */}
      <div className="px-6 pb-6">
        <ControlButton 
          isRunning={vm?.isRunning ?? false}
          onStart={() => {
            if (controller) { controller.monitorStart(); } 
            else { alert('error'); }
          }}
          onStop={() => {
            if (controller) { controller.monitorStop();}
          }}
        />
      </div>
    </div>
  );
} 