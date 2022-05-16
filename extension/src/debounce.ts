import { Emit, event, Subscribe } from "@lbfalvy/mini-events";

export function debounce<T extends any[]>(wait: number): [Emit<T>, Subscribe<T>] {
    let timeout: ReturnType<typeof setTimeout> | undefined
    const [emit, sub] = event<T>()
    return [
        (...args) => {
            if (timeout !== undefined) clearTimeout(timeout);
            timeout = setTimeout(() => {
                timeout = undefined;
                emit(...args);
            }, wait)
        },
        sub
    ]
}