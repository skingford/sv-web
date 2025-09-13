import type {
	ICache,
	EnhancedCacheOptions,
	CacheStats,
	CacheMetadata,
	MemoizeOptions,
	BatchSetItem,
	WarmupItem
} from './types';
import type { CacheOptions } from './client_cache';

/**
 * 增强的缓存工具类
 */
export class EnhancedCacheUtils {
	private cache: ICache;
	private stats = {
		hits: 0,
		misses: 0,
		lastCleanup: new Date()
	};

	constructor(cache: ICache) {
		this.cache = cache;
	}

	/**
	 * 带自动清理的缓存设置
	 */
	setWithCleanup<T>(key: string, data: T, options: EnhancedCacheOptions = {}): void {
		try {
			// 检查缓存大小限制
			if (options.maxSize) {
				this.enforceMaxSize(options.maxSize);
			}

			// 执行清理
			this.cache.cleanup();

			// 设置缓存
			this.cache.set(key, data, options);
		} catch (error) {
			console.error(`Failed to set cache item "${key}":`, error);
			throw error;
		}
	}

	/**
	 * 获取或设置模式 - 支持过期后重新验证
	 */
	async getOrSet<T>(
		key: string,
		fetcher: () => Promise<T> | T,
		options: EnhancedCacheOptions = {}
	): Promise<T> {
		try {
			const cached = this.cache.get<T>(key, options);

			if (cached !== null) {
				this.stats.hits++;
				return cached;
			}

			this.stats.misses++;

			// 检查是否支持过期后重新验证
			if (options.staleWhileRevalidate) {
				const metadata = this.cache.getMetadata(key, options);
				if (metadata && !metadata.isExpired) {
					// 数据未过期，直接返回
					this.stats.hits++;
					return cached!;
				} else if (metadata && options.staleWhileRevalidate > 0) {
					// 数据过期但在重新验证窗口内
					const staleAge = Date.now() - metadata.expiresAt.getTime();
					if (staleAge <= options.staleWhileRevalidate) {
						this.stats.hits++;
						// 异步重新获取数据
						this.refreshInBackground(key, fetcher, options);
						return cached!;
					}
				}
			}

			// 获取新数据
			const freshData = await this.safeExecute(fetcher);
			this.cache.set(key, freshData, options);
			return freshData;
		} catch (error) {
			console.error(`Failed to get or set cache item "${key}":`, error);
			throw error;
		}
	}

	/**
	 * 增强的 memoize 函数
	 */
	memoize<TArgs extends any[], TReturn>(
		fn: (...args: TArgs) => Promise<TReturn> | TReturn,
		options: EnhancedCacheOptions & MemoizeOptions = {}
	) {
		const { keyGenerator, maxConcurrent = 10, onError, ...cacheOptions } = options;

		// 并发控制
		const pendingPromises = new Map<string, Promise<TReturn>>();

		return async (...args: TArgs): Promise<TReturn> => {
			const key = keyGenerator ? keyGenerator(...args) : this.generateKey(args);

			try {
				// 检查是否有正在进行的相同请求
				if (pendingPromises.has(key)) {
					return await pendingPromises.get(key)!;
				}

				// 检查缓存
				const cached = this.cache.get<TReturn>(key, cacheOptions);
				if (cached !== null) {
					this.stats.hits++;
					return cached;
				}

				this.stats.misses++;

				// 检查并发限制
				if (pendingPromises.size >= maxConcurrent) {
					throw new Error(`Maximum concurrent executions (${maxConcurrent}) exceeded`);
				}

				// 创建新的执行承诺
				const promise = this.safeExecute(() => fn(...args));
				pendingPromises.set(key, promise);

				try {
					const result = await promise;
					this.cache.set(key, result, cacheOptions);
					return result;
				} finally {
					pendingPromises.delete(key);
				}
			} catch (error) {
				if (onError) {
					onError(error as Error, args);
				}
				throw error;
			}
		};
	}

	/**
	 * 批量获取缓存项
	 */
	async batchGet<T>(
		keys: string[],
		options: EnhancedCacheOptions = {}
	): Promise<Map<string, T | null>> {
		const results = new Map<string, T | null>();

		for (const key of keys) {
			try {
				const value = this.cache.get<T>(key, options);
				results.set(key, value);
			} catch (error) {
				console.error(`Failed to get cache item "${key}":`, error);
				results.set(key, null);
			}
		}

		return results;
	}

	/**
	 * 批量设置缓存项
	 */
	batchSet<T>(items: BatchSetItem<T>[]): void {
		for (const { key, data, options = {} } of items) {
			try {
				this.setWithCleanup(key, data, options);
			} catch (error) {
				console.error(`Failed to set cache item "${key}":`, error);
			}
		}
	}

	/**
	 * 缓存预热
	 */
	async warmup<T>(items: WarmupItem<T>[]): Promise<void> {
		const promises = items.map(async ({ key, fetcher, options = {} }) => {
			try {
				await this.getOrSet(key, fetcher, options);
			} catch (error) {
				console.error(`Failed to warmup cache item "${key}":`, error);
			}
		});

		await Promise.allSettled(promises);
	}

	/**
	 * 获取增强的缓存统计信息
	 */
	getStats(options: Pick<CacheOptions, 'storage'> = {}): CacheStats {
		const basicStats = this.cache.getStats(options);
		const totalRequests = this.stats.hits + this.stats.misses;

		return {
			...basicStats,
			hitRate: totalRequests > 0 ? this.stats.hits / totalRequests : 0,
			missRate: totalRequests > 0 ? this.stats.misses / totalRequests : 0,
			lastCleanup: this.stats.lastCleanup
		};
	}

	/**
	 * 清理过期项并更新统计
	 */
	cleanup(options: Pick<CacheOptions, 'storage'> = {}): number {
		const cleanedCount = this.cache.cleanup(options);
		this.stats.lastCleanup = new Date();
		return cleanedCount;
	}

	// 私有方法

	private generateKey(args: any[]): string {
		try {
			return JSON.stringify(args);
		} catch (error) {
			// 如果 JSON.stringify 失败，使用简单的字符串表示
			return args.map((arg) => String(arg)).join('_');
		}
	}

	private async safeExecute<T>(fn: () => Promise<T> | T): Promise<T> {
		try {
			return await fn();
		} catch (error) {
			console.error('Cache operation failed:', error);
			throw error;
		}
	}

	private async refreshInBackground<T>(
		key: string,
		fetcher: () => Promise<T> | T,
		options: EnhancedCacheOptions
	): Promise<void> {
		try {
			const freshData = await this.safeExecute(fetcher);
			this.cache.set(key, freshData, options);
		} catch (error) {
			console.error(`Background refresh failed for key "${key}":`, error);
		}
	}

	private enforceMaxSize(maxSize: number): void {
		const stats = this.cache.getStats();
		if (stats.totalItems >= maxSize) {
			// 简单的 LRU 实现：清理最旧的项
			this.cache.cleanup();
		}
	}
}
