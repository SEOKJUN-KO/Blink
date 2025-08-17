import { AdjustableMonitor } from "@/app/interface/IMonitor";

export class BlinkMonitorContext implements AdjustableMonitor {
    constructor(
      private status: 'ACTIVE'|'ENDED',
      private lastBlinkAt: Date,
      private threshold: number,
    ) {}

    public startMonitoring() {
        this.status = 'ACTIVE';
        this.lastBlinkAt = new Date();
    }

    public recordEvent(at: Date): void {
        if (this.status !== 'ACTIVE') throw new Error('not active');
        if (this.lastBlinkAt && at < this.lastBlinkAt) throw new Error('time back');
        this.lastBlinkAt = at;
    }
    
    public snapshot(): {} {
        return {"status": this.status, "lastBlink": this.lastBlinkAt, "threshold": this.threshold};
    }

    public setThreshold(threshold: number): void {
        this.threshold = threshold
    }
    
    public stopMonitoring(): void {
        this.status = 'ENDED';
    }
}