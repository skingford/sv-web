import { browser } from '$app/environment';
import { ServerCache } from './server_cache';
import { LocalCache } from './client_cache';
import { EnhancedCacheUtils } from './enhanced_cache';
import { browserCleanup } from './browser_cleanup';

// 导出类型
export type {
	ICache,
	EnhancedCacheOptions,
	CacheStats,
	CacheMetadata,
	MemoizeOptions,
	BatchSetItem,
	WarmupItem,
	CacheItem,
	CacheOptions,
	ServerCacheItem
} from './types';

// 导出类
export { EnhancedCacheUtils } from './enhanced_cache';

// 导出函数
export { cacheUtils } from './cache_utils';

/**
 * Create cache instance based on environment
 */
export function createCache(encryptionKey?: string, defaultStorage?: Storage) {
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
export const localCache = createCache();
export const sessionCache = browser ? createCache(undefined, sessionStorage) : createCache();

// 创建增强的缓存实例
export const enhancedLocalCache = new EnhancedCacheUtils(localCache);
export const enhancedSessionCache = new EnhancedCacheUtils(sessionCache);

// 导出浏览器清理功能（带缓存实例参数）
export const cleanup = () => browserCleanup(localCache, sessionCache);
