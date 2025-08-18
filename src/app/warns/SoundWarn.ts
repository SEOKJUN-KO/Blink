import { IWarn, monitorSnapshot, WarnOption } from "../interface/IWarning";

export class SoundWarn implements IWarn {
    constructor(
        private options: WarnOption
    ){}
    execute(snapshot: monitorSnapshot): { stop: () => {}; } {
        throw new Error("Method not implemented.");
    }
}