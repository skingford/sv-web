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
		devSourcemap: false // 明确禁用开发模式CSS source maps
		// PostCSS 配置由 postcss.config.cjs 文件处理
	},
	build: {
		sourcemap: false // 明确禁用构建时source maps
	}
});
