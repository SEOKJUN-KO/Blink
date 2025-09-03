import { ServiceType } from "@/app/type/ServiceType";
import { IUseCase } from "@/app/interface/IUseCase"
import { IWarningExecutor } from "@/app/interface/IWarning";
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
    private presenter: IDefaultPresenter<any>
    
    constructor(
        private readonly resolve: IResolver
    ) {
        this.sensor = this.resolve.get<ISensor>(DI_TOKENS.Blink.Sensor);
        this.db = this.resolve.get<DBGateway<string, AdjustableMonitor>>(DI_TOKENS.Blink.DB);
        this.presenter = this.resolve.get<IDefaultPresenter<any>>(DI_TOKENS.Blink.Presenter);
        this.warn = this.resolve.get<IWarningExecutor>(DI_TOKENS.Blink.Warn);
    }

    async execute(req: {type: ServiceType, threshold: number}): Promise<boolean> {
        let context = this.db.get(req.type) ??  new BlinkMonitorContext('ENDED', new Date(), 5)
        context.resetEvent()
        context.setThreshold(req.threshold)
        const dbStatus = this.db.set(req.type, context)
        if (!dbStatus) { return false }
        this.warn.setWarning({threshold: req.threshold}, this.presenter.present.bind(this.presenter))
        
        const data = context.snapshot()
        if (data.status === 'ACTIVE') {
            this.sensor.listen(req.type, this.eventCallback)
        }
        this.presenter.present(data)
        return true
    }

    private eventCallback = (value: number): void => {
        const ctx = this.db.get('blink')
        if (ctx == undefined || ctx.snapshot().threshold == undefined) { return ; }
        const data = ctx.snapshot()
        ctx.recordEvent(new Date())
        this.db.set('blink', ctx)
        const threshold = data.threshold
        this.warn.setWarning({threshold: threshold}, this.presenter.present.bind(this.presenter))
        this.presenter.present({lastBlinkAt: ctx.snapshot().lastBlinkAt})
    };
}



