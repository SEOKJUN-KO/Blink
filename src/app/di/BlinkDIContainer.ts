import { MonitorContextRepo } from "../db/InmemoryHash";
import { WarningManager } from "../domain/WarningManager";
import { BlinkViewController } from "../features/eyeBlink/controller/BlinkViewController";
import { BlinkSensor } from "../features/eyeBlink/domain/BlinkSensor";
import { BlinkPresenter } from "../features/eyeBlink/presenter/BlinkPresenter";
import { IDisposable } from "../interface/IDisposable";
import { IResolver } from "../interface/Resolver";
import { DI_TOKENS } from "./DI_Token";

// 목 클래스로 바꾸어 주입하고 싶을 때, 활용
export type BlinkOverrides = Partial<{
  sensor: BlinkSensor;
  repo: MonitorContextRepo;
  presenter: BlinkPresenter;
  controller: BlinkViewController;
  warn: WarningManager;
  warnTools: WarningManager;
}>;

export function buildBlinkDIContainer(
  o: {
    videoEl?: HTMLVideoElement;
    setVM?: React.Dispatch<any>;
    overrides?: BlinkOverrides;
    providers?: Partial<{
      presenter: () => BlinkPresenter;
      sensor: () => BlinkSensor;
      warn: () => WarningManager;
      warnTools: () => WarningManager;
      controller: (r: IResolver) => BlinkViewController;
    }>;
  } = {}
) {
  const reg = new Map<symbol, unknown>();
  const disposables: IDisposable[] = [];

  const getOrThrow = <T>(t: symbol): T => {
    const v = reg.get(t);
    if (!v) throw new Error(`DI not found: ${String(t)}`);
    return v as T;
  };
  const resolver: IResolver = { get: getOrThrow };

  const ovr = o.overrides ?? {};
  const p = o.providers ?? {};

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
    p.warn?.() ??
    new WarningManager();
  reg.set(DI_TOKENS.Blink.Warn, warn);

  const warnTools =
    ovr.warnTools ??
    p.warnTools?.() ??
    new WarningManager();
  reg.set(DI_TOKENS.Blink.WarnTools, warnTools);

  const controller =
    ovr.controller ??
    p.controller?.(resolver) ??
    new BlinkViewController(resolver);
  reg.set(DI_TOKENS.Blink.Controller, controller);

  // 선택: 등록 시 IDisposable 수집
  for (const v of reg.values()) {
    if (typeof (v as any)?.dispose === "function") disposables.push(v as IDisposable);
  }

  return {
    get: getOrThrow,
    dispose() {
      // 역순 해제
      for (let i = disposables.length - 1; i >= 0; i--) {
        try {
          disposables[i].dispose();
        } catch {}
      }
      reg.clear();
    },
  };
}