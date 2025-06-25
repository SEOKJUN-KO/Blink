import { IMonitor } from "../interface/IMonitor";
import { BlinkMonitor } from "../domain/BlinkMonitor";
import { BlinkSensor } from "../domain/BlinkSensor";
import { useRef, useState } from "react";

export default function useBlinkViewModel() {

    const [isRunning, setIsRunning] = useState(false);
    const [lastBlinkInterval, setLastBlinkInterval] = useState<number>(0);
    const monitor = useRef<IMonitor | null>(null);

    function start(videoElement: HTMLVideoElement) {
        if (monitor.current === null) {
            monitor.current = new BlinkMonitor(new BlinkSensor(videoElement));
            
            // 이벤트 리스너 등록
            monitor.current.on('blinkDetected', (data) => {
                setLastBlinkInterval(data.elapsedSeconds.toFixed(2));
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
    
    return {
        isRunning,
        lastBlinkInterval,
        start,
        stop,
    }
}