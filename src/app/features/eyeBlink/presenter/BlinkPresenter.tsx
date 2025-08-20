import { IDefaultPresenter } from "@/app/interface/IPresenter";

export type BlinkViewModel = {
  isRunning: boolean;
  lastBlinkAt: Date;
  warningThreshold: number;
  soundOn: boolean;
}

export type BlinkPresenterResponse = {

}

export class BlinkPresenter implements IDefaultPresenter <any>{
    private prevVM: BlinkViewModel | null = null;

    constructor(private onPresent: (vm: BlinkViewModel) => void) {}

    present(response: any): void {
      const newVM: BlinkViewModel = {
        isRunning: response.status == undefined ? (this.prevVM?.isRunning ?? false) : response.status === "ACTIVE" ? true : false ,
        lastBlinkAt: response.lastBlinkAt !== undefined ? response.lastBlinkAt : (this.prevVM?.lastBlinkAt ?? new Date()),
        warningThreshold: response.threshold !== undefined ? response.threshold : (this.prevVM?.warningThreshold ?? 5),
        soundOn: response.warnTools ? response.warnTools.includes('Sound') : (this.prevVM?.soundOn ?? false)
      };
      this.prevVM = newVM;
      this.onPresent(newVM); // 뷰 업데이트
    }
}