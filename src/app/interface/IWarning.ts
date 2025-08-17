export interface IWarning {
  addWarningTool(): void
  setWarning(type: 'blink', snapshot: monitorSnapshot): void
  endWarning(type: 'blink'): void
} 

export type monitorSnapshot = {
  lastBlinkAt?: Date | null;
  treshold?: number;
}