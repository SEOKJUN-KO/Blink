'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import BlinkTimer from './BlinkTimer';
import Settings from './Settings';
import FaceMarkViewModel from '../models/FaceMarkViewModel';

export default function BlinkContainer() {
  const [recentBlinkTime, setRecentBlinkTime] = useState(0);
  const [blinkInterval, setBlinkInterval] = useState(5);
  const [warningSoundEnabled, setWarningSoundEnabled] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const webcamButtonRef = useRef<HTMLButtonElement>(null);
  const blendShapesRef = useRef<HTMLUListElement>(null);

  const handleBlinkIntervalChange = useCallback((value: number) => {
    setBlinkInterval(value);
  }, []);

  const handleWarningSoundChange = useCallback((value: boolean) => {
    setWarningSoundEnabled(value);
  }, []);

  useEffect(() => {
    const { hasGetUserMedia, enableCam } = FaceMarkViewModel(setRecentBlinkTime);

    if (videoRef.current && canvasRef.current && webcamButtonRef.current && blendShapesRef.current) {
      if (hasGetUserMedia()) {
        webcamButtonRef.current.addEventListener("click", () =>
          enableCam(videoRef.current!, canvasRef.current!, webcamButtonRef.current!, blendShapesRef.current!)
        );
      } else {
        console.warn("getUserMedia()는 브라우저에서 지원되지 않습니다.");
        webcamButtonRef.current.innerText = "WEBCAM NOT SUPPORTED";
        webcamButtonRef.current.disabled = true;
      }
    }
  }, []);

  const { videoWidth } = FaceMarkViewModel();

  return (
    <>
      <BlinkTimer recentBlinkTime={recentBlinkTime} />
      
      <Settings
        blinkInterval={blinkInterval}
        warningSoundEnabled={warningSoundEnabled}
        onBlinkIntervalChange={handleBlinkIntervalChange}
        onWarningSoundChange={handleWarningSoundChange}
      />

      <h2>데모: 웹캠 얼굴 랜드마크 실시간 감지</h2>
      <p>웹캠 앞에 얼굴을 대면 실시간 얼굴 랜드마크를 감지합니다.<br />아래 <b>웹캠 활성화</b> 버튼을 클릭하고 프롬프트가 표시되면 웹캠 접근을 허용하세요.</p>

      <div id="liveView" className="videoView">
        <button id="webcamButton" ref={webcamButtonRef} className="mdc-button mdc-button--raised" style={{ border: '1px solid #ccc' }}>
          <span className="mdc-button__ripple"></span>
          <span className="mdc-button__label">웹캠 활성화</span>
        </button>
        <div style={{ position: 'relative', width: `${videoWidth}px`, minHeight: `${videoWidth * (3/4)}px` }}>
          <video id="webcam" ref={videoRef} style={{ position: 'absolute', width: '100%', height: '100%' }} autoPlay playsInline></video>
          <canvas className="output_canvas" id="output_canvas" ref={canvasRef} style={{ position: 'absolute', left: '0px', top: '0px', width: '100%', height: '100%' }}></canvas>
        </div>
      </div>
      <div className="blend-shapes">
        <ul className="blend-shapes-list" id="video-blend-shapes" ref={blendShapesRef}></ul>
      </div>
    </>
  );
} 