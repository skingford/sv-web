import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { fontAdapterPlugin } from './src/lib/vite-plugins/font-adapter-plugin';

export default defineConfig({
	plugins: [
		sveltekit(),
		fontAdapterPlugin({
			designWidth: 375,
			baseFont: 16,
			minFont: 12,
			maxFont: 20,
			enableDevLog: true // 开发环境启用日志
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
