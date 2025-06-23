import { IMonitor } from "../interface/IMonitor";
import { BlinkMonitor } from "../domain/BlinkMonitor";
import { BlinkSensor } from "../domain/BlinkSensor";
import { useEffect, useState } from "react";

export default function useBlinkViewModel(videoElement: HTMLVideoElement | null, canvasElement: HTMLCanvasElement | null) {

    const [isRunning, setIsRunning] = useState(false);
    const [monitor, setMonitor] = useState<IMonitor | null>(null);

    useEffect(() => {
        if (videoElement && canvasElement) {
            setMonitor(new BlinkMonitor(new BlinkSensor(videoElement, canvasElement)));
        }
    }, [videoElement, canvasElement]);

    function start() {
        console.log("start");
        if (monitor) {
            setIsRunning(true);
            monitor.startMonitoring();
        }
    }

    function stop() {
        if (monitor) {
            setIsRunning(false);
            monitor.stopMonitoring();
        }
    }
    
    return {
        isRunning,
        start,
        stop,
    }
}