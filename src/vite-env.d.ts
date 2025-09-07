/// <reference types="vite/client" />

// 字体适配器虚拟模块类型声明
declare module 'virtual:font-adapter' {
	export interface FontConfig {
		designWidth: number;
		baseFont: number;
		minFont: number;
		maxFont: number;
		enableDevLog: boolean;
	}

	export interface FontResizeDetail {
		clientWidth: number;
		rootFontSize: number;
		scale: number;
	}

	export const FONT_CONFIG: FontConfig;

	export function getCurrentRootFontSize(): number;
	export function calculateRootFontSize(): number;
	export function onFontResize(callback: (detail: FontResizeDetail) => void): () => void;
	export function pxToRem(px: number): string;
	export function remToPx(rem: number): number;
}
