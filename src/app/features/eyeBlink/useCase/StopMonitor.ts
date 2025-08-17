import { DBGateway } from "@/app/interface/DBGateway";
import { ISensor } from "@/app/interface/ISensor";
import { ServiceType } from "@/app/type/ServiceType";
import { IUseCase } from "@/app/interface/IUseCase"
import { IMonitor } from "@/app/interface/IMonitor";

export class StopMonitor implements IUseCase<ServiceType, boolean> {
    constructor(
        private sensor: ISensor,
        private db: DBGateway<string, IMonitor, IMonitor>
    ) {}

    async execute(req: ServiceType): Promise<boolean> {
        const context = this.db.get(req);
        if (!context) { return false; }
        
        const dbStatus = this.db.set(req, context);
        if (!dbStatus) { return false; }
        
        context.stopMonitoring();
        this.sensor.off(req);
        return true;
    }
}