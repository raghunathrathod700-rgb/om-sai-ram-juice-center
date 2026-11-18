/**
 * Tiny fetch wrapper for the Spring Boot backend.
 *  - adds the Bearer token, sends/reads JSON, supports FormData (photo upload)
 *  - throws ApiError with the server's {"message": "..."} text
 *  - on 401 while logged in it fires "osrjc:unauthorized" so the app can log out
 */
import { API_BASE_URL } from '../config/shop';
import { getToken } from './tokenStore';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const absoluteUrl = (path) => (!path ? '' : /^https?:/i.test(path) ? path : `${API_BASE_URL}${path}`);

const request = async (method, path, { body, form } = {}) => {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  let payload;
  if (form) payload = form;
  else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, { method, headers, body: payload });
  } catch {
    throw new ApiError('The shop server is not reachable. Please try again in a moment.', 0);
  }

  if (res.status === 204) return null;
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }
  if (!res.ok) {
    if (res.status === 401 && token && typeof window !== 'undefined') {
      window.dispatchEvent(new Event('osrjc:unauthorized'));
    }
    throw new ApiError(data?.message || `Request failed (${res.status}).`, res.status);
  }
  return data;
};

export const http = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, { body }),
  put: (path, body) => request('PUT', path, { body }),
  del: (path) => request('DELETE', path),
  upload: (path, form) => request('POST', path, { form }),
};
