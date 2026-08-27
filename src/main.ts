/** Entry point: styles, app start, service worker registration. */

import './styles.css';
import { startApp } from './app';
import { setupPwaUpdates } from './pwa';

startApp();

/* ----------------------------------------------------------------- offline */

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    void setupPwaUpdates(import.meta.env.BASE_URL).catch(() => {
      // Offline support/update discovery is an enhancement; the routine tracker
      // must remain usable even if service-worker registration itself fails.
    });
  });
}
