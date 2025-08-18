import { IWarn, WarningToolType, WarnOption } from "../interface/IWarning";
import { PIPWarn } from "../warns/PIPWarn";
import { SoundWarn } from "../warns/SoundWarn";

export interface IWarnFactory {
    create(type: WarningToolType, options: WarnOption): IWarn
}

export class WarnFactory implements IWarnFactory {
    private registry: Record<WarningToolType, new (option: WarnOption) => IWarn> = {
        'PIP': PIPWarn,
        'Sound': SoundWarn,
    };
    
    public create(type: WarningToolType, options: WarnOption): IWarn {
        const warnClass = this.registry[type]
        if (!warnClass) throw new Error("Unknown shape");
        return new warnClass(options)
    }
}