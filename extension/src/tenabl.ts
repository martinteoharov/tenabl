export interface Tenabl {
    dispose: () => Promise<void>
}

export async function getTenabl(): Promise<Tenabl> {
    // Set everything up
    return {
        dispose: async () => {
            // Tear everything down
        }
    }
}