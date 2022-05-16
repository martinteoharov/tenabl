interface Diff<T> {
    insert: Set<T>,
    remove: Set<T>,
    match: Set<T>
}

export function diff<T>(a: Iterable<T>, b: Iterable<T>): Diff<T> {
    const aarr: T[] = Array.isArray(a) ? a : [...a]
    const barr: T[] = Array.isArray(b) ? b : [...b]
    const aset: Set<T> = a instanceof Set ? a : new Set(a)
    const bset: Set<T> = b instanceof Set ? b : new Set(b)
    const diff: Diff<T> = {
        match: new Set(aarr.filter(el => bset.has(el))),
        remove: new Set(aarr.filter(el => !bset.has(el))),
        insert: new Set(barr.filter(el => !aset.has(el))),
    }
    return diff
}