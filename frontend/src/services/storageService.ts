import { event, Variable, Emit } from "@lbfalvy/mini-events";

const keys = new Set<string>();

const onFreeFor = (key: string, onStorage: (e: StorageEvent) => void) => () => {
  keys.delete(key);
  window.removeEventListener("storage", onStorage);
};

const decodeNullable = <T>(s: string | undefined | null): T => {
  return s ? JSON.parse(s) : undefined;
}

/**
 * An interface for LocalStorage with change detection for
 * effective cross-tab state synchronization
 * @param key LocalStorage key to be used for this data
 * @returns Interface to get and set the data
 */
export const storageService = <T>(key: string): [Emit<[T]>, Variable<T>] => {
  if (keys.has(key)) throw new Error("Key already in use");
  keys.add(key);
  const [emit, changed] = event<[T, T]>();
  const onStorage = (e: StorageEvent) => {
    if (e.key !== key) return;

    emit(decodeNullable(e.newValue), decodeNullable(e.oldValue));
  };

  window.addEventListener("storage", onStorage);

  const srv: Variable<T> = {
    get: () => decodeNullable(localStorage.getItem(key)),
    changed,
  };

  if ("FinalizationRegistry" in window) {
    // TODO: figure out how to get the types for this
    // @ts-ignore
    new FinalizationRegistry<void>(onFreeFor(key, onStorage)).register(srv);
  }

  return [
    function set(data) {
      const old = srv.get();
      if (!data) localStorage.removeItem(key);
      else localStorage.setItem(key, JSON.stringify(data));
      emit(data, old);
    },
    srv,
  ];
};
