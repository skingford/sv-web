import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import type { User } from '$lib/auth';
import { isUserLoggedIn, getCurrentUser, clearAuthCache } from '$lib/auth';

// Create a writable store for the current user
export const user = writable<User | null>(null);

// Create a derived store for authentication status
export const isAuthenticated = derived(user, ($user) => !!$user);

/**
 * Initialize auth store from cache
 */
export function initAuthFromCache(): void {
	if (!browser) return;

	const cachedUser = getCurrentUser();
	user.set(cachedUser);
}

/**
 * Initialize auth store from page data
 */
export function initAuth(userData: User | null) {
	user.set(userData);
}

/**
 * Clear auth store (for logout)
 */
export function clearAuth() {
	user.set(null);
	clearAuthCache();
}

/**
 * Client-side logout function
 */
export async function logout() {
	if (browser) {
		// Navigate to logout endpoint
		window.location.href = '/logout';
	}
}
