import type { Plugin, ResolvedConfig } from 'vite';

/**
 * VConsole 插件配置选项
 */
export interface VConsolePluginOptions {
	/**
	 * 是否启用插件
	 * @default process.env.NODE_ENV === 'development'
	 */
	enabled?: boolean;
	/**
	 * VConsole 最大日志数量
	 * @default 1000
	 */
	maxLogNumber?: number;
	/**
	 * VConsole 主题
	 * @default 'light'
	 */
	theme?: 'light' | 'dark' | 'auto';
	/**
	 * 要注入 VConsole 的入口文件
	 * @default ['src/routes/+layout.svelte']
	 */
	entryFiles?: string[];
	/**
	 * 是否在生产环境中禁用
	 * @default true
	 */
	disableInProduction?: boolean;
}

/**
 * VConsole Vite 插件
 * 自动为 Svelte 项目注入 VConsole 调试工具
 */
export function viteVConsole(options: VConsolePluginOptions = {}): Plugin {
	const {
		enabled = false,
		maxLogNumber = 1000,
		theme = 'light',
		entryFiles = ['src/routes/+layout.svelte'],
		disableInProduction = true
	} = options;

	let isDev: boolean = false;
	let config: ResolvedConfig;

	return {
		name: 'vite-plugin-svelte-vconsole',

		configResolved(resolvedConfig: ResolvedConfig) {
			config = resolvedConfig;
			isDev = resolvedConfig.mode === 'development';
		},

		transform(code: string, id: string) {
			// 检查是否启用
			const shouldEnable = enabled && (isDev || !disableInProduction);
			if (!shouldEnable) return;

			// 检查是否是目标文件
			const shouldTransform = entryFiles.some((file) => id.endsWith(file));
			if (!shouldTransform) return;

			// 检查是否已经存在 vconsole
			if (code.includes('vconsole') || code.includes('VConsole')) {
				return code;
			}

			const vconsoleCode = `
				import { onMount } from 'svelte';
				
				onMount(async () => {
					if (typeof window !== 'undefined') {
						const VConsole = (await import('vconsole')).default;
						new VConsole({
							maxLogNumber: ${maxLogNumber},
							theme: ${theme}
						});
						
						console.log('%c 🚀 VConsole 已启用！', 'color: #07c160; font-size: 14px; font-weight: bold;');
						console.log('%c 📱 点击右下角的绿色按钮打开调试面板', 'color: #666; font-size: 12px;');
					}
				});
			`;

			// 多种插入策略
			if (code.includes('<script>')) {
				return code.replace('<script>', `<script>\n${vconsoleCode}`);
			} else if (code.includes('<script ')) {
				return code.replace(/<script([^>]*)>/, `<script$1>\n${vconsoleCode}`);
			} else if (code.includes('</script>')) {
				return code.replace('</script>', `${vconsoleCode}</script>`);
			} else {
				return `<script>\n${vconsoleCode}\n</script>\n${code}`;
			}
		}
	};
}
