import { IMonitor } from "../interface/IMonitor";
import { IWarningConfigurable } from "../interface/IWarningConfigurable";
import { BlinkMonitor } from "../domain/BlinkMonitor";
import { BlinkSensor } from "../domain/BlinkSensor";
import { BlinkWarning } from "../domain/BlinkWarning";
import { useRef, useState } from "react";

export default function useBlinkViewModel() {

    const [isRunning, setIsRunning] = useState(false);
    const [lastBlinkInterval, setLastBlinkInterval] = useState<number>(0);
    const [isWarningEnabled, setIsWarningEnabled] = useState(true);
    const [warningThreshold, setWarningThreshold] = useState(5); // 5초
    const monitor = useRef<IMonitor & IWarningConfigurable | null>(null);

    function start(videoElement: HTMLVideoElement) {
        if (monitor.current === null) {
            const warning = new BlinkWarning();
            monitor.current = new BlinkMonitor(new BlinkSensor(videoElement), warning);
            
            // 이벤트 리스너 등록
            monitor.current.on('blinkDetected', (data) => {
                setLastBlinkInterval(data.elapsedSeconds);
            });
        }

        if (monitor.current) {
            setIsRunning(true);
            monitor.current.startMonitoring();
        }
    }

    function stop() {
        if (monitor.current) {
            setIsRunning(false);
            monitor.current.stopMonitoring();
        }
    }

    function toggleWarning() {
        const newWarningEnabled = !isWarningEnabled;
        setIsWarningEnabled(newWarningEnabled);
        
        if (monitor.current) {
            monitor.current.setWarningEnabled(newWarningEnabled);
        }
    }

    function updateWarningThreshold(seconds: number) {
        setWarningThreshold(seconds);
        
        if (monitor.current) {
            monitor.current.setWarningThreshold(seconds);
        }
    }
    
    return {
        isRunning,
        start,
        stop,
        lastBlinkInterval,
        isWarningEnabled,
        toggleWarning,
        warningThreshold,
        updateWarningThreshold,
    }
}