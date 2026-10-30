import {aiuxFetch} from '@servicenow/aiux/aiux-components-core';

// LuxLab scripted REST APIs; the same endpoints back the React cockpit
const BASE_URL = '/api/x_everi_luxlab/v1';

// aiuxFetch carries the session on the server (SSR loaders) and adds the XSRF token in the browser
export async function api(path, {method = 'GET', body} = {}) {
  const response = await aiuxFetch(`${BASE_URL}${path}`, {
    method,
    headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
    body: body ? JSON.stringify(body) : undefined
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    // Platform errors use { error }, while errors set by our routes arrive wrapped in { result }
    throw new Error(
      json.error?.message ||
        json.result?.error?.message ||
        `HTTP error ${response.status}`
    );
  }
  return json.result;
}

export function recordUrl(table, sysId) {
  return `/${table}.do?sys_id=${sysId}`;
}
