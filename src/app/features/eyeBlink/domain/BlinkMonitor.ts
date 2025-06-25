import { IMonitor } from '../interface/IMonitor';
import { ISensor } from '../interface/ISensor';

export class BlinkMonitor implements IMonitor {
  private isMonitoring: boolean = false;
  private lastBlinkTime: number = performance.now();
  private eventListeners: Map<string, (data: any) => void> = new Map();

  constructor(
    private sensor: ISensor,
    // private warning: IWarning,
    // private userSettings: IUserSettings
  ) {}

  on(eventName: string, callback: (data: any) => void): void {
    this.eventListeners.set(eventName, callback);
  }

  off(eventName: string): void {
    this.eventListeners.delete(eventName);
  }

  private emit(eventName: string, data: any): void {
    const callback = this.eventListeners.get(eventName);
    if (callback) {
      callback(data);
    }
  }

  startMonitoring(): void {
    if (this.isMonitoring) {
      console.log("Monitoring is already active.");
      return;
    }

    this.isMonitoring = true;
    console.log("Starting monitoring...");
    
    this.sensor.listen('blinkDetected', this.handleBlinkDetected);
  }

  stopMonitoring(): void {
    if (!this.isMonitoring) {
      console.log("Monitoring is not active.");
      return;
    }

    this.isMonitoring = false;
    console.log("Stopping monitoring...");

    this.sensor.off('blinkDetected');
  }

  private handleBlinkDetected = (blinkTimestamp: number): void => {
    const elapsedSeconds = (blinkTimestamp - this.lastBlinkTime)/1000;
    this.lastBlinkTime = blinkTimestamp;
    
    console.log(`마지막 깜빡임으로부터 경과된 시간: ${elapsedSeconds.toFixed(2)}초`);
    
    // 이벤트 발생
    this.emit('blinkDetected', {
      elapsedSeconds,
      timestamp: blinkTimestamp,
      lastBlinkTime: this.lastBlinkTime
    });
  };
} 