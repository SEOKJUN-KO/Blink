'use client';

// import BlinkInfo from './BlinkInfo';
import StatusIndicator from './StatusIndicator';
import ControlButton from './ControlButton';
import VideoDisplay from './VideoDisplay';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BlinkViewController } from '../controller/BlinkViewController';
import { BlinkSensor } from '../domain/BlinkSensor';
import { WarningManager } from '@/app/domain/WarningManager';
import { WarnFactory } from '@/app/factory/WarnFactory';
import { MonitorContextRepo } from '@/app/db/InmemoryHash';
import { BlinkPresenter, BlinkViewModel } from '../presenter/BlinkPresenter';
import SoundWarningSettings from './SoundWarningSettings';

export default function BlinkContainer() {
  
  const [vm, setVM] = useState<BlinkViewModel | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [controller, setController] = useState<BlinkViewController | null>(null);
  const presenter = useMemo(() => new BlinkPresenter(setVM), []);


  useEffect(() => {
    if (!videoRef.current) return;
    const warnManager = new WarningManager()
    const c = new BlinkViewController(
      new BlinkSensor(videoRef.current),
      new MonitorContextRepo(),
      warnManager,
      warnManager, 
      new WarnFactory(),
      presenter
    );
    setController(c);
    return () => c.monitorStop();
  }, []);

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
      {/* 콘텐츠 영역 */}
      <div className="p-6 space-y-4">
        <VideoDisplay videoRef={videoRef} isRunning={vm?.isRunning ?? false} />
        {/* <BlinkInfo lastBlinkInterval={vm?.lastBlinkInterval ?? '0'} /> */}
        <SoundWarningSettings 
          isWarningEnabled={vm?.soundOn ?? false}
          warningThreshold={vm?.warningThreshold ?? 0}
          onToggleWarning={() => controller?.addWarnTool('Sound', { volumn: 50 })}
          // onUpdateThreshold={updateWarningThreshold}
        />
        <StatusIndicator isRunning={vm?.isRunning ?? false} />
      </div>

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