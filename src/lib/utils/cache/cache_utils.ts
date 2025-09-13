import type { ICache, EnhancedCacheOptions } from './types';
import { EnhancedCacheUtils } from './enhanced_cache';

/**
 * 向后兼容的缓存工具函数
 */
export function cacheUtils(cache: ICache) {
	const enhancedUtils = new EnhancedCacheUtils(cache);

	return {
		setWithCleanup: enhancedUtils.setWithCleanup.bind(enhancedUtils),
		getOrSet: enhancedUtils.getOrSet.bind(enhancedUtils),
		memoize: enhancedUtils.memoize.bind(enhancedUtils),
		batchGet: enhancedUtils.batchGet.bind(enhancedUtils),
		batchSet: enhancedUtils.batchSet.bind(enhancedUtils),
		warmup: enhancedUtils.warmup.bind(enhancedUtils),
		getStats: enhancedUtils.getStats.bind(enhancedUtils),
		cleanup: enhancedUtils.cleanup.bind(enhancedUtils),

		/**
		 * 缓存装饰器 - 修复了类型问题
		 */
		cached(options: EnhancedCacheOptions & { keyPrefix?: string } = {}) {
			return function <T extends (...args: any[]) => any>(
				target: any,
				propertyKey: string | symbol,
				descriptor: TypedPropertyDescriptor<T>
			): TypedPropertyDescriptor<T> | void {
				if (!descriptor || typeof descriptor.value !== 'function') {
					return;
				}

				const originalMethod = descriptor.value;
				const keyPrefix = options.keyPrefix || `${target.constructor.name}_${String(propertyKey)}`;

				descriptor.value = async function (this: any, ...args: any[]) {
					const key = `${keyPrefix}_${JSON.stringify(args)}`;
					return enhancedUtils.getOrSet(key, () => originalMethod.apply(this, args), options);
				} as T;

				return descriptor;
			};
		}
	};
}
