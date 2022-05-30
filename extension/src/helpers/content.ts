const is = (...args: string[]) => `:is(${args.join(', ')})`
const within = (...args: string[]) => is(args.join(' '))
const filter = (sel: string, filter: string) => is(`${sel}:not(${filter})`)
const any = '*' 
const wrapper = is(`main`, `article`, `aside`)
const outside = (sel: string, wrap: string) => filter(sel, within(wrap, any))
const toplevel = (t: string) => outside(t, t)
const target = is(`p`, `li`, `blockquote`, `figcaption`, 'img')
const finalSel = outside(toplevel(within(wrapper, target)), 'nav')

const classKwBlocklist = ['related', 'articlelist', 'promo', 'advert']

function parentFilter(el: HTMLElement): boolean {
    for (const cls of el.classList) {
        const text = cls.toLowerCase()
        if (classKwBlocklist.some(kw => text.includes(kw))) return false
    }
    return true
}

export function content(): HTMLElement[] {
    const selected = [...document.querySelectorAll<HTMLElement>(finalSel)]
    const parentCache = new Map<HTMLElement, boolean>();
    return selected.filter(el => {
        if (!(el instanceof HTMLImageElement) && !el.textContent?.trim().length) return false;
        for (let i: HTMLElement|null = el; i !== null; i = i.parentElement) {
            const cached = parentCache.get(i)
            const result = cached ?? parentFilter(i)
            if (cached === undefined) parentCache.set(i, result)
            if (!result) return false
        }
        return true;
    })
}