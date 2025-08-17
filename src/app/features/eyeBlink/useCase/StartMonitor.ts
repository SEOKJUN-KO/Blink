import { DBGateway } from "@/app/interface/DBGateway";
import { ISensor } from "@/app/interface/ISensor";

import { ServiceType } from "@/app/type/ServiceType";
import { IUseCase } from "@/app/interface/IUseCase"
import { IMonitor } from "@/app/interface/IMonitor";

export class StartMonitor implements IUseCase<{ type: ServiceType; callback: (value: any) => void }, boolean> {
    constructor(
        private sensor: ISensor,
        private context: IMonitor,
        private db: DBGateway<string, boolean, IMonitor>
    ) {}

    async execute(req: {type: ServiceType, callback: (value: any) => void}): Promise<boolean> {
        const dbStatus = this.db.set(req.type, this.context)
        if (!dbStatus) { return false }
        this.sensor.listen(req.type, req.callback)
        return true
    }
}