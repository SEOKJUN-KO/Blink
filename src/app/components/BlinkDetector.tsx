'use client';

import { useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

interface BlinkDetectorProps {
  onBlink: (duration: number) => void;
}

export default function BlinkDetector({ onBlink }: BlinkDetectorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const detectorRef = useRef<faceLandmarksDetection.FaceLandmarksDetector>();
  const prevBlinkTimeRef = useRef<number>(Date.now());
  const blinkingRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    async function setup() {
      await tf.setBackend('webgl');
      await tf.ready();
      const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
      detectorRef.current = await faceLandmarksDetection.createDetector(model, {
        runtime: 'tfjs',
      });

      if (!isMounted) return;
      const video = videoRef.current;
      if (video && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        await video.play();
        requestAnimationFrame(detect);
      }
    }

    async function detect() {
      const detector = detectorRef.current;
      const video = videoRef.current;
      if (!detector || !video) {
        requestAnimationFrame(detect);
        return;
      }

      const faces = await detector.estimateFaces({ input: video, flipHorizontal: false });
      if (faces.length > 0) {
        const keypoints = faces[0].keypoints;
        const leftEAR = computeEAR([
          keypoints[33],
          keypoints[160],
          keypoints[158],
          keypoints[133],
          keypoints[153],
          keypoints[144],
        ]);
        const rightEAR = computeEAR([
          keypoints[362],
          keypoints[385],
          keypoints[387],
          keypoints[263],
          keypoints[373],
          keypoints[380],
        ]);
        const ear = (leftEAR + rightEAR) / 2;
        const threshold = 0.23;
        if (ear < threshold) {
          if (!blinkingRef.current) {
            blinkingRef.current = true;
            const now = Date.now();
            const duration = (now - prevBlinkTimeRef.current) / 1000;
            prevBlinkTimeRef.current = now;
            onBlink(duration);
          }
        } else {
          blinkingRef.current = false;
        }
      }

      requestAnimationFrame(detect);
    }

    setup();

    return () => {
      isMounted = false;
      const video = videoRef.current;
      if (video?.srcObject) {
        (video.srcObject as MediaStream)
          .getTracks()
          .forEach((t) => t.stop());
      }
    };
  }, [onBlink]);

  const computeEAR = (points: Array<{ x: number; y: number }>) => {
    const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
      Math.hypot(a.x - b.x, a.y - b.y);
    return (
      (dist(points[1], points[5]) + dist(points[2], points[4])) /
      (2 * dist(points[0], points[3]))
    );
  };

  return <video ref={videoRef} className="hidden" playsInline />;
}

