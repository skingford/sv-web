/**
 * Cache Factory - Creates appropriate cache instance based on environment
 */

import { browser } from '$app/environment';
import { LocalCache } from './local_cache';
import { ServerCache } from './server_cache';
import type { CacheOptions } from './local_cache';

// Cache interface that both implementations must follow
export interface ICache {
	set<T>(key: string, data: T, options?: CacheOptions): void;
	get<T>(key: string, options?: Omit<CacheOptions, 'ttl'>): T | null;
	has(key: string, options?: Pick<CacheOptions, 'storage'>): boolean;
	delete(key: string, options?: Pick<CacheOptions, 'storage'>): void;
	clear(options?: Pick<CacheOptions, 'storage'>): void;
	cleanup(options?: Pick<CacheOptions, 'storage'>): number;
	getStats(options?: Pick<CacheOptions, 'storage'>): {
		totalItems: number;
		expiredItems: number;
		totalSize: number;
	};
	getMetadata(
		key: string,
		options?: Pick<CacheOptions, 'storage'>
	): {
		createdAt: Date;
		expiresAt: Date;
		isExpired: boolean;
	} | null;
}

/**
 * Create cache instance based on environment
 */
export function createCache(encryptionKey?: string, defaultStorage?: Storage): ICache {
	if (browser) {
		// Client-side: use LocalCache with localStorage/sessionStorage
		return new LocalCache(encryptionKey, defaultStorage);
	} else {
		// Server-side: use ServerCache with in-memory Map
		return new ServerCache();
	}
}

/**
 * Create cache instances for different use cases
 */
export const cache = createCache();
export const sessionCache = browser ? createCache(undefined, sessionStorage) : createCache();

/**
 * Utility functions that work with both server and client cache
 */
export const cacheUtils = {
	/**
	 * Cache with automatic cleanup on set
	 */
	setWithCleanup<T>(key: string, data: T, options: CacheOptions = {}): void {
		cache.cleanup();
		cache.set(key, data, options);
	},

	/**
	 * Get or set pattern - returns cached data or sets new data if not found
	 */
	async getOrSet<T>(
		key: string,
		fetcher: () => Promise<T> | T,
		options: CacheOptions = {}
	): Promise<T> {
		const cached = cache.get<T>(key, options);
		if (cached !== null) {
			return cached;
		}

		const freshData = await fetcher();
		cache.set(key, freshData, options);
		return freshData;
	},

	/**
	 * Memoize function with cache
	 */
	memoize<TArgs extends any[], TReturn>(
		fn: (...args: TArgs) => Promise<TReturn> | TReturn,
		keyGenerator?: (...args: TArgs) => string,
		options: CacheOptions = {}
	) {
		return async (...args: TArgs): Promise<TReturn> => {
			const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
			return cacheUtils.getOrSet(key, () => fn(...args), options);
		};
	},

	/**
	 * Cache decorator for class methods
	 */
	cached(options: CacheOptions & { keyPrefix?: string } = {}) {
		return function <T>(
			target: any,
			propertyKey: string | symbol,
			descriptor: TypedPropertyDescriptor<T>
		): TypedPropertyDescriptor<T> | void {
			if (!descriptor || typeof descriptor.value !== 'function') {
				return;
			}

			const originalMethod = descriptor.value as any;
			const keyPrefix = options.keyPrefix || `${target.constructor.name}_${String(propertyKey)}`;

			descriptor.value = async function (this: any, ...args: any[]) {
				const key = `${keyPrefix}_${JSON.stringify(args)}`;
				return cacheUtils.getOrSet(key, () => originalMethod.apply(this, args), options);
			} as any;

			return descriptor;
		};
	}
};

// Auto cleanup on page load/unload (client-side only)
if (browser) {
	let cleanupInterval: NodeJS.Timeout | null = null;

	// Cleanup expired items on page load
	window.addEventListener('load', () => {
		cache.cleanup();
		if (sessionCache !== cache) {
			sessionCache.cleanup();
		}
	});

	// Optional: Periodic cleanup every 5 minutes
	cleanupInterval = setInterval(
		() => {
			cache.cleanup();
			if (sessionCache !== cache) {
				sessionCache.cleanup();
			}
		},
		5 * 60 * 1000
	);

	// Cleanup interval on page unload to prevent memory leaks
	window.addEventListener('beforeunload', () => {
		if (cleanupInterval) {
			clearInterval(cleanupInterval);
			cleanupInterval = null;
		}
	});

	// Also cleanup when page becomes hidden (mobile browsers)
	document.addEventListener('visibilitychange', () => {
		if (document.visibilityState === 'hidden') {
			cache.cleanup();
			if (sessionCache !== cache) {
				sessionCache.cleanup();
			}
		}
	});
}

// Export types and classes
export { LocalCache, ServerCache };
export type { CacheOptions, CacheItem } from './local_cache';
