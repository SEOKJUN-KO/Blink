'use client';

import { BlinkMonitor } from "../domain/BlinkMonitor";
import { BlinkSensor } from "../domain/BlinkSensor";
import { BlinkWarning } from "../domain/BlinkWarning";
import { useRef, useState, useCallback, useMemo, useEffect } from "react";

export default function useBlinkViewModel() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isRunning, setIsRunning] = useState(true);
    const [lastBlinkInterval, setLastBlinkInterval] = useState<number>(0);
    const [isWarningEnabled, setIsWarningEnabled] = useState(true);
    const [warningThreshold, setWarningThreshold] = useState(5); // 5초
    const monitor = useRef<BlinkMonitor|null>(null);

    useEffect(() => {
        if (videoRef.current) {
            const warning = new BlinkWarning();
            const sensor = new BlinkSensor(videoRef.current);
            monitor.current = new BlinkMonitor(sensor, warning);

            monitor.current.on('blinkDetected', (data) => {
                setLastBlinkInterval(data.elapsedSeconds);
            });

            monitor.current.startMonitoring();
            setIsRunning(true);
        }

        return () => {
            if (monitor.current) {
                monitor.current.stopMonitoring();
            }
        };
    }, [videoRef]);

    const start = useCallback(() => {
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
        lastBlinkInterval,
        isWarningEnabled,
        warningThreshold,
        handleStart,
        handleStop,
        toggleWarning,
        updateWarningThreshold,
    }), [
        videoRef,
        isRunning,
        lastBlinkInterval,
        isWarningEnabled,
        warningThreshold,
        handleStart,
        handleStop,
        toggleWarning,
        updateWarningThreshold,
    ]);
}