'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import BlinkTimer from './BlinkTimer';
import Settings from './Settings';
import FaceMarkViewModel from '../models/FaceMarkViewModel';

export default function BlinkContainer() {
  const [recentBlinkTime, setRecentBlinkTime] = useState(0);
  const [blinkInterval, setBlinkInterval] = useState(5);
  const [warningSoundEnabled, setWarningSoundEnabled] = useState(false);
  const [warningVolume, setWarningVolume] = useState(0.5);
  const [lastBlinkTimestamp, setLastBlinkTimestamp] = useState<number | null>(null);
  const [hasWarnedForCurrentInterval, setHasWarnedForCurrentInterval] = useState(false);

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

  // 경고음을 재생하는 함수
  const playWarningSound = useCallback((volume: number) => {
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = 'sine';      // 기본파형: sine, square, triangle, sawtooth
    oscillator.frequency.setValueAtTime(440, context.currentTime); // 440Hz = A4음
    
    gainNode.gain.setValueAtTime(volume, context.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.start();
    oscillator.stop(context.currentTime + 0.5); // 0.5초 후 정지
  }, []);

  // FaceMarkViewModel에서 깜빡임 감지 시 호출될 콜백 함수
  const handleBlinkDetected = useCallback((blinkValue: number, blinkTimestamp: number) => {
    setRecentBlinkTime(blinkValue);
    setLastBlinkTimestamp(blinkTimestamp);
    setHasWarnedForCurrentInterval(false); // 새로운 깜빡임 감지 시 경고 플래그 초기화
  }, []);

  useEffect(() => {
    const { hasGetUserMedia, enableCam } = FaceMarkViewModel(handleBlinkDetected);

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
  }, [handleBlinkDetected]);

  // 깜빡임 주기 초과 시 경고음 재생 로직
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (warningSoundEnabled && lastBlinkTimestamp !== null && blinkInterval > 0) {
      intervalId = setInterval(() => {
        const currentTime = performance.now();
        const elapsedSinceLastBlink = (currentTime - lastBlinkTimestamp) / 1000; // 초 단위

        // 설정된 깜빡임 주기를 초과했고, 아직 이 간격에 대한 경고음이 재생되지 않았다면
        if (elapsedSinceLastBlink > blinkInterval && !hasWarnedForCurrentInterval) {
          playWarningSound(warningVolume);
          setHasWarnedForCurrentInterval(true); // 경고음 재생 플래그 설정
        }
      }, 1000); // 1초마다 확인
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [warningSoundEnabled, lastBlinkTimestamp, blinkInterval, playWarningSound, warningVolume, hasWarnedForCurrentInterval]);

  const { videoWidth } = FaceMarkViewModel();

  return (
    <>
      <BlinkTimer recentBlinkTime={recentBlinkTime} />
      
      <Settings
        blinkInterval={blinkInterval}
        warningSoundEnabled={warningSoundEnabled}
        onBlinkIntervalChange={handleBlinkIntervalChange}
        onWarningSoundChange={handleWarningSoundChange}
        warningVolume={warningVolume}
        onWarningVolumeChange={setWarningVolume}
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