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
        console.log('Cleaning up old instance...')
        await window.tenabl.dispose()
    }
    console.log('Constructing new instance...')
    window.tenabl = await getTenabl()
    console.log(`Tenabl successfully ${re?'re':''}loaded`)
}

main()

export {}