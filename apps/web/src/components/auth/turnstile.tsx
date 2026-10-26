'use client';

import { useEffect, useRef, useState } from 'react';

/** Public site key of the Turnstile widget; the API holds its secret as TURNSTILE_SECRET. */
const TURNSTILE_SITE_KEY = '0x4AAAAAAFnA68fmZ_NOQoMb';
/** Keep in step with expectedAction in apps/api/src/auth/auth.ts. */
const TURNSTILE_ACTION = 'auth';

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      action: string;
      size: 'flexible';
      callback: (token: string) => void;
      'expired-callback': () => void;
      'error-callback': () => void;
    },
  ) => string | undefined;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let loader: Promise<TurnstileApi> | undefined;

/** Loads Cloudflare's script once per page; a failed load is retried on the next mount. */
const loadTurnstile = () => {
  loader ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.onload = () =>
      window.turnstile ? resolve(window.turnstile) : reject(new Error('Turnstile missing'));
    script.onerror = () => {
      loader = undefined;
      script.remove();
      reject(new Error('Turnstile failed to load'));
    };
    document.head.append(script);
  });
  return loader;
};

/**
 * Renders the Turnstile widget into `ref` and holds its token. Send the token as the
 * x-captcha-response header, then call reset(): each token is accepted once.
 */
export const useTurnstile = () => {
  const ref = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>(undefined);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    loadTurnstile()
      .then((turnstile) => {
        if (!active || !ref.current) return;
        widgetId.current = turnstile.render(ref.current, {
          sitekey: TURNSTILE_SITE_KEY,
          action: TURNSTILE_ACTION,
          size: 'flexible',
          callback: setToken,
          'expired-callback': () => setToken(null),
          'error-callback': () => setToken(null),
        });
      })
      .catch(() => {
        // No widget means no token; submitting then asks the person to reload.
      });
    return () => {
      active = false;
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
      widgetId.current = undefined;
    };
  }, []);

  const reset = () => {
    setToken(null);
    if (widgetId.current) window.turnstile?.reset(widgetId.current);
  };

  return { ref, token, reset };
};

/** Shown when a form is submitted before the widget has issued a token. */
export const TURNSTILE_PENDING =
  'Finish the security check above the button. If it doesn’t appear, reload the page.';
