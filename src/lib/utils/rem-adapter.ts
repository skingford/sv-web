/**
 * rem 自适应适配方案
 * 基于设计稿宽度动态计算根字体大小
 */

interface RemAdapterConfig {
	/** 设计稿宽度，默认 375px (iPhone 6/7/8) */
	designWidth?: number;
	/** 根字体大小，默认 16px */
	baseFont?: number;
	/** 最小字体大小，默认 12px */
	minFont?: number;
	/** 最大字体大小，默认 20px */
	maxFont?: number;
	/** 是否启用防抖，默认 true */
	debounce?: boolean;
	/** 防抖延迟时间，默认 100ms */
	debounceDelay?: number;
}

class RemAdapter {
	private config: Required<RemAdapterConfig>;
	private resizeTimer: number | null = null;

	constructor(config: RemAdapterConfig = {}) {
		this.config = {
			designWidth: 375,
			baseFont: 16,
			minFont: 12,
			maxFont: 20,
			debounce: true,
			debounceDelay: 100,
			...config
		};

		this.init();
	}

	/**
	 * 初始化rem适配
	 */
	private init(): void {
		// 只在浏览器环境中初始化
		if (typeof window !== 'undefined' && typeof document !== 'undefined') {
			this.setRootFontSize();
			this.bindEvents();
		}
	}

	/**
	 * 设置根字体大小
	 */
	private setRootFontSize(): void {
		const clientWidth = document.documentElement.clientWidth || window.innerWidth;

		// 计算根字体大小
		// 公式: clientWidth / designWidth * baseFont
		let rootFontSize = (clientWidth / this.config.designWidth) * this.config.baseFont;

		// 限制最小和最大字体大小
		rootFontSize = Math.max(this.config.minFont, rootFontSize);
		rootFontSize = Math.min(this.config.maxFont, rootFontSize);

		// 获取当前根字体大小
		const currentFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);

		// 只有当新字体大小与当前不同时才更新（避免无意义的重新设置）
		if (Math.abs(rootFontSize - currentFontSize) > 0.1) {
			// 平滑过渡到新字体大小
			document.documentElement.style.transition = 'font-size 0.1s ease-out';
			document.documentElement.style.fontSize = `${rootFontSize}px`;

			// 移除过渡效果
			setTimeout(() => {
				document.documentElement.style.transition = '';
			}, 100);
		}

		// 设置CSS自定义属性，供SCSS使用
		document.documentElement.style.setProperty('--root-font-size', `${rootFontSize}px`);
		document.documentElement.style.setProperty('--design-width', `${this.config.designWidth}px`);
		document.documentElement.style.setProperty('--client-width', `${clientWidth}px`);

		// 触发自定义事件
		window.dispatchEvent(
			new CustomEvent('remResize', {
				detail: {
					rootFontSize,
					clientWidth,
					scale: clientWidth / this.config.designWidth
				}
			})
		);
	}

	/**
	 * 绑定事件监听
	 */
	private bindEvents(): void {
		const handleResize = () => {
			if (this.config.debounce) {
				if (this.resizeTimer) {
					clearTimeout(this.resizeTimer);
				}
				this.resizeTimer = window.setTimeout(() => {
					this.setRootFontSize();
				}, this.config.debounceDelay);
			} else {
				this.setRootFontSize();
			}
		};

		window.addEventListener('resize', handleResize);
		window.addEventListener('orientationchange', handleResize);

		// 监听页面加载完成
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', () => {
				this.setRootFontSize();
			});
		}
	}

	/**
	 * 手动更新配置
	 */
	public updateConfig(newConfig: Partial<RemAdapterConfig>): void {
		this.config = { ...this.config, ...newConfig };
		this.setRootFontSize();
	}

	/**
	 * 获取当前根字体大小
	 */
	public getRootFontSize(): number {
		if (typeof window === 'undefined' || typeof document === 'undefined') {
			return this.config.baseFont; // 返回默认字体大小
		}
		const fontSize = getComputedStyle(document.documentElement).fontSize;
		return parseFloat(fontSize);
	}

	/**
	 * px转rem工具函数
	 */
	public pxToRem(px: number): string {
		const rootFontSize = this.getRootFontSize();
		return `${px / rootFontSize}rem`;
	}

	/**
	 * rem转px工具函数
	 */
	public remToPx(rem: number): number {
		const rootFontSize = this.getRootFontSize();
		return rem * rootFontSize;
	}

	/**
	 * 销毁实例
	 */
	public destroy(): void {
		if (this.resizeTimer) {
			clearTimeout(this.resizeTimer);
		}
		// 注意：这里没有移除事件监听器，因为通常RemAdapter是全局单例
		// 如果需要完全清理，可以保存监听器引用并在这里移除
	}
}

// 创建默认实例
const remAdapter = new RemAdapter({
	designWidth: 375, // 基于iPhone 6/7/8设计稿
	baseFont: 16, // 基础字体大小
	minFont: 12, // 最小字体大小（防止过小）
	maxFont: 20 // 最大字体大小（防止过大）
});

// 导出实例和类
export { RemAdapter, remAdapter };
export default remAdapter;

// 导出工具函数
export const pxToRem = (px: number): string => remAdapter.pxToRem(px);
export const remToPx = (rem: number): number => remAdapter.remToPx(rem);
