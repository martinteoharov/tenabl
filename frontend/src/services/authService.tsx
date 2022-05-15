import { localStorageVar } from 'localstorage-var'
import { toAsync } from '@lbfalvy/mini-events'
import { rtrAgent, State } from 'simple-rtr'
import { time } from "mockable-timer";
import { fetchRefresh } from '../common/React/api/auth';
import { HttpError } from '../common/React/api/fetch';

export const rtr = rtrAgent({
  renewOnTtl: 60, // Renew a minute before expiry
  lockExpiry: 5, // Wait 5 seconds on network error
  time: time,
  refresh: async refresh => {
    try {
      const pair = await fetchRefresh(refresh)
      return {
        auth: pair.accessToken,
        refresh: pair.refreshToken
      }
    } catch(ex) {
      if (ex instanceof HttpError && ex.code === 401) {
        return 'invalid'
      }
      throw ex
    }
  },
  storage: toAsync<State | undefined>(localStorageVar('auth'), undefined),
});
