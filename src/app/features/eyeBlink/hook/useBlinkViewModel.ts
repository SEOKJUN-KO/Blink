import { IMonitor } from "../interface/IMonitor";
import { BlinkMonitor } from "../domain/BlinkMonitor";
import { BlinkSensor } from "../domain/BlinkSensor";
import { useRef, useState } from "react";

export default function useBlinkViewModel() {

    const [isRunning, setIsRunning] = useState(false);
    const monitor = useRef<IMonitor | null>(null);

    function start(videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement, blendShapesElement: HTMLUListElement) {
        if (monitor.current === null) {
            monitor.current = new BlinkMonitor(new BlinkSensor(videoElement, canvasElement, blendShapesElement));
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
        start,
        stop,
    }
}