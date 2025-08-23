import { WarnFactory } from "../factory/WarnFactory";
import { DI_TOKENS } from "./DI_Token";


const reg = new Map<symbol, unknown>();
reg.set(DI_TOKENS.WarnFactory, new WarnFactory());

export const rootDIContainer = {
  get<T>(t: symbol) { return reg.get(t) as T; },
};