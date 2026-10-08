import { apiRequest } from '../api/client.js';

let accessToken = null;
let pendingRefresh = null;

export function getAccessToken() {
	return accessToken;
}

export function setAccessToken(value) {
	accessToken = value;
}

async function requestNewToken() {
	const { data } = await apiRequest('/api/v1/auth/refresh', {
		method: 'POST',
	});

	setAccessToken(data.access_token);

	return data;
}

export function refreshSession() {
	if (pendingRefresh === null) {
		pendingRefresh = requestNewToken().finally(() => {
			pendingRefresh = null;
		});
	}

	return pendingRefresh;
}
