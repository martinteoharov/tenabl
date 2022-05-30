import { Emit, variable, Variable } from '@lbfalvy/mini-events'
import ReactDOM from 'react-dom';
import { debounce } from '../helpers/debounce';
import { Overlay } from '../react/Overlay';
import { Article, getRatings } from './ratings';
import { stabilize } from '../helpers/stabilize';
import { getMeta } from './getMeta';
import { setBaseUri } from '../common/React/api/fetch';

export interface Tenabl {
    dispose: () => Promise<void>
}

export async function getTenabl(): Promise<Tenabl> {
    console.debug('Initializing Tenabl...')
    console.log('app url', import.meta.env.VITE_APP_URL)
    setBaseUri(import.meta.env.VITE_APP_URL)
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
    let setArticle: Emit<[Article]>
    let article: Variable<Article>
    onRefresh(async () => {
        await stabilize(500, 10_000)
        // const contentElements = content()
        // for (const el of contentElements) {
        //     el.style.border = '1px solid red'
        // }
        console.log(' ================[ Stuff loaded ]================ ')

        // ======== Render overlay ========
        const [art, cleanup] = await getRatings(getMeta());
        console.log('Sújt minket az a gyönyörű búbánatos kurvaélet')
        if (!article || !setArticle) {
            [setArticle, article] = variable(art)
            const root = document.createElement('div')
            root.id = 'tenablWroot'
            document.body.appendChild(root)
            console.log('>>>>>>>> Tenabl loaded into', root)
            ReactDOM.render(<Overlay currentArticle={article}/>, root)
        } else {
            setArticle(art)
        }
        article.changed(cleanup, false, true)
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