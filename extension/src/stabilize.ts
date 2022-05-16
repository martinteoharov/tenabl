import { debounce } from "./debounce";

export async function stabilize(duration = 500, max = Infinity) {
    const [holup, ready] = debounce(duration)
    const ob = new MutationObserver(() => holup())
    ob.observe(document.body, { childList: true, subtree: true })
    await Promise.race([
        new Promise<void>(r => ready(r)),
        new Promise(r => setTimeout(r, max))
    ])
    ob.disconnect();
    return;
}