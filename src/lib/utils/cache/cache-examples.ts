/**
 * Examples of using the Local Caching Tool
 */

import { cache, sessionCache, LocalCache, cacheUtils } from './storage';
import type { CacheOptions } from './local_cache';

// Example 1: Basic usage with automatic expiration
export function basicCacheExample() {
	// Set data with 1 hour expiration
	cache.set(
		'user-profile',
		{ id: 1, name: 'John Doe', email: 'john@example.com' },
		{
			ttl: 60 * 60 * 1000 // 1 hour
		}
	);

	// Get data (automatically decrypted)
	const userProfile = cache.get('user-profile');
	console.log('User Profile:', userProfile);

	// Check if data exists
	if (cache.has('user-profile')) {
		console.log('User profile is cached and valid');
	}
}

// Example 2: Using session storage
export function sessionCacheExample() {
	// Store temporary data in session storage
	sessionCache.set(
		'temp-form-data',
		{
			step: 2,
			formData: { name: 'Jane', age: 25 }
		},
		{
			ttl: 30 * 60 * 1000 // 30 minutes
		}
	);

	const formData = sessionCache.get('temp-form-data');
	console.log('Form Data:', formData);
}

// Example 3: Custom cache instance with custom encryption
export function customCacheExample() {
	const customCache = new LocalCache('my-secret-key-123');

	customCache.set(
		'sensitive-data',
		{
			apiKey: 'secret-api-key',
			token: 'jwt-token-here'
		},
		{
			ttl: 15 * 60 * 1000, // 15 minutes
			encrypt: true
		}
	);

	const sensitiveData = customCache.get('sensitive-data');
	console.log('Sensitive Data:', sensitiveData);
}

// Example 4: Get or Set pattern
export async function getOrSetExample() {
	const userData = await cacheUtils.getOrSet(
		'user-data-123',
		async () => {
			// This function only runs if data is not cached or expired
			console.log('Fetching fresh data from API...');
			const response = await fetch('/api/user/123');
			return response.json();
		},
		{
			ttl: 2 * 60 * 60 * 1000 // 2 hours
		}
	);

	console.log('User Data:', userData);
}

// Example 5: Memoized function
export const memoizedApiCall = cacheUtils.memoize(
	async (userId: string, includeProfile: boolean) => {
		console.log(`Fetching data for user ${userId}...`);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));
		return {
			id: userId,
			name: `User ${userId}`,
			profile: includeProfile ? { bio: 'User bio' } : null
		};
	},
	(userId, includeProfile) => `user-${userId}-${includeProfile}`,
	{
		ttl: 10 * 60 * 1000 // 10 minutes
	}
);

// Example 6: Class with cached methods (using manual caching approach)
export class UserService {
	// Cached method using manual approach
	async getUser(id: string) {
		return cacheUtils.getOrSet(
			`UserService_getUser_${id}`,
			async () => {
				console.log(`Fetching user ${id} from database...`);
				// Simulate database call
				await new Promise((resolve) => setTimeout(resolve, 500));
				return {
					id,
					name: `User ${id}`,
					email: `user${id}@example.com`
				};
			},
			{
				ttl: 30 * 60 * 1000 // 30 minutes
			}
		);
	}

	// Cached method using manual approach
	async getUserPosts(userId: string, limit: number = 10) {
		return cacheUtils.getOrSet(
			`UserService_getUserPosts_${userId}_${limit}`,
			async () => {
				console.log(`Fetching posts for user ${userId}...`);
				// Simulate API call
				await new Promise((resolve) => setTimeout(resolve, 800));
				return Array.from({ length: limit }, (_, i) => ({
					id: i + 1,
					title: `Post ${i + 1} by User ${userId}`,
					content: `Content of post ${i + 1}`
				}));
			},
			{
				ttl: 60 * 60 * 1000 // 1 hour
			}
		);
	}
}

// Example 7: Cache management
export function cacheManagementExample() {
	// Get cache statistics
	const stats = cache.getStats();
	console.log('Cache Stats:', stats);

	// Get metadata for a specific item
	const metadata = cache.getMetadata('user-profile');
	if (metadata) {
		console.log('Cache Metadata:', {
			createdAt: metadata.createdAt,
			expiresAt: metadata.expiresAt,
			isExpired: metadata.isExpired
		});
	}

	// Manual cleanup of expired items
	const cleanedCount = cache.cleanup();
	console.log(`Cleaned up ${cleanedCount} expired items`);

	// Clear all cache items
	// cache.clear(); // Uncomment to clear all cache
}

// Example 8: Different TTL strategies
export function ttlStrategiesExample() {
	// Short-lived cache (5 minutes)
	cache.set(
		'quick-data',
		{ temp: true },
		{
			ttl: 5 * 60 * 1000
		}
	);

	// Medium-lived cache (1 hour)
	cache.set(
		'medium-data',
		{ important: true },
		{
			ttl: 60 * 60 * 1000
		}
	);

	// Long-lived cache (24 hours)
	cache.set(
		'persistent-data',
		{ config: 'settings' },
		{
			ttl: 24 * 60 * 60 * 1000
		}
	);

	// No encryption for non-sensitive data
	cache.set(
		'public-data',
		{ publicInfo: true },
		{
			ttl: 30 * 60 * 1000,
			encrypt: false
		}
	);
}

// Example usage in a Svelte component context
export function svelteComponentExample() {
	return {
		// Cache user preferences
		saveUserPreferences: (preferences: any) => {
			cache.set('user-preferences', preferences, {
				ttl: 7 * 24 * 60 * 60 * 1000 // 7 days
			});
		},

		// Load user preferences
		loadUserPreferences: () => {
			return (
				cache.get('user-preferences') || {
					theme: 'light',
					language: 'en',
					notifications: true
				}
			);
		},

		// Cache API responses
		cacheApiResponse: async (endpoint: string, params: any) => {
			const cacheKey = `api-${endpoint}-${JSON.stringify(params)}`;
			return cacheUtils.getOrSet(
				cacheKey,
				async () => {
					const response = await fetch(`/api/${endpoint}`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(params)
					});
					return response.json();
				},
				{
					ttl: 15 * 60 * 1000 // 15 minutes
				}
			);
		}
	};
}

// Example 6b: Alternative decorator approach (if decorators are enabled in tsconfig)
export class UserServiceWithDecorator {
	// If you want to use decorators, make sure experimentalDecorators is enabled in tsconfig.json
	// and use this simpler manual wrapper approach:

	private _getUser = cacheUtils.memoize(
		async (id: string) => {
			console.log(`Fetching user ${id} from database...`);
			await new Promise((resolve) => setTimeout(resolve, 500));
			return {
				id,
				name: `User ${id}`,
				email: `user${id}@example.com`
			};
		},
		(id) => `UserService_getUser_${id}`,
		{ ttl: 30 * 60 * 1000 }
	);

	private _getUserPosts = cacheUtils.memoize(
		async (userId: string, limit: number = 10) => {
			console.log(`Fetching posts for user ${userId}...`);
			await new Promise((resolve) => setTimeout(resolve, 800));
			return Array.from({ length: limit }, (_, i) => ({
				id: i + 1,
				title: `Post ${i + 1} by User ${userId}`,
				content: `Content of post ${i + 1}`
			}));
		},
		(userId, limit) => `UserService_getUserPosts_${userId}_${limit}`,
		{ ttl: 60 * 60 * 1000 }
	);

	async getUser(id: string) {
		return this._getUser(id);
	}

	async getUserPosts(userId: string, limit: number = 10) {
		return this._getUserPosts(userId, limit);
	}
}
