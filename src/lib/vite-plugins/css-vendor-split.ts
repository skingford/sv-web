import type { Plugin } from 'vite';

/**
 * Vite插件：分离第三方CSS库
 * 确保第三方CSS文件与其他CSS文件放在相同的目录结构中
 */
export function cssVendorSplit(): Plugin {
	return {
		name: 'css-vendor-split',
		apply: 'build',
		generateBundle(options, bundle) {
			// 遍历所有生成的文件
			Object.keys(bundle).forEach((fileName) => {
				const file = bundle[fileName];

				// 只处理CSS文件
				if (file.type === 'asset' && fileName.endsWith('.css')) {
					// 检查CSS内容，根据内容决定文件分组
					const source = file.source as string;

					// 如果包含normalize.css的特征内容
					if (source.includes('/*! normalize.css') || source.includes('html{line-height:1.15')) {
						// 保持在_app/immutable/assets/目录中，只修改文件名
						const newFileName = fileName.includes('_app/immutable/assets/')
							? fileName.replace(/assets\/([^.]+)/, 'assets/vendor-normalize')
							: `_app/immutable/assets/vendor-normalize.${fileName.split('.').pop()}`;
						bundle[newFileName] = { ...file, fileName: newFileName };
						delete bundle[fileName];
						return;
					}

					// 如果主要是Flowbite相关的小文件
					if (source.includes('.clip{clip-path:polygon') && source.length < 1000) {
						// 保持在_app/immutable/assets/目录中，只修改文件名
						const newFileName = fileName.includes('_app/immutable/assets/')
							? fileName.replace(/assets\/([^.]+)/, 'assets/vendor-flowbite')
							: `_app/immutable/assets/vendor-flowbite.${fileName.split('.').pop()}`;
						bundle[newFileName] = { ...file, fileName: newFileName };
						delete bundle[fileName];
						return;
					}
				}
			});
		}
	};
}
