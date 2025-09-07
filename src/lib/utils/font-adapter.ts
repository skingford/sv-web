/**
 * 简化版字体适配器
 * 只负责窗口大小变化时的字体调整，初始设置由 app.html 处理
 */

// 与 app.html 中相同的配置
const CONFIG = {
	designWidth: 375,
	baseFont: 16,
	minFont: 12,
	maxFont: 20
};

/**
 * 计算根字体大小
 */
function calculateRootFontSize(): number {
	const clientWidth = document.documentElement.clientWidth || window.innerWidth;
	let rootFontSize = (clientWidth / CONFIG.designWidth) * CONFIG.baseFont;
	return Math.max(CONFIG.minFont, Math.min(CONFIG.maxFont, rootFontSize));
}

/**
 * 更新根字体大小
 */
function updateRootFontSize(): void {
	const newFontSize = calculateRootFontSize();
	const currentFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);

	// 只有当字体大小确实需要改变时才更新
	if (Math.abs(newFontSize - currentFontSize) > 0.1) {
		document.documentElement.style.fontSize = `${newFontSize}px`;

		// 触发自定义事件供其他组件监听
		window.dispatchEvent(
			new CustomEvent('fontResize', {
				detail: {
					clientWidth: document.documentElement.clientWidth || window.innerWidth,
					rootFontSize: newFontSize,
					scale: newFontSize / CONFIG.baseFont
				}
			})
		);
	}
}

/**
 * 初始化字体适配器
 */
export function initFontAdapter(): () => void {
	// 防抖处理
	let timeoutId: ReturnType<typeof setTimeout>;
	const handleResize = () => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(updateRootFontSize, 16); // 约 60fps
	};

	// 监听窗口大小变化
	window.addEventListener('resize', handleResize);
	window.addEventListener('orientationchange', handleResize);

	// 返回清理函数
	return () => {
		clearTimeout(timeoutId);
		window.removeEventListener('resize', handleResize);
		window.removeEventListener('orientationchange', handleResize);
	};
}

export default initFontAdapter;
