import { apiRequest } from '../api/client.js';

let accessToken = null;
let pendingRefresh = null;

const REFRESH_LOCK = 'node-blog.refresh';

export function getAccessToken() {
	return accessToken;
}

export function setAccessToken(value) {
	accessToken = value;
}

function requestNewToken() {
	return navigator.locks.request(REFRESH_LOCK, async () => {
		const { data } = await apiRequest('/api/v1/auth/refresh', {
			method: 'POST',
		});

		setAccessToken(data.access_token);

		return data;
	});
}

export function refreshSession() {
	if (pendingRefresh === null) {
		pendingRefresh = requestNewToken().finally(() => {
			pendingRefresh = null;
		});
	}

	return pendingRefresh;
}
