export default function ofClass<T>(ctr: new () => T): (x: any) => x is T {
    return (x): x is T => x instanceof ctr
}
