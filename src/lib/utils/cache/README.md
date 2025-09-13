# Universal Cache System

一个支持服务端和客户端的通用缓存系统，自动根据环境选择合适的缓存实现。

## 特性

- ✅ **环境自适应**：服务端使用内存缓存，客户端使用 localStorage/sessionStorage
- ✅ **类型安全**：完整的 TypeScript 支持
- ✅ **自动过期**：支持 TTL（生存时间）管理
- ✅ **加密支持**：客户端数据自动加密存储
- ✅ **性能优化**：字符串数据直接存储，避免不必要的序列化
- ✅ **内存管理**：自动清理过期数据，防止内存泄漏
- ✅ **统计信息**：提供缓存使用统计和元数据

## 快速开始

```typescript
import { cache, sessionCache, cacheUtils } from '$lib/utils/cache/index';

// 基本使用
cache.set('user-data', { name: 'John', age: 30 }, { ttl: 60 * 60 * 1000 });
const userData = cache.get('user-data');

// 会话缓存
sessionCache.set('temp-data', { step: 1 }, { ttl: 30 * 60 * 1000 });

// 获取或设置模式（适合 API 调用）
const apiData = await cacheUtils.getOrSet('api-data', async () => {
	return await fetch('/api/data').then((res) => res.json());
});
```

## API 参考

### 缓存实例

#### `cache`

默认缓存实例，服务端使用内存缓存，客户端使用 localStorage。

#### `sessionCache`

会话缓存实例，服务端使用内存缓存，客户端使用 sessionStorage。

### 核心方法

#### `set<T>(key: string, data: T, options?: CacheOptions): void`

设置缓存数据。

```typescript
// 基本使用
cache.set('key', { data: 'value' });

// 带选项
cache.set(
	'key',
	{ data: 'value' },
	{
		ttl: 60 * 60 * 1000, // 1小时过期
		encrypt: true, // 加密存储（仅客户端）
		storage: localStorage // 存储后端（仅客户端）
	}
);
```

#### `get<T>(key: string, options?: Omit<CacheOptions, 'ttl'>): T | null`

获取缓存数据。

```typescript
const data = cache.get('key');
const dataWithoutEncryption = cache.get('key', { encrypt: false });
```

#### `has(key: string, options?: Pick<CacheOptions, 'storage'>): boolean`

检查缓存项是否存在且未过期。

```typescript
if (cache.has('key')) {
	console.log('数据存在且有效');
}
```

#### `delete(key: string, options?: Pick<CacheOptions, 'storage'>): void`

删除特定缓存项。

```typescript
cache.delete('key');
```

#### `clear(options?: Pick<CacheOptions, 'storage'>): void`

清空所有缓存项。

```typescript
cache.clear();
```

#### `cleanup(options?: Pick<CacheOptions, 'storage'>): number`

清理过期缓存项，返回清理的数量。

```typescript
const cleanedCount = cache.cleanup();
console.log(`清理了 ${cleanedCount} 个过期项`);
```

#### `getStats(options?: Pick<CacheOptions, 'storage'>): CacheStats`

获取缓存统计信息。

```typescript
const stats = cache.getStats();
console.log('总项数:', stats.totalItems);
console.log('过期项数:', stats.expiredItems);
console.log('总大小:', stats.totalSize);
```

#### `getMetadata(key: string, options?: Pick<CacheOptions, 'storage'>): CacheMetadata | null`

获取缓存项元数据。

```typescript
const metadata = cache.getMetadata('key');
if (metadata) {
	console.log('创建时间:', metadata.createdAt);
	console.log('过期时间:', metadata.expiresAt);
	console.log('是否过期:', metadata.isExpired);
}
```

### 工具函数

#### `cacheUtils.setWithCleanup<T>(key: string, data: T, options?: CacheOptions): void`

设置数据并自动清理过期项。

```typescript
cacheUtils.setWithCleanup('key', { data: 'value' });
```

#### `cacheUtils.getOrSet<T>(key: string, fetcher: () => Promise<T> | T, options?: CacheOptions): Promise<T>`

获取缓存数据，如果不存在则执行获取函数并缓存结果。

```typescript
const data = await cacheUtils.getOrSet(
	'api-data',
	async () => {
		const response = await fetch('/api/data');
		return response.json();
	},
	{ ttl: 10 * 60 * 1000 }
);
```

#### `cacheUtils.memoize<TArgs, TReturn>(fn: (...args: TArgs) => Promise<TReturn> | TReturn, keyGenerator?: (...args: TArgs) => string, options?: CacheOptions)`

为函数添加缓存功能。

```typescript
const cachedFunction = cacheUtils.memoize(
	async (id: number) => {
		return await fetch(`/api/user/${id}`).then((res) => res.json());
	},
	(id) => `user-${id}`, // 自定义键生成器
	{ ttl: 5 * 60 * 1000 }
);

const user = await cachedFunction(123);
```

#### `cacheUtils.cached(options?: CacheOptions & { keyPrefix?: string })`

装饰器，为类方法添加缓存功能。

```typescript
class UserService {
	@cacheUtils.cached({ ttl: 10 * 60 * 1000 })
	async getUser(id: number) {
		return await fetch(`/api/user/${id}`).then((res) => res.json());
	}
}
```

### 创建自定义缓存实例

```typescript
import { createCache } from '$lib/utils/cache/index';

// 创建自定义缓存实例
const customCache = createCache('my-secret-key', sessionStorage);
```

## 环境差异

### 服务端（SSR）

- 使用 `ServerCache` 类，基于 `Map` 的内存缓存
- 不支持加密（数据在内存中）
- 不支持自定义存储后端
- 自动清理过期数据

### 客户端（浏览器）

- 使用 `LocalCache` 类，基于 localStorage/sessionStorage
- 支持数据加密
- 支持自定义存储后端
- 支持持久化存储
- 自动清理和内存管理

## 最佳实践

### 1. 选择合适的 TTL

```typescript
// 频繁变化的数据 - 短 TTL
cache.set('user-status', status, { ttl: 30 * 1000 }); // 30秒

// 稳定数据 - 长 TTL
cache.set('user-profile', profile, { ttl: 24 * 60 * 60 * 1000 }); // 24小时
```

### 2. 使用 getOrSet 模式

```typescript
// 推荐：自动处理缓存逻辑
const data = await cacheUtils.getOrSet('api-data', fetchData);

// 不推荐：手动处理
let data = cache.get('api-data');
if (!data) {
	data = await fetchData();
	cache.set('api-data', data);
}
```

### 3. 字符串数据优化

```typescript
// 字符串数据直接存储，无需序列化
cache.set('token', 'abc123'); // 高效
cache.set('config', JSON.stringify(config)); // 高效

// 对象数据自动序列化
cache.set('user', { name: 'John' }); // 自动处理
```

### 4. 错误处理

```typescript
try {
	cache.set('data', value);
	const result = cache.get('data');
} catch (error) {
	console.error('缓存操作失败:', error);
	// 降级处理
}
```

## 性能优化

1. **字符串数据直接存储**：避免不必要的 JSON 序列化
2. **自动清理**：定期清理过期数据，防止内存泄漏
3. **环境检测**：根据环境选择最优实现
4. **类型安全**：编译时类型检查，减少运行时错误

## 注意事项

1. 服务端缓存数据不会持久化，重启后丢失
2. 客户端加密密钥自动管理，确保数据安全
3. 大文件缓存可能影响性能，建议设置合理的 TTL
4. 在 SSR 环境中，缓存数据不会在客户端和服务端之间共享
