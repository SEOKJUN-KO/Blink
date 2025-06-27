'use client';

import { useRef } from 'react';
import useBlinkViewModel from '../hook/useBlinkViewModel';

export default function BlinkContainer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const webcamButtonRef = useRef<HTMLButtonElement>(null);

  const { 
    start, 
    stop, 
    isRunning, 
    lastBlinkInterval, 
    isWarningEnabled, 
    warningThreshold,
    toggleWarning,
    updateWarningThreshold 
  } = useBlinkViewModel();

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
      {/* 콘텐츠 영역 */}
      <div className="p-6 space-y-4">
        {/* 비디오 영역 */}
        <div className="relative">
          <video 
            ref={videoRef} 
            className={`w-full h-40 object-cover rounded-2xl border-2 transition-all duration-300 ${
              isRunning 
                ? "border-blue-400 shadow-lg" 
                : "border-gray-200 bg-gray-50"
            }`}
            style={{ opacity: isRunning ? 1 : 0.3 }}
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

        {/* 깜빡임 정보 */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-3 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-green-600 font-medium">마지막 깜빡임 간격</p>
              <p className="text-xl font-bold text-green-700">
                {lastBlinkInterval ? `${lastBlinkInterval.toFixed(1)}초` : '--'}
              </p>
            </div>
          </div>
        </div>

        {/* 경고 설정 */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-3 border border-orange-100">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-orange-600 font-medium">소리 경고</span>
              <button
                onClick={toggleWarning}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isWarningEnabled ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isWarningEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-orange-600 font-medium">경고 임계값</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateWarningThreshold(Math.max(1, warningThreshold - 1))}
                  className="w-6 h-6 rounded-full bg-orange-200 text-orange-600 text-xs font-bold hover:bg-orange-300"
                >
                  -
                </button>
                <span className="text-xs font-medium text-orange-700 min-w-[2rem] text-center">
                  {warningThreshold}초
                </span>
                <button
                  onClick={() => updateWarningThreshold(warningThreshold + 1)}
                  className="w-6 h-6 rounded-full bg-orange-200 text-orange-600 text-xs font-bold hover:bg-orange-300"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 상태 표시 */}
        <div className="flex items-center justify-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
          }`}></div>
          <span className="text-xs text-gray-600">
            {isRunning ? '모니터링 중...' : '대기 중'}
          </span>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="px-6 pb-6">
        <button 
          ref={webcamButtonRef} 
          className={`w-full py-3 rounded-2xl font-semibold text-base transition-all duration-300 transform active:scale-95 ${
            isRunning
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-200'
              : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-200'
          }`}
          onClick={() => {
            if (isRunning) {
              stop();
            } else {
              if (videoRef.current) {
                start(videoRef.current);
              } else {
                console.error("필요한 DOM 요소들이 준비되지 않았습니다.");
              }
            }
          }}
        >
          {isRunning ? (
            <span className="flex items-center justify-center space-x-2">
              <span>⏹️</span>
              <span>모니터링 중지</span>
            </span>
          ) : (
            <span className="flex items-center justify-center space-x-2">
              <span>▶️</span>
              <span>모니터링 시작</span>
            </span>
          )}
        </button>
      </div>
    </div>
  );
} 