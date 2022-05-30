import { IArticle } from "../common/interfaces/article";

export function getMeta(): IArticle {
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content')
        ?? document.querySelector('meta[itemprop="description"]')?.getAttribute('content')
        ?? document.querySelector('meta[property="og:description"]')?.getAttribute('content')
        ?? 'Description not provided'
    return {
        url: location.href,
        name: document.title,
        description
    }
}