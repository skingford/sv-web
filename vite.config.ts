import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	css: {
		devSourcemap: false // 明确禁用开发模式CSS source maps
		// PostCSS 配置由 postcss.config.cjs 文件处理
	},
	build: {
		sourcemap: false // 明确禁用构建时source maps
	}
});
