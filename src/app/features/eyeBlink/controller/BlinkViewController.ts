import { ISensor } from "@/app/interface/ISensor";
import { StartMonitorUC } from "../useCase/StartMonitorUC";
import { DBGateway } from "@/app/interface/DBGateway";
import { IMonitor } from "@/app/interface/IMonitor";
import { IWarningExecutor } from "@/app/interface/IWarning";
// import { StopMonitorUC } from "@/app/features/eyeBlink/useCase/StartMonitorUC";

export interface BlinkController {
    monitorStart(): void
    monitorStop(): void
}

export class BlinkViewController implements BlinkController{
    constructor(
        private sensor: ISensor,
        private db: DBGateway<string, IMonitor>,
        private warn: IWarningExecutor,
    ) {}
    
    public monitorStart(): void {
        new StartMonitorUC(this.sensor, this.db, this.warn).execute({type: 'blink'})
    }

    public monitorStop(): void {
    //     new StopMonitorUC(this.sensor, this.db).execute('blink')
    }
}