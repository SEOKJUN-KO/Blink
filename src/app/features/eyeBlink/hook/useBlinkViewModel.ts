'use client';

import { BlinkMonitor } from "../domain/BlinkMonitor";
import { BlinkSensor } from "../domain/BlinkSensor";
import { BlinkWarning } from "../domain/BlinkWarning";
import { useRef, useState, useCallback, useMemo } from "react";

export default function useBlinkViewModel() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [lastBlinkInterval, setLastBlinkInterval] = useState<number>(0);
    const [isWarningEnabled, setIsWarningEnabled] = useState(true);
    const [warningThreshold, setWarningThreshold] = useState(5); // 5초
    const monitor = useRef<BlinkMonitor|null>(null);

    const start = useCallback(() => {
        if (monitor.current === null) {
            const warning = new BlinkWarning();
            if (videoRef.current) {
                monitor.current = new BlinkMonitor(new BlinkSensor(videoRef.current), warning);
                // 이벤트 리스너 등록
                monitor.current.on('blinkDetected', (data) => {
                    setLastBlinkInterval(data.elapsedSeconds);
                });
            }
        }

        if (monitor.current) {
            setIsRunning(true);
            monitor.current.startMonitoring();
        }
    }, []);

    const stop = useCallback(() => {
        if (monitor.current) {
            setIsRunning(false);
            monitor.current.stopMonitoring();
        }
    }, []);

    const toggleWarning = useCallback(() => {
        const newWarningEnabled = !isWarningEnabled;
        setIsWarningEnabled(newWarningEnabled);
        
        if (monitor.current) {
            monitor.current.setWarningEnabled(newWarningEnabled);
        }
    }, [isWarningEnabled]);

    const updateWarningThreshold = useCallback((seconds: number) => {
        setWarningThreshold(seconds);
        
        if (monitor.current) {
            monitor.current.setWarningThreshold(seconds);
        }
    }, []);

    const handleStart = useCallback(() => {
        if (videoRef.current) {
            start();
        } else {
            console.error("비디오 요소가 준비되지 않았습니다.");
        }
    }, [start]);

    const handleStop = useCallback(() => {
        stop();
    }, [stop]);

    return useMemo(() => ({
        videoRef,
        isRunning,
        start,
        stop,
        lastBlinkInterval,
        isWarningEnabled,
        toggleWarning,
        warningThreshold,
        updateWarningThreshold,
        handleStart,
        handleStop,
    }), [
        videoRef,
        isRunning,
        start,
        stop,
        lastBlinkInterval,
        isWarningEnabled,
        toggleWarning,
        warningThreshold,
        updateWarningThreshold,
        handleStart,
        handleStop,
    ]);
}