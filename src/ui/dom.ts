/** Tiny render helpers. Views build HTML strings; events are delegated in main.ts. */

export const esc = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);

export const cx = (...parts: (string | false | null | undefined)[]): string => parts.filter(Boolean).join(' ');

export const qs = <T extends Element>(sel: string, root: ParentNode = document): T => {
  const el = root.querySelector<T>(sel);
  if (!el) throw new Error(`missing element: ${sel}`);
  return el;
};

let toastTimer: number | undefined;

export const toast = (message: string, kind: 'info' | 'error' = 'info'): void => {
  const host = document.getElementById('toast');
  if (!host) return;
  host.textContent = message;
  host.className = `toast toast--${kind} is-visible`;
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    host.className = 'toast';
  }, 3200);
};
