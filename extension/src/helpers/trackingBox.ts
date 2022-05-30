const container = document.createElement("div")
Object.assign(container.style, {
    position: 'absolute',
    top: '0', left: '0', bottom: '0', right: '0'
} as CSSStyleDeclaration)
container.id = 'tracking-box-container'
document.body.appendChild(container)

function makeBox(): HTMLDivElement {
    const box = document.createElement('div')
    Object.assign(box.style, {
        position: 'absolute',
        top: '0', left: '0'
    })
    return box
}

function moveBox(box: HTMLDivElement, t: number, l: number, b: number, r: number) {
    box.style.top = `${t}px`;
    box.style.left = `${l}px`;
    box.style.bottom = `${b}px`;
    box.style.right = `${r}px`;
}

export function trackingBoxFor(el: Element): HTMLDivElement {
    const box = makeBox();
    const ob = new IntersectionObserver(entv => {
        const last = entv[entv.length - 1]
    })
    return box
}