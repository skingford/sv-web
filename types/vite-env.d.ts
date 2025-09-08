/// <reference types="vite/client" />
/// <reference types="unplugin-auto-import/client" />

// 引入 auto-import 生成的类型定义
/// <reference path="./auto-imports.d.ts" />

// 字体适配器全局类型声明
declare global {
	interface Window {
		__fontAdapterConfig?: {
			designWidth: number;
			baseFont: number;
			minFont: number;
			maxFont: number;
			enableDevLog: boolean;
		};

		__fontAdapterUtils?: {
			FONT_CONFIG: {
				designWidth: number;
				baseFont: number;
				minFont: number;
				maxFont: number;
				enableDevLog: boolean;
			};
			getCurrentRootFontSize(): number;
			calculateRootFontSize(): number;
			onFontResize(callback: (detail: FontResizeDetail) => void): () => void;
			pxToRem(px: number): string;
			remToPx(rem: number): number;
		};

		__fontAdapterCleanup?: () => void;
	}

	interface FontResizeDetail {
		clientWidth: number;
		rootFontSize: number;
		scale: number;
	}
}

export {};
