// 基础缓存项接口
export interface CacheItem {
	data: string; // encrypted data
	expiresAt: number;
	createdAt: number;
	isString: boolean; // Track if original data was a string
	isEncrypted: boolean; // Track if data is encrypted
}

// 基础缓存选项接口
export interface CacheOptions {
	ttl?: number; // Time to live in seconds
	encrypt?: boolean; // Whether to encrypt the data (default: true)
	storage?: Storage; // Storage backend (default: localStorage)
}

// 服务端缓存项接口
export interface ServerCacheItem {
	data: any;
	expiresAt: number;
	createdAt: number;
}

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

// 增强的缓存选项类型
export interface EnhancedCacheOptions extends CacheOptions {
	maxAge?: number; // 最大缓存时间（秒）
	staleWhileRevalidate?: number; // 过期后仍可使用的最大时间（秒）
	maxSize?: number; // 最大缓存项数量
	serializer?: (data: any) => string; // 自定义序列化器
	deserializer?: (data: string) => any; // 自定义反序列化器
}

// 缓存统计信息
export interface CacheStats {
	totalItems: number;
	expiredItems: number;
	totalSize: number;
	hitRate: number;
	missRate: number;
	lastCleanup: Date;
}

// 缓存项元数据
export interface CacheMetadata {
	createdAt: Date;
	expiresAt: Date;
	isExpired: boolean;
	accessCount: number;
	lastAccessed: Date;
	size: number;
}

// Memoize 选项
export interface MemoizeOptions {
	keyGenerator?: (...args: any[]) => string;
	maxConcurrent?: number; // 最大并发执行数
	onError?: (error: Error, args: any[]) => void;
}

// 批量操作项
export interface BatchSetItem<T> {
	key: string;
	data: T;
	options?: EnhancedCacheOptions;
}

// 缓存预热项
export interface WarmupItem<T> {
	key: string;
	fetcher: () => Promise<T> | T;
	options?: EnhancedCacheOptions;
}
