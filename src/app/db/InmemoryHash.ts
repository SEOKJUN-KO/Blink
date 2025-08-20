import { DBGateway } from "../interface/DBGateway";
import { AdjustableMonitor } from "../interface/IMonitor";

export class MonitorContextRepo implements DBGateway<string, AdjustableMonitor> {
    private map = new Map<string, AdjustableMonitor>();

    public get(key: string): AdjustableMonitor | null {
        return this.map.get(key) ?? null;
    }

    public set(key: string, data: AdjustableMonitor): boolean {
        this.map.set(key, data);
        return true;
    }

    public delete(key: string): boolean {
        return this.map.delete(key);
    }
}