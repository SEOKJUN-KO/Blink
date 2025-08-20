import { ServiceType } from "@/app/type/ServiceType";
import { IUseCase } from "@/app/interface/IUseCase"
import { IWarningToolManager, WarningToolType } from "@/app/interface/IWarning";
import { IDefaultPresenter } from "@/app/interface/IPresenter";
import { DBGateway } from "@/app/interface/DBGateway";
import { IMonitor } from "@/app/interface/IMonitor";
import { BlinkMonitorContext } from "../entity/BlinkMonitorContext";

export class DeleteWarnToolUC implements IUseCase<{ type: ServiceType}, boolean> {
    constructor(
        private db: DBGateway<ServiceType, IMonitor>,
        private warnTools: IWarningToolManager,
        private presenter: IDefaultPresenter<any>,
    ) {}

    async execute(req: { type: ServiceType, toolType: WarningToolType}): Promise<boolean> {
        let data = this.db.get(req.type)?.snapshot()
        if( data == undefined ) { 
            const ctx = new BlinkMonitorContext('ENDED', new Date(), 5)
            this.db.set(req.type, ctx)
            data = ctx.snapshot()
        }
        this.warnTools.deleteTool(req.toolType);
        data['warnTools'] = this.warnTools.getTools()
        this.presenter.present(data)
        return true;
    }
}