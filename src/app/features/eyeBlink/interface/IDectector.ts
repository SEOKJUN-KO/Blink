export interface IDectector {
  makeDetector(): Promise<void>;
  enableDetector(): Promise<void>;
  disableDetector(): Promise<void>;
}