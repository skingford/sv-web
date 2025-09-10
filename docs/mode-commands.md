# 模式命令使用说明

本项目支持多种运行模式，可以根据不同环境加载相应的配置文件。

## 环境配置文件

- `.env` - 基础环境变量（所有模式都会加载）
- `.env.development` - 开发环境特定配置
- `.env.production` - 生产环境特定配置
- `.env.test` - 测试环境特定配置
- `.env.local` - 本地开发配置（不会被提交到版本控制，优先级最高）

## NPM Scripts 命令

### 开发服务器

```bash
# 默认开发模式
npm run dev

# 指定模式运行开发服务器
npm run dev:development    # 开发模式
npm run dev:production     # 生产模式（用于调试生产配置）
npm run dev:test          # 测试模式
```

### 构建项目

```bash
# 默认构建
npm run build

# 指定模式构建
npm run build:development  # 开发模式构建
npm run build:production   # 生产模式构建
npm run build:test         # 测试模式构建
```

### 预览构建结果

```bash
# 默认预览
npm run preview

# 指定模式预览
npm run preview:development
npm run preview:production
npm run preview:test
```

### 快捷启动命令

```bash
npm run start:dev    # 开发模式
npm run start:prod   # 生产模式
npm run start:test   # 测试模式
```

## 脚本工具

### run-mode.sh

提供了一个便捷的脚本工具来快速切换模式：

```bash
# 使用方法
./scripts/run-mode.sh [command] [mode] [port]

# 示例
./scripts/run-mode.sh dev development 5173
./scripts/run-mode.sh build production
./scripts/run-mode.sh preview test 8080
```

参数说明：

- `command`: 命令类型 (dev, build, preview)
- `mode`: 环境模式 (development, production, test)
- `port`: 端口号 (可选，默认 5173)

## 直接使用 Vite 命令

你也可以直接使用 Vite 命令指定模式：

```bash
# 开发服务器
vite dev --mode production
vite dev --mode development --port 3000

# 构建
vite build --mode test

# 预览
vite preview --mode production --port 8080
```

## 环境变量访问

在代码中可以通过以下方式访问环境变量：

```typescript
// 直接访问
import.meta.env.VITE_API_BASE_URL;
import.meta.env.MODE;

// 使用环境管理器
import { config } from '$lib/utils/env';
console.log(config.apiBaseUrl);
console.log(config.environment);
```

## 模式优先级

环境变量文件的加载优先级（从高到低）：

1. `.env.local` (本地配置，不会被版本控制)
2. `.env.[mode].local` (模式特定的本地配置)
3. `.env.[mode]` (模式特定配置)
4. `.env` (基础配置)

## 常见用例

### 开发调试生产配置

```bash
npm run dev:production
```

### 测试环境构建

```bash
npm run build:test
```

### 自定义端口运行

```bash
./scripts/run-mode.sh dev development 3000
```

### 查看环境变量配置

访问 `/env-demo` 页面可以查看当前环境的配置情况。
