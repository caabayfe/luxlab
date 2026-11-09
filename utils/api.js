import {aiuxFetch} from '@servicenow/aiux/aiux-components-core';

// LuxLab scripted REST APIs; the same endpoints back the React cockpit
const BASE_URL = '/api/x_everi_luxlab/v1';

// Platform errors use { error }, while errors set by our routes arrive wrapped in { result }
function errorMessage(body) {
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return '';
    }
  }
  return body?.error?.message || body?.result?.error?.message || '';
}

// aiuxFetch carries the session on the server (SSR loaders) and adds the XSRF token in the browser
export async function api(path, {method = 'GET', body} = {}) {
  let response;
  try {
    response = await aiuxFetch(`${BASE_URL}${path}`, {
      method,
      headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
      body: body ? JSON.stringify(body) : undefined
    });
  } catch (error) {
    // In the browser a 4xx/5xx throws before we see the response; the parsed body rides on the error
    const message = errorMessage(error?.response?.data);
    throw message ? new Error(message) : error;
  }
  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(errorMessage(json) || `HTTP error ${response.status}`);
  }
  return json.result;
}

export function recordUrl(table, sysId) {
  return `/${table}.do?sys_id=${sysId}`;
}
