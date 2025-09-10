import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';
import AutoImport from 'unplugin-auto-import/vite';
import { viteVConsole } from './src/lib/vite-plugins';
import path from 'path';

export default defineConfig(({ mode }) => {
	// 加载环境变量
	const env = loadEnv(mode, process.cwd(), '');

	return {
		resolve: {
			alias: {
				'@types': path.resolve(__dirname, './types'),
				'@types/*': path.resolve(__dirname, './types/*')
			}
		},
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
			devSourcemap: false,
			preprocessorOptions: {
				scss: {
					additionalData: `@use '$lib/styles/variables.scss' as *;`
				}
			}
		},
		build: {
			sourcemap: false // 明确禁用构建时source maps
		},
		// 环境变量配置
		envPrefix: 'VITE_', // 只有以 VITE_ 开头的变量才会被暴露在前端
		define: {
			// 可以在这里定义一些全局常量
			__APP_ENV__: JSON.stringify(env.NODE_ENV || mode),
			__BUILD_TIME__: JSON.stringify(new Date().toISOString())
		}
	};
});
