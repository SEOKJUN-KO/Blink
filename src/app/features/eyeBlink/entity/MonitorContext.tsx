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
        if (this.status !== 'ACTIVE') throw new Error('not active');
        if (this.lastBlinkAt && at < this.lastBlinkAt) throw new Error('time back');
        this.lastBlinkAt = at;
    }
    
    snapshot(): {} {
        return {"id": this.id, "status": this.status, "lastBlink": this.lastBlinkAt, "threshold": this.threshold};
    }

    setThreshold(threshold: number): void {
        this.threshold = threshold
    }
    
    public stopMonitoring(): void {
        this.status = 'ENDED';
    }
}