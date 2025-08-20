import { IDefaultPresenter } from "@/app/interface/IPresenter";
import { WarningToolType } from "@/app/interface/IWarning";

export type BlinkViewModel = {
  isRunning: boolean;
  lastBlinkInterval: Date;
  warningThreshold: number;
  soundOn: boolean;
}

export type BlinkPresenterResponse = {

}

export class BlinkPresenter implements IDefaultPresenter <any>{
    constructor(private onPresent: (vm: BlinkViewModel) => void) {}

  present(response: any): void {
    const viewModel: BlinkViewModel = {
      isRunning: response.status === 'ACTIVE' ? true : false,
      lastBlinkInterval: response.lastBlinkAt,
      warningThreshold: response.threshold,
      soundOn: response.warnTools.includes('Sound')
    };
    this.onPresent(viewModel); // 뷰 업데이트
  }
}