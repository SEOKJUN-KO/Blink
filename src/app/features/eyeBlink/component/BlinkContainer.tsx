'use client';

import { useRef } from 'react';
import useBlinkViewModel from '../hook/useBlinkViewModel';

export default function BlinkContainer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const webcamButtonRef = useRef<HTMLButtonElement>(null);
  const blendRef = useRef<HTMLUListElement>(null);

  const { start, stop, isRunning } = useBlinkViewModel();

  return (
    <div>
      <p>BlinkContainer</p>
      <video ref={videoRef} className='border-2 border-gray-300 rounded-md'/>
      <canvas ref={canvasRef} className='border-2 border-gray-300 rounded-md'/>
      <button ref={webcamButtonRef} className='bg-blue-500 text-white p-2 rounded-md' 
        onClick={() => {
          if (isRunning) {
            stop();
          } else {
            if (videoRef.current && canvasRef.current && blendRef.current) {
              start(videoRef.current, canvasRef.current, blendRef.current);
            } else {
              console.error("필요한 DOM 요소들이 준비되지 않았습니다.");
            }
          }
        }}
      >
        {isRunning ? "Stop" : "Start"}
      </button>
      <ul ref={blendRef} className='border-2 border-gray-300 rounded-md'></ul>
    </div>
  );
} 