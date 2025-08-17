import { ISensor } from "@/app/interface/ISensor";
import { MonitorContext } from "../entity/MonitorContext";
import { randomUUID } from "crypto";
import { IWarningExecutor } from "@/app/interface/IWarning";

export class MonitorInteractor {
    private context: MonitorContext = new MonitorContext(randomUUID(), "ENDED", new Date(), 5)
    
    constructor(
        private sensor: ISensor,
        private warning: IWarningExecutor,
    ) {}

    public startMonitor() {
        this.context.startMonitoring();
        const data: any = this.context.snapshot();
        if (data['status'] !== 'ACTIVE') { throw new Error('not active'); }
        this.sensor.listen('blinkDetected', this.handleBlinkDetected);
    }

    public stopMonitor() {
        this.context.stopMonitoring();
        this.sensor.off('blinkDetected');
    }

    private handleBlinkDetected = (at: Date): void => {
        const data: any = this.context.snapshot();
        if (data['status'] !== 'ACTIVE') { throw new Error('not active'); }
        if (data['treshold'] == undefined ) { throw new Error(`don't have treshold`); }
        this.context.recordEvent(at)
        this.warning.setWarning('blink', {lastBlinkAt: at, treshold: data['treshold']})
    };
}