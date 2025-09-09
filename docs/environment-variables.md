# 环境变量配置指南

本项目使用多环境配置文件来管理不同环境下的变量设置，并提供了类型安全的环境变量访问工具。

## 📁 文件结构

```
project/
├── .env                    # 基础配置（所有环境）
├── .env.development        # 开发环境配置
├── .env.production         # 生产环境配置
├── .env.local.example      # 本地配置模板
├── .env.local              # 本地配置（被git忽略）
└── src/lib/
    ├── types/env.ts        # 环境变量类型定义
    └── utils/env.ts        # 环境变量工具函数
```

## 🔄 加载优先级

环境变量的加载顺序（后者覆盖前者）：

1. `.env` - 基础默认配置
2. `.env.{mode}` - 特定环境配置（如 `.env.development`）
3. `.env.local` - 本地覆盖配置（敏感信息，不提交到git）

## 🛠️ 配置文件说明

### .env - 基础配置

包含所有环境通用的默认值：

```bash
VITE_APP_NAME=SV-Web
VITE_APP_VERSION=1.0.0
VITE_API_BASE_URL=https://api.example.com
VITE_ENABLE_ANALYTICS=true
```

### .env.development - 开发环境

开发时使用的配置，启用调试功能：

```bash
VITE_API_BASE_URL=http://localhost:3000/api
VITE_ENABLE_MOCK=true
VITE_ENABLE_DEBUG=true
VITE_ENABLE_VCONSOLE=true
```

### .env.production - 生产环境

生产部署时使用的配置，优化性能和安全：

```bash
VITE_API_BASE_URL=https://api.production.com
VITE_ENABLE_DEBUG=false
VITE_ENABLE_ANALYTICS=true
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

### .env.local - 本地配置

存储敏感信息和个人配置（不提交到版本控制）：

```bash
VITE_API_KEY=your_secret_api_key
VITE_DB_URL=postgresql://user:password@localhost:5432/dbname
VITE_DEVELOPER_MODE=true
```

## 💻 代码中使用

### 基础用法

```typescript
// 导入环境变量工具
import { config, env, isDev, isProd } from '$lib/utils/env';

// 使用解析后的配置
console.log(config.apiBaseUrl); // string
console.log(config.apiTimeout); // number
console.log(config.enableDebug); // boolean
console.log(config.environment); // 'development' | 'production' | 'test'

// 环境检测
if (isDev) {
	console.log('开发环境');
}

if (config.enableMock) {
	// 使用 Mock 数据
}
```

### 高级用法

```typescript
// 使用环境变量工具方法
const customValue = env.getString('VITE_CUSTOM_KEY');
const port = env.getOptionalNumber('VITE_PORT', 3000);
const isFeatureEnabled = env.getOptionalBoolean('VITE_FEATURE_FLAG', false);

// 验证环境变量
try {
	env.validate();
	console.log('环境变量验证通过');
} catch (error) {
	console.error('环境变量验证失败:', error.message);
}

// 打印配置（开发环境，敏感信息会被遮罩）
if (isDev) {
	env.printConfig();
}
```

### 在 Svelte 组件中使用

```svelte
<script lang="ts">
	import { config, appName, isDev } from '$lib/utils/env';

	// 根据环境显示不同内容
	$: apiStatus = config.enableMock ? 'Mock模式' : `连接到 ${config.apiBaseUrl}`;
</script>

<h1>{appName}</h1>
<p>API状态: {apiStatus}</p>

{#if isDev}
	<div class="dev-tools">开发工具已启用</div>
{/if}
```

## 🔧 工具函数 API

### EnvironmentManager 类方法

| 方法                                     | 描述               | 参数                                  | 返回值                |
| ---------------------------------------- | ------------------ | ------------------------------------- | --------------------- |
| `getString(key, defaultValue?)`          | 获取字符串类型变量 | `key: string, defaultValue?: string`  | `string`              |
| `getNumber(key, defaultValue?)`          | 获取数字类型变量   | `key: string, defaultValue?: number`  | `number`              |
| `getBoolean(key, defaultValue?)`         | 获取布尔类型变量   | `key: string, defaultValue?: boolean` | `boolean`             |
| `getOptionalString(key, defaultValue?)`  | 获取可选字符串     | `key: string, defaultValue?: string`  | `string \| undefined` |
| `getOptionalNumber(key, defaultValue?)`  | 获取可选数字       | `key: string, defaultValue?: number`  | `number \| undefined` |
| `getOptionalBoolean(key, defaultValue?)` | 获取可选布尔值     | `key: string, defaultValue?: boolean` | `boolean`             |
| `validate()`                             | 验证必需变量       | -                                     | `void`                |
| `printConfig()`                          | 打印配置信息       | -                                     | `void`                |

### 便捷导出

```typescript
// 直接导入常用配置
import { appName, appVersion, apiBaseUrl, enableDebug, isDev, isProd } from '$lib/utils/env';
```

## 🔒 安全注意事项

1. **敏感信息管理**：
   - API密钥、数据库连接等敏感信息放在 `.env.local` 中
   - 确保 `.env.local` 被添加到 `.gitignore`

2. **前端暴露规则**：
   - 只有以 `VITE_` 开头的变量会暴露到前端
   - 服务端密钥不要使用 `VITE_` 前缀

3. **类型安全**：
   - 所有环境变量都有 TypeScript 类型定义
   - 使用工具函数确保类型转换正确

## 📋 环境变量列表

### 应用信息

- `VITE_APP_NAME` - 应用名称
- `VITE_APP_VERSION` - 应用版本
- `VITE_APP_DESCRIPTION` - 应用描述

### API 配置

- `VITE_API_BASE_URL` - API基础地址
- `VITE_API_TIMEOUT` - 请求超时时间（毫秒）
- `VITE_API_KEY` - API密钥（敏感）

### 功能开关

- `VITE_ENABLE_MOCK` - 启用Mock数据
- `VITE_ENABLE_DEBUG` - 启用调试模式
- `VITE_ENABLE_ANALYTICS` - 启用数据分析
- `VITE_ENABLE_VCONSOLE` - 启用移动端调试工具

### 第三方服务

- `VITE_SENTRY_DSN` - Sentry错误监控DSN
- `VITE_GA_TRACKING_ID` - Google Analytics跟踪ID
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe公钥

### 开发配置

- `VITE_DEVELOPER_MODE` - 开发者模式
- `VITE_LOG_LEVEL` - 日志级别 (debug|info|warn|error)
- `VITE_LOCAL_API_PORT` - 本地API端口

## 🚀 最佳实践

1. **分环境配置**：

   ```bash
   # 开发环境
   npm run dev    # 自动加载 .env.development

   # 生产构建
   npm run build  # 自动加载 .env.production
   ```

2. **本地配置设置**：

   ```bash
   # 复制模板文件
   cp .env.local.example .env.local
   # 编辑本地配置
   vim .env.local
   ```

3. **CI/CD 配置**：
   - 在CI/CD环境中设置环境变量
   - 不要在代码仓库中提交敏感信息

4. **团队协作**：
   - 更新 `.env.local.example` 作为本地配置模板
   - 在团队文档中说明必需的环境变量

## 🔍 调试和测试

访问 `/env-demo` 页面查看当前环境变量配置状态。

该页面显示：

- 当前环境信息
- 应用基础配置
- API配置状态
- 功能开关状态
- 开发者模式信息（如果启用）

## ❗ 常见问题

### Q: 为什么环境变量没有生效？

A: 检查以下几点：

1. 变量是否以 `VITE_` 开头
2. 文件优先级是否正确
3. 重启开发服务器

### Q: 如何添加新的环境变量？

A: 按以下步骤：

1. 在相应的 `.env` 文件中添加变量
2. 更新 `src/lib/types/env.ts` 中的类型定义
3. 在 `src/lib/utils/env.ts` 中添加解析逻辑

### Q: 如何处理敏感信息？

A:

1. 使用 `.env.local` 存储敏感信息
2. 确保 `.env.local` 在 `.gitignore` 中
3. 在生产环境通过CI/CD或环境变量设置
