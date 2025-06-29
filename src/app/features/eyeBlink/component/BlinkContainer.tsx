'use client';

import useBlinkViewModel from '../hook/useBlinkViewModel';
import VideoDisplay from './VideoDisplay';
import BlinkInfo from './BlinkInfo';
import WarningSettings from './WarningSettings';
import StatusIndicator from './StatusIndicator';
import ControlButton from './ControlButton';

export default function BlinkContainer() {

  const {  
    videoRef,
    isRunning, 
    lastBlinkInterval, 
    isWarningEnabled,
    warningThreshold,
    toggleWarning,
    updateWarningThreshold,
    handleStart,
    handleStop,
  } = useBlinkViewModel();

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
      {/* 콘텐츠 영역 */}
      <div className="p-6 space-y-4">
        <VideoDisplay videoRef={videoRef} isRunning={isRunning} />
        <BlinkInfo lastBlinkInterval={lastBlinkInterval} />
        <WarningSettings 
          isWarningEnabled={isWarningEnabled}
          warningThreshold={warningThreshold}
          onToggleWarning={toggleWarning}
          onUpdateThreshold={updateWarningThreshold}
        />
        <StatusIndicator isRunning={isRunning} />
      </div>

      {/* 하단 버튼 */}
      <div className="px-6 pb-6">
        <ControlButton 
          isRunning={isRunning}
          onStart={handleStart}
          onStop={handleStop}
        />
      </div>
    </div>
  );
} 