/**
 * Server-side cache implementation using Map
 * This is a simple in-memory cache for server-side rendering
 */

interface ServerCacheItem {
	data: any;
	expiresAt: number;
	createdAt: number;
}

export class ServerCache {
	private cache = new Map<string, ServerCacheItem>();
	private defaultTTL: number = 24 * 60 * 60 * 1000; // 24 hours

	constructor(defaultTTL?: number) {
		if (defaultTTL) {
			this.defaultTTL = defaultTTL;
		}
	}

	/**
	 * Set data in server cache
	 */
	set<T>(key: string, data: T, options: { ttl?: number } = {}): void {
		const ttl = options.ttl || this.defaultTTL;
		const now = Date.now();

		this.cache.set(key, {
			data,
			expiresAt: now + ttl,
			createdAt: now
		});
	}

	/**
	 * Get data from server cache
	 */
	get<T>(key: string): T | null {
		const item = this.cache.get(key);

		if (!item) {
			return null;
		}

		// Check if expired
		if (Date.now() > item.expiresAt) {
			this.cache.delete(key);
			return null;
		}

		return item.data as T;
	}

	/**
	 * Check if cache item exists and is not expired
	 */
	has(key: string): boolean {
		return this.get(key) !== null;
	}

	/**
	 * Delete a specific cache item
	 */
	delete(key: string): void {
		this.cache.delete(key);
	}

	/**
	 * Clear all cache items
	 */
	clear(): void {
		this.cache.clear();
	}

	/**
	 * Clean up expired cache items
	 */
	cleanup(): number {
		let cleanedCount = 0;
		const now = Date.now();

		for (const [key, item] of this.cache.entries()) {
			if (now > item.expiresAt) {
				this.cache.delete(key);
				cleanedCount++;
			}
		}

		return cleanedCount;
	}

	/**
	 * Get cache statistics
	 */
	getStats(): {
		totalItems: number;
		expiredItems: number;
		totalSize: number;
	} {
		let totalItems = 0;
		let expiredItems = 0;
		let totalSize = 0;
		const now = Date.now();

		for (const [key, item] of this.cache.entries()) {
			totalItems++;
			totalSize += JSON.stringify(item).length;

			if (now > item.expiresAt) {
				expiredItems++;
			}
		}

		return { totalItems, expiredItems, totalSize };
	}

	/**
	 * Get cache item metadata
	 */
	getMetadata(key: string): {
		createdAt: Date;
		expiresAt: Date;
		isExpired: boolean;
	} | null {
		const item = this.cache.get(key);

		if (!item) {
			return null;
		}

		const now = Date.now();
		return {
			createdAt: new Date(item.createdAt),
			expiresAt: new Date(item.expiresAt),
			isExpired: now > item.expiresAt
		};
	}
}

// Create global server cache instance
export const serverCache = new ServerCache();
