/**
 * The one module app code talks to. Swapping localStorage for Supabase later
 * (spec §7.3) means replacing the backend here, not touching the views.
 */

import { createLocalStore, type Store } from './localStore';
import { localStorageAvailable, localStorageKV, memoryKV } from './kv';

export type { Store, ImportSummary } from './localStore';

let instance: Store | null = null;

/** True when persistence is in-memory only (private browsing, storage blocked). */
export let storageIsEphemeral = false;

export const getStore = (): Store => {
  if (instance) return instance;
  if (localStorageAvailable()) {
    instance = createLocalStore(localStorageKV());
  } else {
    storageIsEphemeral = true;
    instance = createLocalStore(memoryKV());
  }
  return instance;
};

/** Test seam. */
export const setStore = (s: Store): void => {
  instance = s;
};
