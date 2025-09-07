import type { Plugin } from 'vite';

export interface FontAdapterConfig {
	/** 设计稿宽度 */
	designWidth?: number;
	/** 基础字体大小 */
	baseFont?: number;
	/** 最小字体大小 */
	minFont?: number;
	/** 最大字体大小 */
	maxFont?: number;
	/** 是否启用开发环境日志 */
	enableDevLog?: boolean;
}

const defaultConfig: Required<FontAdapterConfig> = {
	designWidth: 375,
	baseFont: 16,
	minFont: 12,
	maxFont: 20,
	enableDevLog: false
};

/**
 * Vite 字体适配插件
 * 自动注入字体适配代码，避免手动配置
 */
export function fontAdapterPlugin(userConfig: FontAdapterConfig = {}): Plugin {
	const config = { ...defaultConfig, ...userConfig };

	return {
		name: 'vite:font-adapter',

		// 开发和生产环境都注入到 HTML
		transformIndexHtml(html, ctx) {
			const fontAdapterScript = generateFontAdapterScript(config);

			// 在 </head> 前注入脚本
			return html.replace('</head>', `${fontAdapterScript}\n</head>`);
		},

		// 生产环境：注入到构建输出
		generateBundle(options, bundle) {
			// 查找 HTML 文件
			for (const fileName in bundle) {
				const chunk = bundle[fileName];

				if (chunk.type === 'asset' && fileName.endsWith('.html')) {
					const html = chunk.source as string;
					const fontAdapterScript = generateFontAdapterScript(config);

					// 在 </head> 前注入脚本
					chunk.source = html.replace('</head>', `${fontAdapterScript}\n</head>`);
				}
			}
		},

		// 注入运行时字体适配器
		load(id) {
			if (id === 'virtual:font-adapter') {
				return generateRuntimeFontAdapter(config);
			}
		},

		resolveId(id) {
			if (id === 'virtual:font-adapter') {
				return id;
			}
		}
	};
}

/**
 * 生成内联的字体适配脚本
 */
function generateFontAdapterScript(config: Required<FontAdapterConfig>): string {
	return `
	<!-- Font Adapter Plugin -->
	<script>
		(function() {
			// 字体适配配置
			const CONFIG = ${JSON.stringify(config, null, 3)};
			
			// 计算根字体大小
			function calculateRootFontSize() {
				const clientWidth = document.documentElement.clientWidth || window.innerWidth;
				let rootFontSize = (clientWidth / CONFIG.designWidth) * CONFIG.baseFont;
				return Math.max(CONFIG.minFont, Math.min(CONFIG.maxFont, rootFontSize));
			}
			
			// 立即设置初始字体大小（避免闪烁）
			document.documentElement.style.fontSize = calculateRootFontSize() + 'px';
			
			// 响应式字体适配器
			function initResponsiveFontAdapter() {
				let timeoutId;
				
				function updateRootFontSize() {
					const newFontSize = calculateRootFontSize();
					const currentFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
					
					if (Math.abs(newFontSize - currentFontSize) > 0.1) {
						document.documentElement.style.fontSize = newFontSize + 'px';
						
						// 触发自定义事件
						window.dispatchEvent(new CustomEvent('fontResize', {
							detail: {
								clientWidth: document.documentElement.clientWidth || window.innerWidth,
								rootFontSize: newFontSize,
								scale: newFontSize / CONFIG.baseFont
							}
						}));
						
						if (CONFIG.enableDevLog && typeof console !== 'undefined') {
							console.log('[Font Adapter]', 'Font size updated:', newFontSize + 'px');
						}
					}
				}
				
				function handleResize() {
					clearTimeout(timeoutId);
					timeoutId = setTimeout(updateRootFontSize, 16); // ~60fps
				}
				
				// 监听窗口变化
				window.addEventListener('resize', handleResize);
				window.addEventListener('orientationchange', handleResize);
				
				// 返回清理函数
				return function cleanup() {
					clearTimeout(timeoutId);
					window.removeEventListener('resize', handleResize);
					window.removeEventListener('orientationchange', handleResize);
				};
			}
			
			// DOM 加载完成后初始化
			if (document.readyState === 'loading') {
				document.addEventListener('DOMContentLoaded', initResponsiveFontAdapter);
			} else {
				initResponsiveFontAdapter();
			}
		})();
	</script>`;
}

/**
 * 生成运行时字体适配器模块（供组件按需导入）
 */
function generateRuntimeFontAdapter(config: Required<FontAdapterConfig>): string {
	return `
// 运行时字体适配器配置
export const FONT_CONFIG = ${JSON.stringify(config, null, 2)};

// 获取当前根字体大小
export function getCurrentRootFontSize(): number {
	return parseFloat(getComputedStyle(document.documentElement).fontSize);
}

// 计算根字体大小
export function calculateRootFontSize(): number {
	const clientWidth = document.documentElement.clientWidth || window.innerWidth;
	let rootFontSize = (clientWidth / FONT_CONFIG.designWidth) * FONT_CONFIG.baseFont;
	return Math.max(FONT_CONFIG.minFont, Math.min(FONT_CONFIG.maxFont, rootFontSize));
}

// 监听字体变化事件
export function onFontResize(callback: (detail: any) => void): () => void {
	const handler = (event: CustomEvent) => callback(event.detail);
	window.addEventListener('fontResize', handler as EventListener);
	
	return () => {
		window.removeEventListener('fontResize', handler as EventListener);
	};
}

// px 转 rem 工具函数
export function pxToRem(px: number): string {
	const rootFontSize = getCurrentRootFontSize();
	return (px / rootFontSize).toFixed(3) + 'rem';
}

// rem 转 px 工具函数
export function remToPx(rem: number): number {
	const rootFontSize = getCurrentRootFontSize();
	return rem * rootFontSize;
}
`;
}
