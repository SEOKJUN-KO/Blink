'use client';

import { useRef } from 'react';
import useBlinkViewModel from '../hook/useBlinkViewModel';

export default function BlinkContainer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const webcamButtonRef = useRef<HTMLButtonElement>(null);

  const { start, stop, isRunning, lastBlinkInterval } = useBlinkViewModel();

  return (
    <div>
      <p>마지막으로 깜빡이는데 걸린 시간: {lastBlinkInterval}</p>
      <video ref={videoRef} 
        className={`border-2 border-gray-300 rounded-md ${isRunning ? "opacity-100" : "opacity-0"}`}
      />
      <button ref={webcamButtonRef} className='bg-blue-500 text-white p-2 rounded-md' 
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
        {isRunning ? "Stop" : "Start"}
      </button>
    </div>
  );
} 