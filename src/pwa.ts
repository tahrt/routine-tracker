/**
 * Production PWA update lifecycle.
 *
 * Data lives in localStorage and is intentionally not touched here. Updating the
 * service worker only replaces cached app files; the existing Home Screen app
 * keeps the same origin/storage container.
 */

const UPDATE_BANNER_ID = 'app-update';

const showUpdateBanner = (worker: ServiceWorker): void => {
  let host = document.getElementById(UPDATE_BANNER_ID);
  if (!host) {
    host = document.createElement('aside');
    host.id = UPDATE_BANNER_ID;
    host.className = 'update-banner';
    host.setAttribute('role', 'status');
    host.setAttribute('aria-live', 'polite');
    document.body.appendChild(host);
  }

  host.innerHTML = `
    <div class="update-banner__copy">
      <strong>Routine update ready</strong>
      <span>Your saved data stays on this device.</span>
    </div>
    <button class="btn btn--primary btn--tiny" type="button" data-update-now>Update now</button>
  `;

  const button = host.querySelector<HTMLButtonElement>('[data-update-now]');
  button?.addEventListener(
    'click',
    () => {
      if (!button) return;
      button.disabled = true;
      button.textContent = 'Updating…';

      let reloading = false;
      const reloadOnce = (): void => {
        if (reloading) return;
        reloading = true;
        window.location.reload();
      };

      // Reload only after the new worker has actually taken control. Reloading
      // immediately after postMessage can race activation and reopen old code.
      navigator.serviceWorker.addEventListener('controllerchange', reloadOnce, { once: true });
      worker.postMessage({ type: 'SKIP_WAITING' });
    },
    { once: true },
  );
};

const watchInstallingWorker = (registration: ServiceWorkerRegistration): void => {
  const worker = registration.installing;
  if (!worker) return;

  worker.addEventListener('statechange', () => {
    if (worker.state === 'installed' && navigator.serviceWorker.controller) {
      showUpdateBanner(worker);
    }
  });
};

/**
 * Register the service worker and keep checking it when the Home Screen app
 * becomes active again. Returns a cleanup function mainly for tests.
 */
export const setupPwaUpdates = async (baseUrl: string): Promise<() => void> => {
  if (!('serviceWorker' in navigator)) return () => undefined;

  const registration = await navigator.serviceWorker.register(`${baseUrl}sw.js`, {
    // Do not let the HTTP cache hide a newly deployed service-worker script.
    updateViaCache: 'none',
  });

  // The app might have missed updatefound while it was suspended/backgrounded.
  if (registration.waiting && navigator.serviceWorker.controller) {
    showUpdateBanner(registration.waiting);
  }

  const onUpdateFound = (): void => watchInstallingWorker(registration);
  registration.addEventListener('updatefound', onUpdateFound);

  const check = (): void => {
    if (document.visibilityState === 'visible') {
      void registration.update().catch(() => undefined);
    }
  };

  const onVisibility = (): void => check();
  const onPageShow = (): void => check();

  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('pageshow', onPageShow);

  // Also catch a long-running standalone app that never fully backgrounds.
  const timer = window.setInterval(check, 60 * 60 * 1000);

  // Explicit first check instead of relying only on the browser's schedule.
  check();

  return () => {
    registration.removeEventListener('updatefound', onUpdateFound);
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('pageshow', onPageShow);
    window.clearInterval(timer);
    document.getElementById(UPDATE_BANNER_ID)?.remove();
  };
};
