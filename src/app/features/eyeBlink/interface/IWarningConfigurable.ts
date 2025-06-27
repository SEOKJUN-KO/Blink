export interface IWarningConfigurable {
  setWarningEnabled(enabled: boolean): void;
  setWarningThreshold(seconds: number): void;
} 