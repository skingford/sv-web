# @types 别名配置和使用指南

本项目配置了 `@types` 别名，方便在任何地方导入类型定义，无需使用复杂的相对路径。

## 🎯 配置概览

### 1. Vite 配置 (`vite.config.ts`)

```typescript
import path from 'path';

export default defineConfig(({ mode }) => {
	return {
		resolve: {
			alias: {
				'@types': path.resolve(__dirname, './types'),
				'@types/*': path.resolve(__dirname, './types/*')
			}
		}
		// ... 其他配置
	};
});
```

### 2. SvelteKit 配置 (`svelte.config.js`)

```javascript
const config = {
	kit: {
		adapter: adapter(),
		alias: {
			'@types': 'types',
			'@types/*': 'types/*'
		}
	}
};
```

### 3. TypeScript 配置 (`tsconfig.json`)

```json
{
	"compilerOptions": {
		"baseUrl": ".",
		"paths": {
			"@types": ["./types"],
			"@types/*": ["./types/*"]
		}
	}
}
```

### 4. 统一导出文件 (`types/index.ts`)

```typescript
export type {
	Environment,
	LogLevel,
	EnvironmentVariables,
	ParsedEnvironmentVariables
} from './env.d';
```

## 📁 目录结构

```
types/
├── index.ts          # 统一导出文件
├── index.d.ts        # 类型声明入口
├── env.d.ts          # 环境变量类型定义
├── app.d.ts          # SvelteKit App 类型
├── vite-env.d.ts     # Vite 环境类型
└── auto-imports.d.ts # 自动导入类型
```

## 🚀 使用方法

### 推荐用法

```typescript
// ✅ 从统一入口导入（推荐）
import type { Environment, LogLevel } from '@types';

// ✅ 导入所有类型
import type {
	Environment,
	LogLevel,
	EnvironmentVariables,
	ParsedEnvironmentVariables
} from '@types';
```

### 具体文件导入

```typescript
// ✅ 从具体文件导入
import type { Environment } from '@types/env.d';

// ⚠️ 注意：.d.ts 文件导入时需要省略 .ts 扩展名
```

### 在 Svelte 组件中使用

```svelte
<script lang="ts">
	import type { Environment, LogLevel } from '@types';
	import { env } from '$lib/utils/env';

	let currentEnv: Environment = env.config.environment;
	let logLevel: LogLevel = env.config.logLevel;
</script>
```

## 🔧 实际应用示例

### 1. 环境管理器

```typescript
// src/lib/utils/env.ts
import type { Environment, LogLevel, ParsedEnvironmentVariables } from '@types';

class EnvironmentManager {
	getEnvironment(): Environment {
		// 实现逻辑
	}

	getLogLevel(): LogLevel {
		// 实现逻辑
	}
}
```

### 2. 组件中的类型使用

```svelte
<script lang="ts">
	import type { Environment } from '@types';

	export let environment: Environment = 'development';

	$: environmentClass = {
		development: 'bg-blue-100',
		production: 'bg-green-100',
		test: 'bg-yellow-100'
	}[environment];
</script>

<div class={environmentClass}>
	当前环境: {environment}
</div>
```

## 🎨 支持的导入模式

| 导入方式                                           | 说明           | 推荐度     |
| -------------------------------------------------- | -------------- | ---------- |
| `import type { Type } from '@types'`               | 从统一入口导入 | ⭐⭐⭐⭐⭐ |
| `import type { Type } from '@types/env.d'`         | 从具体文件导入 | ⭐⭐⭐⭐   |
| `import type { Type } from '../../../types/env.d'` | 相对路径导入   | ⭐⭐       |

## 📝 最佳实践

### 1. 统一入口优先

优先使用统一入口 (`@types`) 导入，这样：

- 代码更简洁
- 易于重构
- 减少路径错误

### 2. 类型文件组织

- 将相关类型放在同一个 `.d.ts` 文件中
- 使用有意义的文件名
- 在 `types/index.ts` 中统一导出

### 3. 文档注释

在类型定义中添加详细注释：

```typescript
/**
 * 应用环境类型
 * @description 定义应用可能的运行环境
 */
export type Environment = 'development' | 'production' | 'test';

/**
 * 日志级别类型
 * @description 定义日志输出的级别
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
```

## 🔍 故障排除

### 常见问题

1. **导入路径不生效**
   - 检查 `vite.config.ts` 中的别名配置
   - 确认 TypeScript 配置中的路径映射
   - 重启开发服务器

2. **TypeScript 报错**

   ```
   Cannot import type declaration files
   ```

   - 确保使用 `types/index.ts` 统一入口
   - 或者导入 `.d.ts` 文件时省略 `.ts` 扩展名

3. **IDE 不识别别名**
   - 确认 `tsconfig.json` 中的 `baseUrl` 和 `paths` 配置
   - 重启 IDE 或重新加载 TypeScript 服务

### 调试技巧

```bash
# 检查 TypeScript 编译
npx tsc --noEmit

# 检查别名解析
npm run dev
# 在浏览器控制台查看是否能正确导入
```

## 🎯 演示页面

访问 `/types-demo` 页面查看 `@types` 别名的实际使用演示。

## 📚 扩展类型

需要添加新的类型定义时：

1. 在 `types/` 目录下创建新的 `.d.ts` 文件
2. 在 `types/index.ts` 中添加导出
3. 更新相关文档

```typescript
// types/api.d.ts
export interface ApiResponse<T = any> {
	success: boolean;
	data: T;
	message?: string;
}

// types/index.ts
export type { ApiResponse } from './api.d';
```
