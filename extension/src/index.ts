import { getTenabl, Tenabl } from './tenabl'

// Declare global object
declare global {
    interface Window { tenabl?: Tenabl }
}

// Avoid top level await for compatibility
async function main() {
    let re = false
    if (window.tenabl) {
        re = true
        console.debug('Cleaning up old instance...')
        await window.tenabl.dispose()
    }
    console.debug('Constructing new instance...')
    window.tenabl = await getTenabl()
    console.debug(`Tenabl successfully ${re?'re':''}loaded`)
}

main()

export {}