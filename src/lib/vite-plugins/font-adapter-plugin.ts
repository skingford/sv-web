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
 * 根据屏幕宽度动态设置 html 根元素的 font-size
 */
export function fontAdapterPlugin(userConfig: FontAdapterConfig = {}): Plugin {
	const config = { ...defaultConfig, ...userConfig };

	return {
		name: 'vite:font-adapter',
		enforce: 'pre',

		// 开发和生产环境都注入到 HTML
		transformIndexHtml(html: string) {
			const fontAdapterScript = generateFontAdapterScript(config);

			// 尝试多种方式注入脚本
			if (html.includes('%sveltekit.head%')) {
				// SvelteKit 模板：在 %sveltekit.head% 前注入
				return html.replace('%sveltekit.head%', `${fontAdapterScript}\n\t\t%sveltekit.head%`);
			} else if (html.includes('</head>')) {
				// 常规 HTML：在 </head> 前注入
				return html.replace('</head>', `\t${fontAdapterScript}\n\t</head>`);
			}

			return html;
		},

		// 生产环境：注入到构建输出
		generateBundle(options, bundle) {
			for (const fileName in bundle) {
				const chunk = bundle[fileName];
				if (chunk.type === 'asset' && fileName.endsWith('.html')) {
					const html = chunk.source as string;
					const fontAdapterScript = generateFontAdapterScript(config);
					chunk.source = html.replace('</head>', `\t${fontAdapterScript}\n\t</head>`);
				}
			}
		},

		// 注入运行时字体适配器虚拟模块
		load(id) {
			if (id === 'virtual:font-adapter') {
				return generateRuntimeFontAdapter(config);
			}
			// 注入自动初始化模块
			if (id === 'virtual:font-adapter-init') {
				return generateInitModule(config);
			}
		},

		resolveId(id) {
			if (id === 'virtual:font-adapter' || id === 'virtual:font-adapter-init') {
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
		const CONFIG = ${JSON.stringify(config, null, 2)};
		
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
						console.log('[Font Adapter Plugin]', 'Font size updated:', newFontSize + 'px');
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
		
		// 初始化函数
		function init() {
			initResponsiveFontAdapter();
			if (CONFIG.enableDevLog && typeof console !== 'undefined') {
				console.log('[Font Adapter Plugin]', 'Initialized with root font size:', getComputedStyle(document.documentElement).fontSize);
			}
		}
		
		// DOM 加载完成后初始化
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', init);
		} else {
			init();
		}
		
		// 将配置暴露到全局（调试用）
		if (CONFIG.enableDevLog) {
			window.__fontAdapterConfig = CONFIG;
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
export function getCurrentRootFontSize() {
	return parseFloat(getComputedStyle(document.documentElement).fontSize);
}

// 计算根字体大小
export function calculateRootFontSize() {
	const clientWidth = document.documentElement.clientWidth || window.innerWidth;
	let rootFontSize = (clientWidth / FONT_CONFIG.designWidth) * FONT_CONFIG.baseFont;
	return Math.max(FONT_CONFIG.minFont, Math.min(FONT_CONFIG.maxFont, rootFontSize));
}

// 监听字体变化事件
export function onFontResize(callback) {
	const handler = (event) => callback(event.detail);
	window.addEventListener('fontResize', handler);
	
	return () => {
		window.removeEventListener('fontResize', handler);
	};
}

// px 转 rem 工具函数
export function pxToRem(px) {
	const rootFontSize = getCurrentRootFontSize();
	return (px / rootFontSize).toFixed(3) + 'rem';
}

// rem 转 px 工具函数
export function remToPx(rem) {
	const rootFontSize = getCurrentRootFontSize();
	return rem * rootFontSize;
}
`;
}

/**
 * 生成自动初始化模块
 */
function generateInitModule(config: Required<FontAdapterConfig>): string {
	return `
// 字体适配器自动初始化模块
const CONFIG = ${JSON.stringify(config, null, 2)};

// 计算根字体大小
function calculateRootFontSize() {
	const clientWidth = document.documentElement.clientWidth || window.innerWidth;
	let rootFontSize = (clientWidth / CONFIG.designWidth) * CONFIG.baseFont;
	return Math.max(CONFIG.minFont, Math.min(CONFIG.maxFont, rootFontSize));
}

// 立即设置初始字体大小（避免闪烁）
if (typeof document !== 'undefined') {
	document.documentElement.style.fontSize = calculateRootFontSize() + 'px';
}

// 响应式字体适配器
function initResponsiveFontAdapter() {
	if (typeof window === 'undefined') return () => {};
	
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
				console.log('[Font Adapter Plugin]', 'Font size updated:', newFontSize + 'px');
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

// 自动初始化
let cleanup;
if (typeof window !== 'undefined') {
	function init() {
		cleanup = initResponsiveFontAdapter();
		if (CONFIG.enableDevLog && typeof console !== 'undefined') {
			console.log('[Font Adapter Plugin]', 'Initialized via virtual module with root font size:', getComputedStyle(document.documentElement).fontSize);
		}
	}
	
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
}

// 导出配置和清理函数
export { CONFIG, cleanup };
export default CONFIG;
`;
}
