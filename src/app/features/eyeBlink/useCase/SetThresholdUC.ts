import { ServiceType } from "@/app/type/ServiceType";
import { IUseCase } from "@/app/interface/IUseCase"
import { IWarningExecutor, IWarningToolManager } from "@/app/interface/IWarning";
import { IDefaultPresenter } from "@/app/interface/IPresenter";
import { DBGateway } from "@/app/interface/DBGateway";
import { AdjustableMonitor } from "@/app/interface/IMonitor";
import { BlinkMonitorContext } from "../entity/BlinkMonitorContext";
import { ISensor } from "@/app/interface/ISensor";

export class SetThresholdUC implements IUseCase<{ type: ServiceType}, boolean> {
    constructor(
        private sensor: ISensor,
        private db: DBGateway<string, AdjustableMonitor>,
        private warn: IWarningExecutor,
        private warnTools:IWarningToolManager,
        private presenter: IDefaultPresenter<any>,
    ) {
        
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
        this.warn.setWarning({threshold: threshold})
        this.presenter.present({lastBlinkAt: new Date()})
    };
}