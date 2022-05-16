import { AsyncEmit, AsyncVariable, event, Lock, mutex } from "@lbfalvy/mini-events";
import { string } from "fp-ts";

const strgGet = (key: string) => browser.storage.local.get([key]).then(x => x[key])
const strgSet = (key: string, value: any) => browser.storage.local.set({ [key]: value })
const strgChanged = (key: string, cb: (fresh: any, old: any) => void) => {
    const callback = (changes: { [P in string]?: browser.storage.StorageChange }, areaName: string) => {
        if (areaName !== 'local') return;
        const change = changes[key]
        if (change) cb(change.newValue, change.oldValue)
    }
    browser.storage.onChanged.addListener(callback)
    return () => browser.storage.onChanged.removeListener(callback)
}

export function extStorageVar<T>(name: string): [AsyncEmit<[T]>, AsyncVariable<T>, Lock<T>] {
    const dataKey = `data:${name}`
    const lockKey = `lock:${name}`
    const [dataChg, changed] = event<[T, T]>()
    const [lockChg, onLockChg] = event<[number, number]>()
    strgChanged(dataKey, (fresh, old) => dataChg(fresh, old))
    strgChanged(lockKey, (fresh, old) => lockChg(fresh, old))
    const lock = mutex(n => strgSet(lockKey, n), onLockChg)
    const get = () => strgGet(dataKey)
    return [
        val => strgSet(dataKey, val),
        { get, changed },
        async () => {
            const release = await lock()
            return [release, await get()]
        }
    ]
}