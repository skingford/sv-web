import pxtorem from 'postcss-pxtorem';

export default {
	plugins: [
		pxtorem({
			// 根元素字体大小，与 fontAdapterPlugin 的 baseFont 保持一致
			rootValue: 16,
			// 需要转换的CSS属性，* 表示所有属性
			propList: ['*'],
			// 保留小数位数
			unitPrecision: 5,
			// 最小转换的像素值，小于该值的不转换
			minPixelValue: 1,
			// 是否在媒体查询中转换
			mediaQuery: false,
			// 替换规则（直接替换而不是添加备用）
			replace: true,
			// 忽略的选择器，支持正则
			selectorBlackList: [
				// 保留一些不需要转换的类名
				/^\.no-rem/,
				/^\.ignore-rem/,
				// 保留第三方组件的原始像素值
				/^\.el-/,
				/^\.ant-/
			],
			// 要忽略转换的文件
			exclude: /node_modules/i,
			// 转换函数，可以自定义转换逻辑
			transformUnit: (input, unit) => {
				if (unit === 'px') {
					return 'rem';
				}
				return unit;
			}
		})
	]
};
