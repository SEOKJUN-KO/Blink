'use client';

import { useRef } from 'react';
import useBlinkViewModel from '../hook/useBlinkViewModel';

export default function BlinkContainer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const webcamButtonRef = useRef<HTMLButtonElement>(null);

  const { start, stop, isRunning } = useBlinkViewModel(videoRef.current, canvasRef.current);

  return (
    <div>
      <p>BlinkContainer</p>
      <video ref={videoRef} className='border-2 border-gray-300 rounded-md'/>
      <canvas ref={canvasRef} className='border-2 border-gray-300 rounded-md'/>
      <button ref={webcamButtonRef} className='bg-blue-500 text-white p-2 rounded-md' 
        onClick={isRunning ? stop : start}
      >
        {isRunning ? "Stop" : "Start"}
      </button>
    </div>
  );
} 