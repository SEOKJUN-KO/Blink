'use client';

import BlinkInfo from './BlinkInfo';
import WarningSettings from './WarningSettings';
import StatusIndicator from './StatusIndicator';
import ControlButton from './ControlButton';
import VideoDisplay from './VideoDisplay';
import { useEffect, useRef, useState } from 'react';
import { BlinkViewController } from '../controller/BlinkViewController';
import { BlinkSensor } from '../domain/BlinkSensor';
import { BlinkWarning } from '../domain/BlinkWarning';

export default function BlinkContainer() {

  const videoRef = useRef<HTMLVideoElement>(null);
  const [controller, setController] = useState<BlinkViewController | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    const c = new BlinkViewController(
      new BlinkSensor(videoRef),
      new MonitorContextRepo(),
      new BlinkWarning(),
      new BlinkWarning()
    );
    setController(c);
    return () => c.monitorStop();
  }, []);

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
      {/* 콘텐츠 영역 */}
      {/* <div className="p-6 space-y-4">
        <VideoDisplay videoRef={videoRef} isRunning={isRunning} />
        <BlinkInfo lastBlinkInterval={lastBlinkInterval} />
        <WarningSettings 
          isWarningEnabled={isWarningEnabled}
          warningThreshold={warningThreshold}
          onToggleWarning={toggleWarning}
          onUpdateThreshold={updateWarningThreshold}
        />
        <StatusIndicator isRunning={isRunning} />
      </div> */}

      {/* 하단 버튼 */}
      {/* <div className="px-6 pb-6">
        <ControlButton 
          isRunning={isRunning}
          onStart={handleStart}
          onStop={handleStop}
        />
      </div> */}
    </div>
  );
} 