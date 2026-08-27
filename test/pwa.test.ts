/**
 * @vitest-environment jsdom
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { setupPwaUpdates } from '../src/pwa';

class FakeWorker extends EventTarget {
  state: ServiceWorkerState = 'installed';
  postMessage = vi.fn();
}

class FakeRegistration extends EventTarget {
  installing: ServiceWorker | null = null;
  waiting: ServiceWorker | null = null;
  update = vi.fn(async () => undefined);
}

describe('PWA update flow', () => {
  afterEach(() => {
    document.getElementById('app-update')?.remove();
    vi.restoreAllMocks();
  });

  it('checks for updates without replacing local data and exposes a waiting update', async () => {
    window.localStorage.setItem('rt:day:2026-08-24', '{"keep":true}');

    const waiting = new FakeWorker();
    const registration = new FakeRegistration();
    registration.waiting = waiting as unknown as ServiceWorker;

    const container = new EventTarget() as EventTarget & {
      controller: ServiceWorker | null;
      register: ReturnType<typeof vi.fn>;
    };
    container.controller = {} as ServiceWorker;
    container.register = vi.fn(async () => registration as unknown as ServiceWorkerRegistration);

    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: container,
    });

    const cleanup = await setupPwaUpdates('./');

    expect(container.register).toHaveBeenCalledWith('./sw.js', { updateViaCache: 'none' });
    expect(registration.update).toHaveBeenCalled();
    expect(document.getElementById('app-update')?.textContent).toContain('Routine update ready');
    expect(window.localStorage.getItem('rt:day:2026-08-24')).toBe('{"keep":true}');

    const button = document.querySelector<HTMLButtonElement>('[data-update-now]');
    expect(button).not.toBeNull();
    button?.click();
    expect(waiting.postMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' });
    expect(window.localStorage.getItem('rt:day:2026-08-24')).toBe('{"keep":true}');

    cleanup();
  });
});
