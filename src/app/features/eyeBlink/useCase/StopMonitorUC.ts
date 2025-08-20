import { DBGateway } from "@/app/interface/DBGateway";
import { ISensor } from "@/app/interface/ISensor";
import { ServiceType } from "@/app/type/ServiceType";
import { IUseCase } from "@/app/interface/IUseCase"
import { AdjustableMonitor } from "@/app/interface/IMonitor";
import { IWarningExecutor, IWarningToolManager } from "@/app/interface/IWarning";
import { IDefaultPresenter } from "@/app/interface/IPresenter";

export class StopMonitorUC implements IUseCase<{ type: ServiceType}, boolean> {
    constructor(
        private sensor: ISensor,
        private db: DBGateway<string, AdjustableMonitor>,
        private warn: IWarningExecutor,
        private warnTools:IWarningToolManager,
        private presenter: IDefaultPresenter<any>
    ) {}

    async execute(req: {type: ServiceType}): Promise<boolean> {
        const ctx = this.db.get(req.type)
        if( ctx == undefined ) { return false }
        ctx.stopMonitoring()
        const dbStatus = this.db.set(req.type, ctx)
        if (!dbStatus) { return false }
        this.sensor.off(req.type)
        this.warn.endWarning()
        const data = ctx.snapshot()
        data['warnTools'] = this.warnTools.getTools()
        this.presenter.present(data)
        return true
    }
}