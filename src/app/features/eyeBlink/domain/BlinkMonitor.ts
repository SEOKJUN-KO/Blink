import { IMonitor } from '../interface/IMonitor';

export class BlinkMonitor implements IMonitor {
  private isMonitoring: boolean = false;

  constructor(
    // private sensor: ISensor,
    // private warning: IWarning,
    // private userSettings: IUserSettings
  ) {}

  startMonitoring(): void {
    if (this.isMonitoring) {
      console.log("Monitoring is already active.");
      return;
    }

    this.isMonitoring = true;
    console.log("Starting monitoring...");
    
  }

  stopMonitoring(): void {
    if (!this.isMonitoring) {
      console.log("Monitoring is not active.");
      return;
    }

    this.isMonitoring = false;
    console.log("Stopping monitoring...");
  }

} 