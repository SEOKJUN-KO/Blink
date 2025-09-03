export interface IMonitor {
  startMonitoring(): void;
  stopMonitoring(): void;
  recordEvent(at: Date): void; // 깜빡임, 얼굴 터치, 머리 터치 등 이벤트 발생 시 
  snapshot(): any; // 해당 모니터에서 유용한 정보를 받는 함수
  resetEvent(): void; // 이벤트 초기화
}

export interface AdjustableMonitor extends IMonitor {
  setThreshold(threadhold: Number): void; // 경고와 관련한 기준을 설정하는 함수
}