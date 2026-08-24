/** Minimal key-value adapter so the store can be unit-tested without a browser. */

export interface KV {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
  keys(): string[];
}

export const memoryKV = (seed: Record<string, string> = {}): KV => {
  const map = new Map<string, string>(Object.entries(seed));
  return {
    get: (k) => map.get(k) ?? null,
    set: (k, v) => void map.set(k, v),
    remove: (k) => void map.delete(k),
    keys: () => [...map.keys()],
  };
};

export const localStorageKV = (): KV => ({
  get: (k) => window.localStorage.getItem(k),
  set: (k, v) => window.localStorage.setItem(k, v),
  remove: (k) => window.localStorage.removeItem(k),
  keys: () => {
    const out: string[] = [];
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const k = window.localStorage.key(i);
      if (k !== null) out.push(k);
    }
    return out;
  },
});

/** True when localStorage exists and is writable (private mode / disabled storage). */
export const localStorageAvailable = (): boolean => {
  try {
    const probe = '__rt_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
};
