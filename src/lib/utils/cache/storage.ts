/**
 * Local Caching Tool with Automatic Expiration and Encryption
 * Features:
 * - Automatic expiration time management
 * - Automatic data encryption during storage
 * - Automatic decryption during reading
 * - Support for different storage backends (localStorage, sessionStorage)
 */

interface CacheItem<T = any> {
	data: string; // encrypted data
	expiresAt: number;
	createdAt: number;
}

interface CacheOptions {
	ttl?: number; // Time to live in milliseconds
	encrypt?: boolean; // Whether to encrypt the data (default: true)
	storage?: Storage; // Storage backend (default: localStorage)
}

class LocalCache {
	private defaultTTL: number = 24 * 60 * 60 * 1000; // 24 hours
	private encryptionKey: string;
	private storage: Storage;

	constructor(encryptionKey?: string, defaultStorage: Storage = localStorage) {
		this.encryptionKey = encryptionKey || this.generateEncryptionKey();
		this.storage = defaultStorage;
	}

	/**
	 * Generate a simple encryption key if none provided
	 */
	private generateEncryptionKey(): string {
		return btoa(
			Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
		);
	}

	/**
	 * Simple XOR encryption/decryption
	 */
	private encrypt(data: string): string {
		let result = '';
		for (let i = 0; i < data.length; i++) {
			result += String.fromCharCode(
				data.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length)
			);
		}
		return btoa(result);
	}

	private decrypt(encryptedData: string): string {
		try {
			const data = atob(encryptedData);
			let result = '';
			for (let i = 0; i < data.length; i++) {
				result += String.fromCharCode(
					data.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length)
				);
			}
			return result;
		} catch (error) {
			throw new Error('Failed to decrypt data');
		}
	}

	/**
	 * Check if an item has expired
	 */
	private isExpired(item: CacheItem): boolean {
		return Date.now() > item.expiresAt;
	}

	/**
	 * Generate cache key with prefix
	 */
	private getCacheKey(key: string): string {
		return `cache_${key}`;
	}

	/**
	 * Set data in cache with optional TTL and encryption
	 */
	set<T>(key: string, data: T, options: CacheOptions = {}): void {
		const { ttl = this.defaultTTL, encrypt = true, storage = this.storage } = options;

		try {
			const serializedData = JSON.stringify(data);
			const finalData = encrypt ? this.encrypt(serializedData) : serializedData;

			const now = Date.now();
			const cacheItem: CacheItem<T> = {
				data: finalData,
				expiresAt: now + ttl,
				createdAt: now
			};

			storage.setItem(this.getCacheKey(key), JSON.stringify(cacheItem));
		} catch (error) {
			console.error('Failed to set cache item:', error);
			throw new Error(`Failed to cache data for key: ${key}`);
		}
	} /**
 
  * Get data from cache with automatic decryption and expiration check
   */
	get<T>(key: string, options: Omit<CacheOptions, 'ttl'> = {}): T | null {
		const { encrypt = true, storage = this.storage } = options;

		try {
			const cacheKey = this.getCacheKey(key);
			const cachedItem = storage.getItem(cacheKey);

			if (!cachedItem) {
				return null;
			}

			const parsedItem: CacheItem<T> = JSON.parse(cachedItem);

			// Check if expired
			if (this.isExpired(parsedItem)) {
				this.delete(key, { storage });
				return null;
			}

			// Decrypt and parse data
			const rawData = encrypt ? this.decrypt(parsedItem.data) : parsedItem.data;
			return JSON.parse(rawData);
		} catch (error) {
			console.error('Failed to get cache item:', error);
			// Clean up corrupted cache item
			this.delete(key, { storage });
			return null;
		}
	}

	/**
	 * Delete a specific cache item
	 */
	delete(key: string, options: Pick<CacheOptions, 'storage'> = {}): void {
		const { storage = this.storage } = options;
		storage.removeItem(this.getCacheKey(key));
	}

	/**
	 * Check if a cache item exists and is not expired
	 */
	has(key: string, options: Pick<CacheOptions, 'storage'> = {}): boolean {
		return this.get(key, options) !== null;
	}

	/**
	 * Get cache item metadata (creation time, expiration time)
	 */
	getMetadata(
		key: string,
		options: Pick<CacheOptions, 'storage'> = {}
	): {
		createdAt: Date;
		expiresAt: Date;
		isExpired: boolean;
	} | null {
		const { storage = this.storage } = options;

		try {
			const cacheKey = this.getCacheKey(key);
			const cachedItem = storage.getItem(cacheKey);

			if (!cachedItem) {
				return null;
			}

			const parsedItem: CacheItem = JSON.parse(cachedItem);

			return {
				createdAt: new Date(parsedItem.createdAt),
				expiresAt: new Date(parsedItem.expiresAt),
				isExpired: this.isExpired(parsedItem)
			};
		} catch (error) {
			return null;
		}
	}

	/**
	 * Clear all cache items (with optional prefix filtering)
	 */
	clear(options: Pick<CacheOptions, 'storage'> = {}): void {
		const { storage = this.storage } = options;

		const keysToRemove: string[] = [];

		for (let i = 0; i < storage.length; i++) {
			const key = storage.key(i);
			if (key && key.startsWith('cache_')) {
				keysToRemove.push(key);
			}
		}

		keysToRemove.forEach((key) => storage.removeItem(key));
	}

	/**
	 * Clean up expired cache items
	 */
	cleanup(options: Pick<CacheOptions, 'storage'> = {}): number {
		const { storage = this.storage } = options;
		let cleanedCount = 0;

		const keysToCheck: string[] = [];

		for (let i = 0; i < storage.length; i++) {
			const key = storage.key(i);
			if (key && key.startsWith('cache_')) {
				keysToCheck.push(key);
			}
		}

		keysToCheck.forEach((cacheKey) => {
			try {
				const cachedItem = storage.getItem(cacheKey);
				if (cachedItem) {
					const parsedItem: CacheItem = JSON.parse(cachedItem);
					if (this.isExpired(parsedItem)) {
						storage.removeItem(cacheKey);
						cleanedCount++;
					}
				}
			} catch (error) {
				// Remove corrupted items
				storage.removeItem(cacheKey);
				cleanedCount++;
			}
		});

		return cleanedCount;
	}

	/**
	 * Get cache statistics
	 */
	getStats(options: Pick<CacheOptions, 'storage'> = {}): {
		totalItems: number;
		expiredItems: number;
		totalSize: number; // approximate size in characters
	} {
		const { storage = this.storage } = options;

		let totalItems = 0;
		let expiredItems = 0;
		let totalSize = 0;

		for (let i = 0; i < storage.length; i++) {
			const key = storage.key(i);
			if (key && key.startsWith('cache_')) {
				totalItems++;
				const item = storage.getItem(key);
				if (item) {
					totalSize += item.length;
					try {
						const parsedItem: CacheItem = JSON.parse(item);
						if (this.isExpired(parsedItem)) {
							expiredItems++;
						}
					} catch (error) {
						expiredItems++; // Count corrupted items as expired
					}
				}
			}
		}

		return { totalItems, expiredItems, totalSize };
	}
}

// Create default cache instances
export const cache = new LocalCache();
export const sessionCache = new LocalCache(undefined, sessionStorage);

// Export the class for custom instances
export { LocalCache };

// Utility functions for common cache operations
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

// Auto cleanup on page load/unload
if (typeof window !== 'undefined') {
	// Cleanup expired items on page load
	window.addEventListener('load', () => {
		cache.cleanup();
		sessionCache.cleanup();
	});

	// Optional: Periodic cleanup every 5 minutes
	setInterval(
		() => {
			cache.cleanup();
			sessionCache.cleanup();
		},
		5 * 60 * 1000
	);
}

// Export types for TypeScript users
export type { CacheOptions, CacheItem };
