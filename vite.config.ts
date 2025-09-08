import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import AutoImport from 'unplugin-auto-import/vite';

export default defineConfig({
	plugins: [
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
		sourcemap: false // 明确禁用构建时source maps
	}
});
