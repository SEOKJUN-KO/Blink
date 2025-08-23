// di/tokens.ts
export const DI_TOKENS = {
    // 공용
    WarnFactory: Symbol("WarnFactory"),
    // Blink 모듈
    Blink: {
      Sensor: Symbol("Blink.Sensor"),
      DB: Symbol("Blink.DB"),
      Presenter: Symbol("Blink.Presenter"),
      Controller: Symbol("Blink.Controller"),
      Warn: Symbol("Blink.Warn"),
      WarnTools: Symbol("Blink.WarnTools"),
    },
} as const;