export interface IMonitor {
  startMonitoring(): void;
  stopMonitoring(): void;
  setWarning(eventName: string, callback: (data: any) => void): void;
  deleteWarning(eventName: string): void;
}
