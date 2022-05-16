import { event, Subscribe } from '@lbfalvy/mini-events'
import ReactDOM from 'react-dom';
import ofClass from './common/ofClass'
import { content } from './content';
import { debounce } from './debounce';
import { diff } from './diff';
import { Overlay } from './react/Overlay';
import { stabilize } from './stabilize';

export interface Tenabl {
    dispose: () => Promise<void>
}

export async function getTenabl(): Promise<Tenabl> {
    console.debug('Initializing Tenabl...')
    const [refresh, onRefresh] = debounce(1000)
    
    // ======== Patch history API ========
    const oldPushState = history.pushState
    window.history.pushState = (...args) => {
        refresh()
        return oldPushState.apply(history, args)
    }
    window.addEventListener('hashchange', refresh)
    const patchFailed = window.history.pushState == oldPushState
    if (patchFailed) console.warn(
        'Tenabl failed to patch history API. Reload the page if you'
        + 'encounter problems'
    )
    else console.debug('Tenabl patched history API')

    // ======== Handle page refresh ========
    let managedElements: Element[] = []
    onRefresh(async () => {
        await stabilize(500, 10_000)
        // const contentElements = content()
        // for (const el of contentElements) {
        //     el.style.border = '1px solid red'
        // }

        // ======== Render overlay ========
        const root = document.createElement('div')
        document.body.appendChild(root)
        ReactDOM.render(<Overlay currentArticle={}/>, root)
    })
    refresh()

    return {
        dispose: async () => {
            // ======== Reset history API ========
            history.pushState = oldPushState
            window.removeEventListener('hashchange', refresh)
            
        }
    }
}