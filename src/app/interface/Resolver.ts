export interface IResolver {
    get<T>(t: symbol): T;
}