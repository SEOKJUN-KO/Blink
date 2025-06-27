import { IMonitor } from '../interface/IMonitor';
import { IWarningConfigurable } from '../interface/IWarningConfigurable';
import { ISensor } from '../interface/ISensor';
import { IWarning } from '../interface/IWarning';

export class BlinkMonitor implements IMonitor, IWarningConfigurable {
  private isMonitoring: boolean = false;
  private lastBlinkTime: number = performance.now();
  private eventListeners: Map<string, (data: any) => void> = new Map();
  private isWarningEnabled: boolean = true;
  private warningThreshold: number = 5; // 5초
  private warningTimer: NodeJS.Timeout | null = null;
  private hasWarned: boolean = false;

  constructor(
    private sensor: ISensor,
    private warning: IWarning,
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

  setWarningEnabled(enabled: boolean): void {
    this.isWarningEnabled = enabled;
    if (!enabled) {
      this.stopWarningTimer();
    } else if (this.isMonitoring) {
      this.startWarningTimer();
    }
  }

  setWarningThreshold(seconds: number): void {
    this.warningThreshold = seconds;
    if (this.isMonitoring && this.isWarningEnabled) {
      this.restartWarningTimer();
    }
  }

  startMonitoring(): void {
    if (this.isMonitoring) {
      console.log("Monitoring is already active.");
      return;
    }

    this.isMonitoring = true;
    this.hasWarned = false;
    console.log("Starting monitoring...");
    
    this.sensor.listen('blinkDetected', this.handleBlinkDetected);
    this.startWarningTimer();
  }

  stopMonitoring(): void {
    if (!this.isMonitoring) {
      console.log("Monitoring is not active.");
      return;
    }

    this.isMonitoring = false;
    console.log("Stopping monitoring...");

    this.sensor.off('blinkDetected');
    this.stopWarningTimer();
  }

  private startWarningTimer(): void {
    if (!this.isWarningEnabled) return;
    
    this.stopWarningTimer();
    this.warningTimer = setTimeout(() => {
      if (this.isMonitoring && !this.hasWarned) {
        this.warning.makeWarning(`깜빡임이 ${this.warningThreshold}초 이상 없습니다. 눈을 깜빡여주세요.`);
        this.hasWarned = true;
      }
    }, this.warningThreshold * 1000);
  }

  private stopWarningTimer(): void {
    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
      this.warningTimer = null;
    }
  }

  private restartWarningTimer(): void {
    this.stopWarningTimer();
    this.startWarningTimer();
  }

  private handleBlinkDetected = (blinkTimestamp: number): void => {
    const elapsedSeconds = (blinkTimestamp - this.lastBlinkTime)/1000;
    this.lastBlinkTime = blinkTimestamp;
    
    console.log(`마지막 깜빡임으로부터 경과된 시간: ${elapsedSeconds.toFixed(2)}초`);
    
    // 깜빡임 감지 시 경고 타이머 리셋
    this.hasWarned = false;
    this.restartWarningTimer();
    
    // 이벤트 발생
    this.emit('blinkDetected', {
      elapsedSeconds,
      timestamp: blinkTimestamp,
      lastBlinkTime: this.lastBlinkTime
    });
  };
} 