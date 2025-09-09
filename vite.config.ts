import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import AutoImport from 'unplugin-auto-import/vite';
import { viteVConsole } from './src/lib/vite-plugins';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		AutoImport({
			imports: [
				// Svelte 预设
				'svelte',
				// Svelte Stores
				{
					'svelte/store': ['writable', 'readable', 'derived', 'get']
				}
			],
			dts: './types/auto-imports.d.ts', // 生成类型定义文件
			dirs: [], // 不自动引入目录下的文件
			vueTemplate: false, // 不是 Vue 项目
			// 确保 ESLint 能识别自动导入
			eslintrc: {
				enabled: true,
				filepath: './.eslintrc-auto-import.json'
			}
		}),
		// VConsole 插件 - 自动在开发环境中注入 VConsole
		viteVConsole({
			enabled: true,
			maxLogNumber: 1000,
			theme: 'light',
			entryFiles: ['src/routes/+layout.svelte']
		})
	],
	css: {
		devSourcemap: false, // 明确禁用开发模式CSS source maps
		// PostCSS 配置由 postcss.config.js 文件处理
		preprocessorOptions: {
			scss: {
				// 自动在所有 SCSS 文件中引入变量文件
				// 注意：编辑器可能会显示"Undefined variable"警告，但实际运行时变量是可用的
				additionalData: `@use '$lib/styles/variables.scss' as *;`
			}
		}
	},
	build: {
		sourcemap: false, // 明确禁用构建时source maps
		// 代码分割配置 - 只保留JavaScript分割，CSS由SvelteKit管理
		rollupOptions: {
			output: {
				// JavaScript 代码分割 - 将第三方库分离到独立chunks
				manualChunks(id) {
					// 只处理node_modules中的模块
					if (id.includes('node_modules')) {
						// 基础样式库
						if (id.includes('normalize.css')) {
							return 'vendor-styles';
						}
						// UI 组件库
						if (id.includes('flowbite') || id.includes('flowbite-svelte')) {
							return 'vendor-ui';
						}
						// 开发工具
						if (id.includes('vconsole')) {
							return 'vendor-dev';
						}
						// Svelte 相关库（除了 SvelteKit 本身）
						if (id.includes('svelte') && !id.includes('@sveltejs/kit')) {
							return 'vendor-svelte';
						}
						// 其他第三方库
						return 'vendor';
					}
				}
			}
		},
		// 优化构建配置
		chunkSizeWarningLimit: 500,
		// 压缩配置
		minify: 'esbuild'
	}
});
