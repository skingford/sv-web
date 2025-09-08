/**
 * 字体适配器同步脚本
 * 防止 FOUC (Flash of Unstyled Content)
 * 必须在页面渲染前执行
 */
(function() {
	'use strict';
	
	// 字体适配配置 - 从全局配置读取，如果没有则使用默认值
	const CONFIG = window.__fontAdapterConfig || {
		designWidth: 375,
		baseFont: 16,
		minFont: 12,
		maxFont: 20,
		enableDevLog: true
	};
	
	/**
	 * 计算根字体大小
	 * @returns {number} 计算后的字体大小
	 */
	function calculateRootFontSize() {
		const clientWidth = document.documentElement.clientWidth || window.innerWidth;
		let rootFontSize = (clientWidth / CONFIG.designWidth) * CONFIG.baseFont;
		return Math.max(CONFIG.minFont, Math.min(CONFIG.maxFont, rootFontSize));
	}
	
	// 立即同步设置根字体大小，防止 FOUC
	const initialFontSize = calculateRootFontSize();
	document.documentElement.style.fontSize = initialFontSize + 'px';
	
	// 开发环境日志
	if (CONFIG.enableDevLog && typeof console !== 'undefined') {
		console.log('[Font Adapter Sync]', {
			clientWidth: document.documentElement.clientWidth || window.innerWidth,
			initialFontSize: initialFontSize + 'px',
			timestamp: new Date().toISOString()
		});
	}
	
	/**
	 * 响应式字体适配器 - 监听窗口变化
	 */
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
					console.log('[Font Adapter Sync] Font size updated:', newFontSize + 'px');
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
	
	// 立即初始化响应式监听器
	const cleanup = initResponsiveFontAdapter();
	
	// 工具函数
	const fontUtils = {
		// 配置
		FONT_CONFIG: CONFIG,
		
		// 获取当前根字体大小
		getCurrentRootFontSize() {
			return parseFloat(getComputedStyle(document.documentElement).fontSize);
		},
		
		// 计算根字体大小
		calculateRootFontSize: calculateRootFontSize,
		
		// 监听字体变化事件
		onFontResize(callback) {
			const handler = (event) => callback(event.detail);
			window.addEventListener('fontResize', handler);
			
			return () => {
				window.removeEventListener('fontResize', handler);
			};
		},
		
		// px 转 rem 工具函数
		pxToRem(px) {
			const rootFontSize = this.getCurrentRootFontSize();
			return (px / rootFontSize).toFixed(3) + 'rem';
		},
		
		// rem 转 px 工具函数
		remToPx(rem) {
			const rootFontSize = this.getCurrentRootFontSize();
			return rem * rootFontSize;
		}
	};
	
	// 将配置和工具函数暴露给其他脚本使用
	window.__fontAdapterConfig = CONFIG;
	window.__fontAdapterUtils = fontUtils;
	window.__fontAdapterCleanup = cleanup;
})();
