import { ServiceType } from "@/app/type/ServiceType";
import { IUseCase } from "@/app/interface/IUseCase"
import { IWarningExecutor, IWarningToolManager } from "@/app/interface/IWarning";
import { IDefaultPresenter } from "@/app/interface/IPresenter";
import { DBGateway } from "@/app/interface/DBGateway";
import { AdjustableMonitor } from "@/app/interface/IMonitor";
import { BlinkMonitorContext } from "../entity/BlinkMonitorContext";
import { ISensor } from "@/app/interface/ISensor";
import { IResolver } from "@/app/interface/Resolver";
import { DI_TOKENS } from "@/app/di/DI_Token";

export class SetThresholdUC implements IUseCase<{ type: ServiceType}, boolean> {
    private sensor: ISensor
    private db: DBGateway<string, AdjustableMonitor>
    private warn: IWarningExecutor
    private warnTools:IWarningToolManager
    private presenter: IDefaultPresenter<any>
    
    constructor(
        private readonly resolve: IResolver
    ) {
        this.sensor = this.resolve.get<ISensor>(DI_TOKENS.Blink.Sensor);
        this.db = this.resolve.get<DBGateway<string, AdjustableMonitor>>(DI_TOKENS.Blink.DB);
        this.presenter = this.resolve.get<IDefaultPresenter<any>>(DI_TOKENS.Blink.Presenter);
        this.warn = this.resolve.get<IWarningExecutor>(DI_TOKENS.Blink.Warn);
        this.warnTools = this.resolve.get<IWarningToolManager>(DI_TOKENS.Blink.WarnTools)
    }

    async execute(req: {type: ServiceType, threshold: number}): Promise<boolean> {
        let context = this.db.get(req.type) ??  new BlinkMonitorContext('ENDED', new Date(), 5)
        context.setThreshold(req.threshold)
        const dbStatus = this.db.set(req.type, context)
        if (!dbStatus) { return false }
        const data = context.snapshot()
        if (data.satus === 'ACTIVE') {
            this.sensor.listen(req.type, this.eventCallback)
            context.recordEvent(new Date())
        }
        data['warnTools'] = this.warnTools.getTools()
        this.presenter.present(data)
        return true
    }

    private eventCallback = (value: number): void => {
        const data = this.db.get('blink')?.snapshot()
        if (data == undefined || data.threshold == undefined) { return ; }
        const threshold = data.threshold
        this.warn.setWarning({threshold: threshold}, this.presenter.present.bind(this.presenter))
        this.presenter.present({lastBlinkAt: new Date()})
    };
}