import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import pxtorem from 'postcss-pxtorem';

export default defineConfig({
	plugins: [sveltekit()],
	css: {
		devSourcemap: false, // 明确禁用开发模式CSS source maps
		postcss: {
			plugins: [
				pxtorem({
					rootValue: 16, // 根字体大小，与rem-adapter中的baseFont保持一致
					unitPrecision: 5, // rem的小数点位数
					propList: ['*'], // 可以转换的属性，*表示所有属性
					selectorBlackList: ['.no-rem'], // 排除的选择器，添加.no-rem类的元素不转换
					replace: true, // 替换包含rem的规则，而不是添加
					mediaQuery: false, // 允许在媒体查询中转换px
					minPixelValue: 1, // 最小的px值，小于这个值的不转换
					exclude: /node_modules/i // 排除node_modules文件夹
				})
			]
		}
	},
	build: {
		sourcemap: false // 明确禁用构建时source maps
	}
});
