export interface DBGateway<Key, Out, Data> {
    get(key: Key): Out;
    set(key: Key, data: Data): boolean;
    delete(key: Key): boolean;
}