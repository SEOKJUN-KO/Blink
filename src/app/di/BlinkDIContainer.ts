import { MonitorContextRepo } from "../db/InmemoryHash";
import { WarningManager } from "../domain/WarningManager";
import { BlinkViewController } from "../features/eyeBlink/controller/BlinkViewController";
import { BlinkSensor } from "../features/eyeBlink/domain/BlinkSensor";
import { BlinkPresenter } from "../features/eyeBlink/presenter/BlinkPresenter";
import { IDisposable } from "../interface/IDisposable";
import { IResolver } from "../interface/Resolver";
import { DI_TOKENS } from "./DI_Token";

// Blink DI 컨테이너에서 오버라이드(테스트나 목 객체 주입 등)할 수 있는 타입 정의
export type BlinkOverrides = Partial<{
  sensor: BlinkSensor;
  repo: MonitorContextRepo;
  presenter: BlinkPresenter;
  controller: BlinkViewController;
  warn: WarningManager; 
  warnTools: WarningManager;
}>;

// Blink DI 컨테이너 생성 함수
export function buildBlinkDIContainer(
  o: {
    videoEl: HTMLVideoElement; // 비디오 엘리먼트 참조
    setVM: React.Dispatch<any>; // 뷰모델 setter
    overrides?: BlinkOverrides; // 오버라이드 객체
  }
) {
  // DI 등록용 맵
  const reg = new Map<symbol, unknown>();
  // IDisposable 객체 수집용 배열
  const disposables: IDisposable[] = [];

  // DI 토큰으로 
  // 1. lazy init 함수 -> 객체 생성 저장 // 2. 객체를 꺼냄
  // 3. 없으면 예외 발생
  const getOrThrow = <T>(t: symbol): T => {
    const entry = reg.get(t);
    if (!entry) throw new Error(`DI not found: ${String(t)}`);
    if (typeof entry === "function") {
      const inst = (entry as () => T)(); // 여기서 최초 생성
      reg.set(t, inst);
      return inst;
    }
    return entry as T; // 이미 인스턴스이면 그대로 반환
  };
  
  // IResolver 구현체
  const resolver: IResolver = { get: getOrThrow };

  // 오버라이드 및 프로바이더 단축 변수
  const ovr = o.overrides ?? {};
  const p = { // lazy 객체 생성 함수
    presenter: (() => new BlinkPresenter(o.setVM)),
    sensor: (() => new BlinkSensor(o.videoEl)), 
    warn: (() => new WarningManager()), 
    warnTools: (() => new WarningManager()),
    controller: ((r: IResolver) => new BlinkViewController(r))
  }

  const presenter =
    ovr.presenter ??
    p.presenter?.() ??
    new BlinkPresenter(o.setVM!);
  reg.set(DI_TOKENS.Blink.Presenter, presenter);

  const sensor =
    ovr.sensor ??
    p.sensor?.() ??
    new BlinkSensor(o.videoEl!);
  reg.set(DI_TOKENS.Blink.Sensor, sensor);

  const repo =
    ovr.repo ??
    new MonitorContextRepo();
  reg.set(DI_TOKENS.Blink.DB, repo);

  const warn =
    ovr.warn ??
    reg.get(DI_TOKENS.Blink.WarnTools) ??
    p.warn?.() ??
    new WarningManager();
  reg.set(DI_TOKENS.Blink.Warn, warn);

  const warnTools =
    ovr.warnTools ??
    reg.get(DI_TOKENS.Blink.Warn) ??
    p.warnTools?.() ??
    new WarningManager();
  reg.set(DI_TOKENS.Blink.WarnTools, warnTools);

  const controller =
    ovr.controller ??
    p.controller?.(resolver) ??
    new BlinkViewController(resolver);
  reg.set(DI_TOKENS.Blink.Controller, controller);

  // IDisposable 구현체 수집 (dispose 메서드가 있으면)
  for (const v of reg.values()) {
    if (typeof (v as any)?.dispose === "function") disposables.push(v as IDisposable);
  }

  // DI 컨테이너 반환 (get, dispose 메서드 제공)
  return {
    get: getOrThrow,
    dispose() {
      // 역순으로 dispose 호출
      for (let i = disposables.length - 1; i >= 0; i--) {
        try {
          disposables[i].dispose();
        } catch {}
      }
      reg.clear();
    },
  };
}