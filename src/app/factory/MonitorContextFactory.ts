import { BlinkMonitorContext } from "../features/eyeBlink/entity/BlinkMonitorContext";
import { IMonitor } from "../interface/IMonitor";
import { ServiceType } from "../type/ServiceType";

export interface MonitorContextFactory {
    create(type: ServiceType, initial: any): IMonitor
}


export class DefaultMonitorContextFactory implements MonitorContextFactory {
    create(type: ServiceType, initial?: any): IMonitor {
    if (type === "blink") {
        return new BlinkMonitorContext("ENDED", new Date(), initial?.threshold ?? 5);
    }   
    // ... 다른 서비스 타입 대응
    throw new Error(`Unknown service type: ${type}`);
    }
}