interface CacheItem {
	data: string; // encrypted data
	expiresAt: number;
	createdAt: number;
}

interface CacheOptions {
	ttl?: number; // Time to live in milliseconds
	encrypt?: boolean; // Whether to encrypt the data (default: true)
	storage?: Storage; // Storage backend (default: localStorage)
}

export class LocalCache {
	private defaultTTL: number = 24 * 60 * 60 * 1000; // 24 hours
	private encryptionKey: string;
	private storage: Storage;

	constructor(encryptionKey?: string, defaultStorage: Storage = localStorage) {
		this.encryptionKey = encryptionKey || this.getOrCreatePersistentKey();
		this.storage = defaultStorage;
	}

	/**
	 * Get or create a persistent encryption key stored in localStorage
	 * This ensures the same key is used across sessions
	 */
	private getOrCreatePersistentKey(): string {
		const KEY_STORAGE_KEY = 'cache_encryption_key';

		try {
			// Try to get existing key
			let existingKey = this.storage.getItem(KEY_STORAGE_KEY);

			if (existingKey) {
				return existingKey;
			}

			// Generate new key if none exists
			const newKey = this.generateEncryptionKey();

			// Store the key for future use
			this.storage.setItem(KEY_STORAGE_KEY, newKey);

			return newKey;
		} catch (error) {
			console.warn('Failed to access localStorage for encryption key, using fallback');
			// Fallback to a deterministic key based on user agent and domain
			return this.generateDeterministicKey();
		}
	}

	/**
	 * Generate a simple encryption key
	 */
	private generateEncryptionKey(): string {
		return btoa(
			Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
		);
	}

	/**
	 * Generate a deterministic key based on browser characteristics
	 * This is a fallback when localStorage is not available
	 */
	private generateDeterministicKey(): string {
		const userAgent = navigator.userAgent;
		const domain = window.location.hostname;
		const combined = `${userAgent}-${domain}`;

		// Simple hash function
		let hash = 0;
		for (let i = 0; i < combined.length; i++) {
			const char = combined.charCodeAt(i);
			hash = (hash << 5) - hash + char;
			hash = hash & hash; // Convert to 32-bit integer
		}

		// Use base64 encoding with fallback for older browsers
		return this.base64Encode(Math.abs(hash).toString(36));
	}

	/**
	 * Base64 encode with fallback for older browsers
	 */
	private base64Encode(str: string): string {
		if (typeof btoa !== 'undefined') {
			return btoa(str);
		}

		// Fallback implementation for older browsers
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
		let result = '';
		let i = 0;

		while (i < str.length) {
			const a = str.charCodeAt(i++);
			const b = i < str.length ? str.charCodeAt(i++) : 0;
			const c = i < str.length ? str.charCodeAt(i++) : 0;

			const bitmap = (a << 16) | (b << 8) | c;

			result += chars.charAt((bitmap >> 18) & 63);
			result += chars.charAt((bitmap >> 12) & 63);
			result += i - 2 < str.length ? chars.charAt((bitmap >> 6) & 63) : '=';
			result += i - 1 < str.length ? chars.charAt(bitmap & 63) : '=';
		}

		return result;
	}

	/**
	 * Base64 decode with fallback for older browsers
	 */
	private base64Decode(str: string): string {
		if (typeof atob !== 'undefined') {
			return atob(str);
		}

		// Fallback implementation for older browsers
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
		let result = '';
		let i = 0;

		str = str.replace(/[^A-Za-z0-9+/]/g, '');

		while (i < str.length) {
			const encoded1 = chars.indexOf(str.charAt(i++));
			const encoded2 = chars.indexOf(str.charAt(i++));
			const encoded3 = chars.indexOf(str.charAt(i++));
			const encoded4 = chars.indexOf(str.charAt(i++));

			const bitmap = (encoded1 << 18) | (encoded2 << 12) | (encoded3 << 6) | encoded4;

			result += String.fromCharCode((bitmap >> 16) & 255);
			if (encoded3 !== 64) result += String.fromCharCode((bitmap >> 8) & 255);
			if (encoded4 !== 64) result += String.fromCharCode(bitmap & 255);
		}

		return result;
	}

	/**
	 * Simple XOR encryption/decryption
	 */
	private encrypt(data: string): string {
		// Use array for better performance
		const result: number[] = [];
		for (let i = 0; i < data.length; i++) {
			result.push(
				data.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length)
			);
		}
		return this.base64Encode(String.fromCharCode(...result));
	}

	private decrypt(encryptedData: string): string {
		try {
			const data = this.base64Decode(encryptedData);
			// Use array for better performance
			const result: number[] = [];
			for (let i = 0; i < data.length; i++) {
				result.push(
					data.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length)
				);
			}
			return String.fromCharCode(...result);
		} catch (error) {
			console.error('Decryption failed:', error);
			throw new Error(
				`Failed to decrypt data: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
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

		// Validate inputs
		if (!key || typeof key !== 'string') {
			throw new Error('Cache key must be a non-empty string');
		}

		if (ttl < 0) {
			throw new Error('TTL must be a positive number');
		}

		const serializedData = JSON.stringify(data);

		// Check storage quota before setting
		const estimatedSize = serializedData.length * 2; // Rough estimate for encrypted data
		if (estimatedSize > 5 * 1024 * 1024) {
			// 5MB limit
			console.warn(`Cache item "${key}" is very large (${estimatedSize} bytes)`);
		}

		const finalData = encrypt ? this.encrypt(serializedData) : serializedData;

		const now = Date.now();
		const cacheItem: CacheItem = {
			data: finalData,
			expiresAt: now + ttl,
			createdAt: now
		};

		try {
			storage.setItem(this.getCacheKey(key), JSON.stringify(cacheItem));
		} catch (error) {
			console.error('Failed to set cache item:', error);

			// Handle quota exceeded error specifically
			if (error instanceof DOMException && error.name === 'QuotaExceededError') {
				// Try to clean up some space and retry
				this.cleanup();
				try {
					storage.setItem(this.getCacheKey(key), JSON.stringify(cacheItem));
					console.log('Cache item set after cleanup');
					return;
				} catch (retryError) {
					throw new Error(`Storage quota exceeded for key: ${key}`);
				}
			}

			throw new Error(
				`Failed to cache data for key: ${key}. ${error instanceof Error ? error.message : 'Unknown error'}`
			);
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

			const parsedItem: CacheItem = JSON.parse(cachedItem);

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
	 * Reset encryption key and clear all encrypted data
	 * Use this when you want to change the encryption key
	 */
	resetEncryptionKey(): void {
		const KEY_STORAGE_KEY = 'cache_encryption_key';

		// Clear the old key
		this.storage.removeItem(KEY_STORAGE_KEY);

		// Clear all encrypted cache data
		this.clear();

		// Generate new key
		this.encryptionKey = this.getOrCreatePersistentKey();

		console.log('Encryption key reset successfully');
	}

	/**
	 * Get current encryption key (for debugging purposes)
	 * Note: This should not be used in production
	 */
	getCurrentKey(): string {
		return this.encryptionKey;
	}

	/**
	 * Check if encryption key exists in storage
	 */
	hasPersistentKey(): boolean {
		const KEY_STORAGE_KEY = 'cache_encryption_key';
		return this.storage.getItem(KEY_STORAGE_KEY) !== null;
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

// Export types for TypeScript users
export type { CacheOptions, CacheItem };
