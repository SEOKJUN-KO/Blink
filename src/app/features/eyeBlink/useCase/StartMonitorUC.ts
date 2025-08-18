import { DBGateway } from "@/app/interface/DBGateway";
import { ISensor } from "@/app/interface/ISensor";
import { ServiceType } from "@/app/type/ServiceType";
import { IUseCase } from "@/app/interface/IUseCase"
import { IMonitor } from "@/app/interface/IMonitor";
import { BlinkMonitorContext } from "../entity/BlinkMonitorContext";
import { IWarningExecutor } from "@/app/interface/IWarning";

export class StartMonitorUC implements IUseCase<{ type: ServiceType}, boolean> {
    private context: BlinkMonitorContext;

    constructor(
        private sensor: ISensor,
        private db: DBGateway<string, IMonitor>,
        private warn: IWarningExecutor,
    ) {
        this.context = new BlinkMonitorContext('ENDED', new Date(), 5);
    }

    async execute(req: {type: ServiceType}): Promise<boolean> {
        const dbStatus = this.db.set(req.type, this.context)
        if (!dbStatus) { return false }
        this.sensor.listen(req.type, this.eventCallback)
        return true
    }

    private eventCallback = (): void => {
        const data = this.db.get('blink')?.snapshot()
        if (data === undefined || data['treshold'] === undefined) { return ; }
        const treshold = data['treshold']
        this.warn.setWarning('blink', {treshold: treshold})
    };
}