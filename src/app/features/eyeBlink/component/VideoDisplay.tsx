'use client';

import { memo } from 'react';

interface VideoDisplayProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isRunning: boolean;
}

const VideoDisplay = memo(function VideoDisplay({ videoRef, isRunning }: VideoDisplayProps) {
  return (
    <div className="relative">
      <div
        className={`w-full h-40 object-cover rounded-2xl border-2 transition-all duration-300 flex items-center justify-center bg-gray-100 relative overflow-hidden select-none cursor-default ${
          isRunning ? 'border-blue-400 shadow-lg' : 'border-gray-200'
        }`}
      >
        {isRunning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-700/60 to-indigo-500/60 z-10">
            <div className="flex items-center space-x-2 mb-2 animate-pulse">
              <span className="text-2xl">🔵</span>
              <span className="text-white text-lg font-bold drop-shadow">카메라 ON</span>
            </div>
            <span className="text-white text-xs opacity-80">눈 깜빡임을 감지 중입니다</span>
          </div>
        )}
        <video
          ref={videoRef}
          className="w-full h-40 object-cover rounded-2xl"
          style={{ opacity: 0 }}
        />
      </div>
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