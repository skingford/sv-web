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
	console.log('[ VConsole Plugin ] Plugin initialized with options:', options);

	const {
		enabled = true,
		maxLogNumber = 1000,
		theme = 'light',
		entryFiles = ['src/routes/+layout.svelte'],
		disableInProduction = true
	} = options;

	let config: ResolvedConfig;
	let isDevMode = false;

	return {
		name: 'vite-vconsole',
		enforce: 'pre',
		configResolved(resolvedConfig) {
			config = resolvedConfig;
			isDevMode = config.command === 'serve';
			console.log('[ VConsole Plugin ] Config resolved. Dev mode:', isDevMode);
			console.log('[ VConsole Plugin ] Root path:', config.root);
			console.log('[ VConsole Plugin ] Target files:', entryFiles);
		},
		load(id) {
			// 只在开发环境且插件启用时处理
			if (!enabled || (disableInProduction && !isDevMode)) {
				return null;
			}

			// 排除生成的文件和非源文件
			if (id.includes('.svelte-kit') || id.includes('node_modules') || id.includes('virtual:')) {
				return null;
			}

			// 只处理 .svelte 文件
			if (!id.endsWith('.svelte')) {
				return null;
			}

			console.log('[ VConsole Plugin ] Load called for .svelte file:', id);

			// 检查是否为目标文件
			const isTargetFile = entryFiles.some((file) => {
				// 规范化路径比较
				const normalizedId = id.replace(/\\/g, '/').toLowerCase();
				const normalizedFile = file.replace(/\\/g, '/').toLowerCase();

				// 构建完整的文件路径用于比较
				const fullFilePath = (config.root + '/' + normalizedFile).replace(/\\/g, '/').toLowerCase();

				console.log('[ VConsole Plugin ] Checking:', normalizedId);
				console.log('[ VConsole Plugin ] Against:', fullFilePath);

				// 精确匹配文件路径或相对路径匹配
				return normalizedId === fullFilePath || normalizedId.endsWith('/' + normalizedFile);
			});

			if (!isTargetFile) {
				console.log('[ VConsole Plugin ] Skipped - not target file');
				return null;
			}

			console.log('[ VConsole Plugin ] Processing target file in load hook:', id);
			return null; // 让其他插件处理加载
		},
		transform(code, id) {
			// 只在开发环境且插件启用时处理
			if (!enabled || (disableInProduction && !isDevMode)) {
				return null;
			}

			// 排除生成的文件和非源文件
			if (id.includes('.svelte-kit') || id.includes('node_modules') || id.includes('virtual:')) {
				return null;
			}

			// 只处理 .svelte 文件
			if (!id.endsWith('.svelte')) {
				return null;
			}

			console.log('[ VConsole Plugin ] Processing .svelte file:', id);

			// 检查是否为目标文件
			const isTargetFile = entryFiles.some((file) => {
				// 规范化路径比较
				const normalizedId = id.replace(/\\/g, '/').toLowerCase();
				const normalizedFile = file.replace(/\\/g, '/').toLowerCase();

				// 构建完整的文件路径用于比較
				const fullFilePath = (config.root + '/' + normalizedFile).replace(/\\/g, '/').toLowerCase();

				console.log('[ VConsole Plugin ] Checking:', normalizedId);
				console.log('[ VConsole Plugin ] Against:', fullFilePath);

				// 精确匹配文件路径或相对路径匹配
				return normalizedId === fullFilePath || normalizedId.endsWith('/' + normalizedFile);
			});

			if (!isTargetFile) {
				console.log('[ VConsole Plugin ] Skipped - not target file');
				return null;
			}

			console.log('[ VConsole Plugin ] Processing target file:', id);

			// 检查是否已经包含 VConsole 代码，避免重复注入
			if (code.includes('VConsole') || code.includes('vconsole')) {
				console.log('[ VConsole Plugin ] Skipped - VConsole already exists');
				return null;
			}

			// 生成 VConsole 初始化代码 (适配 Svelte 5)
			const vConsoleCode = `
	// VConsole 自动注入代码 - 由 vite-vconsole 插件生成
	if (typeof window !== 'undefined' && import.meta.env.DEV) {
		import('vconsole').then(({ default: VConsole }) => {
			new VConsole({
				maxLogNumber: ${maxLogNumber},
				theme: '${theme}'
			});
			console.log('VConsole loaded by plugin!');
		}).catch(error => {
			console.error('Failed to load VConsole:', error);
		});
	}
`;

			console.log('[ VConsole Plugin ] Injecting VConsole code');

			// 在 <script> 标签结束前注入代码
			const scriptEndRegex = /<\/script>/;
			if (scriptEndRegex.test(code)) {
				const modifiedCode = code.replace(scriptEndRegex, vConsoleCode + '</script>');
				console.log('[ VConsole Plugin ] Code injected successfully');
				return {
					code: modifiedCode,
					map: null
				};
			}

			console.log('[ VConsole Plugin ] No script tag found for injection');
			return null;
		}
	};
}
