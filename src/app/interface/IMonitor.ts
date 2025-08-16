export interface IMonitor {
  startMonitoring(): void;
  stopMonitoring(): void;
  recordEvent(at: Date): void; // 깜빡임, 얼굴 터치, 머리 터치 등 이벤트 발생 시 
  snapshot(): {}; // 해당 모니터에서 유용한 정보를 받는 함수
  needWarn(now: Date): boolean; // 해당 모니터에서 경고를 줄지 말지에 대한 기준으로 판단하는 함수
}