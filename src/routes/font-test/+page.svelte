<script lang="ts">
	import { onMount } from 'svelte';

	let fontSizeHistory: string[] = [];
	let currentFontSize = '16px';

	// 监听字体大小变化
	const checkFontSize = () => {
		if (typeof window !== 'undefined' && typeof document !== 'undefined') {
			const fontSize = getComputedStyle(document.documentElement).fontSize;
			if (fontSize !== currentFontSize) {
				currentFontSize = fontSize;
				fontSizeHistory = [
					...fontSizeHistory,
					`${new Date().toLocaleTimeString()}: ${fontSize}`
				].slice(-10);
			}
		}
	};

	onMount(() => {
		checkFontSize();

		// 定期检查字体大小变化
		const interval = setInterval(checkFontSize, 100);

		// 监听窗口大小变化
		const handleResize = () => {
			setTimeout(checkFontSize, 50);
		};

		window.addEventListener('resize', handleResize);

		// 监听 rem 变化事件
		const handleRemResize = (event: CustomEvent) => {
			fontSizeHistory = [
				...fontSizeHistory,
				`${new Date().toLocaleTimeString()}: ${event.detail.rootFontSize}px (事件)`
			].slice(-10);
		};

		window.addEventListener('remResize', handleRemResize as EventListener);

		return () => {
			clearInterval(interval);
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('remResize', handleRemResize as EventListener);
		};
	});
</script>

<svelte:head>
	<title>字体加载测试</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-4xl">
	<h1 class="text-3xl font-bold mb-6">字体加载闪烁测试</h1>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<!-- 实时信息 -->
		<div class="bg-white p-6 rounded-lg shadow-md">
			<h2 class="text-xl font-semibold mb-4">实时状态</h2>
			<div class="space-y-2">
				<p>
					<strong>当前根字体大小:</strong>
					<code class="bg-gray-100 px-2 py-1 rounded">{currentFontSize}</code>
				</p>
				<p>
					<strong>窗口宽度:</strong>
					<code class="bg-gray-100 px-2 py-1 rounded"
						>{typeof window !== 'undefined' ? window.innerWidth : 0}px</code
					>
				</p>
				<p>
					<strong>计算的 rem 值:</strong>
					<code class="bg-gray-100 px-2 py-1 rounded"
						>{parseFloat(currentFontSize) / 16}rem = 16px</code
					>
				</p>
			</div>
		</div>

		<!-- 字体变化历史 -->
		<div class="bg-white p-6 rounded-lg shadow-md">
			<h2 class="text-xl font-semibold mb-4">字体大小变化历史</h2>
			<div class="text-sm space-y-1 max-h-40 overflow-y-auto">
				{#each fontSizeHistory as entry}
					<div class="text-gray-600 font-mono text-xs">{entry}</div>
				{/each}
				{#if fontSizeHistory.length === 0}
					<p class="text-gray-500 italic">暂无变化记录</p>
				{/if}
			</div>
		</div>
	</div>

	<!-- 测试内容 -->
	<div class="mt-8 bg-white p-6 rounded-lg shadow-md">
		<h2 class="text-xl font-semibold mb-4">字体测试内容</h2>
		<div class="space-y-4">
			<p class="text-sm">小字体 (14px) - 应该是 {(14 * parseFloat(currentFontSize)) / 16}px</p>
			<p class="text-base">基础字体 (16px) - 应该是 {(16 * parseFloat(currentFontSize)) / 16}px</p>
			<p class="text-lg">大字体 (18px) - 应该是 {(18 * parseFloat(currentFontSize)) / 16}px</p>
			<p class="text-xl">特大字体 (20px) - 应该是 {(20 * parseFloat(currentFontSize)) / 16}px</p>
		</div>
	</div>

	<!-- 测试说明 -->
	<div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
		<h2 class="text-xl font-semibold mb-4 text-blue-800">测试说明</h2>
		<ul class="space-y-2 text-blue-700">
			<li>• 刷新页面观察字体是否有闪烁</li>
			<li>• 调整浏览器窗口大小观察字体平滑变化</li>
			<li>• 检查字体变化历史记录</li>
			<li>• 根字体大小应该在 12px-20px 之间</li>
		</ul>
	</div>

	<!-- 修复效果 -->
	<div class="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
		<h2 class="text-xl font-semibold mb-4 text-green-800">✅ 修复效果</h2>
		<ul class="space-y-2 text-green-700">
			<li>• <strong>预设字体大小:</strong> 在 HTML head 中预先计算并设置根字体大小</li>
			<li>• <strong>平滑过渡:</strong> rem-adapter 加载时进行平滑的字体大小调整</li>
			<li>• <strong>延迟加载:</strong> 使用 requestAnimationFrame 避免阻塞初始渲染</li>
			<li>• <strong>智能更新:</strong> 只在字体大小确实需要改变时才更新</li>
		</ul>
	</div>
</div>
