import { IDefaultPresenter } from "@/app/interface/IPresenter";

export type BlinkViewModel = {
    isRunning: boolean;
    lastBlinkInterval: Date;
    isWarningEnabled: boolean;
    warningThreshold: number;
}

export class BlinkPresenter implements IDefaultPresenter <any>{
    constructor(private onPresent: (vm: BlinkViewModel) => void) {}

  present(response: any): void {
    const viewModel: BlinkViewModel = {
        isRunning: response.status === 'ACTIVE' ? true : false,
        lastBlinkInterval: response.lastBlinkAt,
        isWarningEnabled: true,
        warningThreshold: response.treshold,
    };
    this.onPresent(viewModel); // 뷰 업데이트
  }
}