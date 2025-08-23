import { ServiceType } from "@/app/type/ServiceType";
import { IUseCase } from "@/app/interface/IUseCase"
import { IWarn, IWarningToolManager, WarningToolType } from "@/app/interface/IWarning";
import { IDefaultPresenter } from "@/app/interface/IPresenter";
import { DBGateway } from "@/app/interface/DBGateway";
import { AdjustableMonitor } from "@/app/interface/IMonitor";
import { BlinkMonitorContext } from "../entity/BlinkMonitorContext";
import { IResolver } from "@/app/interface/Resolver";
import { DI_TOKENS } from "@/app/di/DI_Token";

export class SetWarnToolUC implements IUseCase<{ type: ServiceType}, boolean> {
    private db: DBGateway<ServiceType, AdjustableMonitor>
    private warnTools: IWarningToolManager
    private presenter: IDefaultPresenter<any>
    
    constructor( private readonly resolve: IResolver) {
        this.db = this.resolve.get<DBGateway<string, AdjustableMonitor>>(DI_TOKENS.Blink.DB);
        this.presenter = this.resolve.get<IDefaultPresenter<any>>(DI_TOKENS.Blink.Presenter);
        this.warnTools = this.resolve.get<IWarningToolManager>(DI_TOKENS.Blink.Warn);
    }

    async execute(req: { type: ServiceType, toolType: WarningToolType, warn: IWarn }): Promise<boolean> {
        let data = this.db.get(req.type)?.snapshot()
        if( data == undefined ) { 
            const ctx = new BlinkMonitorContext('ENDED', new Date(), 5)
            this.db.set(req.type, ctx)
            data = ctx.snapshot()
        }
        this.warnTools.addTool(req.toolType, req.warn);
        data['warnTools'] = this.warnTools.getTools()
        this.presenter.present(data)
        return true;
    }
}