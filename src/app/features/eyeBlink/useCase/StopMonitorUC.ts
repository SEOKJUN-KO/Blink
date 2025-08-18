import { DBGateway } from "@/app/interface/DBGateway";
import { ISensor } from "@/app/interface/ISensor";
import { ServiceType } from "@/app/type/ServiceType";
import { IUseCase } from "@/app/interface/IUseCase"
import { IMonitor } from "@/app/interface/IMonitor";
import { IWarningExecutor } from "@/app/interface/IWarning";

export class StopMonitorUC implements IUseCase<{ type: ServiceType}, boolean> {
    constructor(
        private sensor: ISensor,
        private db: DBGateway<string, IMonitor>,
        private warn: IWarningExecutor,
    ) {}

    async execute(req: {type: ServiceType}): Promise<boolean> {
        const ctx = this.db.get(req.type)
        if( ctx == undefined ) { return false }
        ctx.stopMonitoring()
        const dbStatus = this.db.delete(req.type)
        if (!dbStatus) { return false }
        this.sensor.off(req.type)
        this.warn.endWarning(req.type)
        return true
    }
}