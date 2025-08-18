export interface DBGateway<Key, Data> {
    get(key: Key): null | Data;
    set(key: Key, data: Data): boolean;
    delete(key: Key): boolean;
}