# 类型文件管理

本目录统一管理项目中的所有 TypeScript 类型定义文件。

## 文件结构

```
types/
├── index.d.ts          # 统一的类型入口文件
├── app.d.ts            # SvelteKit App 相关类型
├── vite-env.d.ts       # Vite 环境和全局类型
├── auto-imports.d.ts   # unplugin-auto-import 自动生成的类型
└── README.md           # 本说明文件
```

## 文件说明

### `index.d.ts`

统一的类型文件入口，引用其他所有类型文件。这样可以：

- 集中管理所有类型引用
- 简化其他文件中的类型引用
- 便于维护和更新

### `app.d.ts`

包含 SvelteKit 应用程序的类型定义：

- App 命名空间类型
- 全局接口定义
- 自动导入的全局类型

### `vite-env.d.ts`

包含 Vite 相关的类型定义：

- Vite 客户端类型
- 环境变量类型
- 字体适配器全局接口
- 自定义全局类型

### `auto-imports.d.ts`

由 `unplugin-auto-import` 自动生成，包含：

- Svelte 生命周期函数类型
- Svelte Store 函数类型
- Svelte 工具函数类型
- **注意：此文件会自动更新，请勿手动修改**

## 使用方式

项目中的类型引用已经通过 `src/app.d.ts` 统一引入，无需在各个组件中手动引用类型文件。

如果需要添加新的全局类型，建议：

1. 在相应的类型文件中添加定义
2. 确保在 `index.d.ts` 中正确引用
3. 运行 `pnpm run check` 验证类型正确性
