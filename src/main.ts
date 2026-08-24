/** Entry point: styles, app start, service worker registration. */

import './styles.css';
import { startApp } from './app';

startApp();

/* ----------------------------------------------------------------- offline */

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).then((reg) => {
      reg.addEventListener('updatefound', () => {
        const sw = reg.installing;
        if (!sw) return;
        sw.addEventListener('statechange', () => {
          if (sw.state === 'installed' && navigator.serviceWorker.controller) {
            const host = document.getElementById('toast');
            if (host) {
              host.innerHTML = `Update ready. <button class="btn btn--tiny" data-action="reload">Reload</button>`;
              host.className = 'toast is-visible';
              host.querySelector('[data-action="reload"]')?.addEventListener('click', () => {
                sw.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
              });
            }
          }
        });
      });
    });
  });
}
