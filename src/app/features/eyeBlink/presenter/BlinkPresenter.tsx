import { IDefaultPresenter } from "@/app/interface/IPresenter";

export type BlinkViewModel = {
  isRunning: boolean;
  lastBlinkAt: Date;
  warningThreshold: number;
  soundOn: boolean;
  pipOn: boolean;
  pipFlick: boolean;
}

export type BlinkPresenterResponse = {

}

export class BlinkPresenter implements IDefaultPresenter <any>{
  private prevVM: BlinkViewModel = {
    isRunning: false,
    lastBlinkAt: new Date(),
    warningThreshold: 5,
    soundOn: false,
    pipOn: false,
    pipFlick: false,
  };

    constructor(private onPresent: (vm: BlinkViewModel) => void) {}

    present(response: any): void {
      const newVM: BlinkViewModel = {
        isRunning: response.status ? response.status === "ACTIVE" ? true : false : this.prevVM.isRunning,
        lastBlinkAt: response.lastBlinkAt ?? this.prevVM.lastBlinkAt,
        warningThreshold: response.threshold ?? this.prevVM.warningThreshold,
        soundOn: response.warnTools ? response.warnTools.includes('Sound') : this.prevVM.soundOn,
        pipOn: response.warnTools ? response.warnTools.includes('PIP') : this.prevVM.pipOn,
        pipFlick: response.pipFlick ?? this.prevVM.pipFlick,
      };
      this.prevVM = newVM;
      this.onPresent(newVM); // 뷰 업데이트
    }
}