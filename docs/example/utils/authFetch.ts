let accessToken: string | null = null;

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/`;
}

export async function authFetch(input: RequestInfo, init: RequestInit = {}) {
  if (!accessToken) {
    accessToken = getCookie('access_token');
  }
  init.headers = {
    ...(init.headers || {}),
    Authorization: accessToken ? `Bearer ${accessToken}` : ''
  };
  let res = await fetch(input, init);
  if (res.status === 401) {
    const r = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: getCookie('refresh_token') })
    });
    if (r.ok) {
      const d = await r.json();
      accessToken = d.access_token;
      setCookie('access_token', accessToken);
      init.headers = {
        ...(init.headers || {}),
        Authorization: `Bearer ${accessToken}`
      };
      res = await fetch(input, init);
    }
  }
  return res;
}
