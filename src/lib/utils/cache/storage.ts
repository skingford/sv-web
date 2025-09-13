/**
 * Local Caching Tool with Automatic Expiration and Encryption
 * Features:
 * - Automatic expiration time management
 * - Automatic data encryption during storage
 * - Automatic decryption during reading
 * - Support for different storage backends (localStorage, sessionStorage)
 */
import type { CacheOptions, CacheItem } from './local_cache';
import { LocalCache } from './local_cache';

// Create default cache instances
export const cache = new LocalCache();
export const sessionCache = new LocalCache(undefined, sessionStorage);

// Utility functions for common cache operations
const cacheUtils = {
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

function autoCleanup() {
	// Auto cleanup on page load/unload
	if (typeof window !== 'undefined') {
		let cleanupInterval: NodeJS.Timeout | null = null;

		// Cleanup expired items on page load
		window.addEventListener('load', () => {
			cache.cleanup();
			sessionCache.cleanup();
		});

		// Optional: Periodic cleanup every 5 minutes
		cleanupInterval = setInterval(
			() => {
				cache.cleanup();
				sessionCache.cleanup();
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
				sessionCache.cleanup();
			}
		});
	}
}

autoCleanup();

// Export the class for custom instances
export { LocalCache, cacheUtils };
