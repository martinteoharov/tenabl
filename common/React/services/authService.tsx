import { localStorageVar } from 'localstorage-var'
import { toAsync } from '@lbfalvy/mini-events'
import { rtrAgent, State } from 'simple-rtr'
import { time } from "mockable-timer";

export const rtr = rtrAgent({
  renewOnTtl: 60, // Renew a minute before expiry
  lockExpiry: 5, // Wait 5 seconds on network error
  storage: toAsync<State | undefined>(localStorageVar('auth'), undefined),
  time: time,
  refresh: async refresh => { // Example implementation
    const res = await fetch('/api/auth/refresh', {
      method: 'POST',
      body: refresh
    });

    if (res.ok) return await res.json()
    if (res.status === 401) return 'invalid'

    throw new Error(`HTTP error ${res.status}`)
  }
});
