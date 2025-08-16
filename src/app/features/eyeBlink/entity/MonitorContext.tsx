import { AdjustableMonitor } from "@/app/interface/IMonitor";

export class MonitorContext implements AdjustableMonitor {
    constructor(
      private readonly id: string, // 모니터링 세션 고유 아이디, 이후 레포지터리 추가 시 사용
      private status: 'ACTIVE'|'ENDED',
      private lastBlinkAt: Date,
      private threshold: number,
    ) {}

    public startMonitoring() {
        this.status = 'ACTIVE';
        this.lastBlinkAt = new Date();
    }

    recordEvent(at: Date): void {
        this.lastBlinkAt = at;
    }
    
    snapshot(): {} {
        return {"lastBlink": this.lastBlinkAt};
    }

    setThreshold(threshold: number): void {
        this.threshold = threshold
    }
    
    needWarn(now: Date): boolean {
        if (this.status === "ENDED") { return false; }
        const elapsedSeconds = (now.getTime() - this.lastBlinkAt.getTime()) / 1000;
        return elapsedSeconds >= this.threshold;
    }

    public stopMonitoring(): void {
        this.status = 'ENDED';
    }
}