'use client';

import { useMemo, memo } from 'react';

interface VideoDisplayProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isRunning: boolean;
}

const VideoDisplay = memo(function VideoDisplay({ videoRef, isRunning }: VideoDisplayProps) {
  const videoBorderStyle = useMemo(() => {
    return isRunning 
      ? "border-blue-400 shadow-lg" 
      : "border-gray-200 bg-gray-50";
  }, [isRunning]);

  const videoOpacity = useMemo(() => {
    return isRunning ? 1 : 0.3;
  }, [isRunning]);

  return (
    <div className="relative">
      <video 
        ref={videoRef} 
        className={`w-full h-40 object-cover rounded-2xl border-2 transition-all duration-300 ${videoBorderStyle}`}
        style={{ opacity: videoOpacity }}
      />
      {!isRunning && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl mb-1">📹</div>
            <p className="text-gray-500 text-xs">카메라를 시작해주세요</p>
          </div>
        </div>
      )}
    </div>
  );
});

export default VideoDisplay;