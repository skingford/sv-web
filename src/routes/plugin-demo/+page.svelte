<script lang="ts">
	let fontUtils: any = null;
	let fontConfig = {
		designWidth: 375,
		baseFont: 16,
		minFont: 12,
		maxFont: 20,
		enableDevLog: false
	};
	let currentRootFont = '16px';
	let calculatedFont = '16px';
	let resizeHistory: string[] = [];

	// 测试数据
	const testPxValues = [12, 14, 16, 18, 20, 24, 32, 48];

	function updateFontInfo() {
		if (fontUtils) {
			currentRootFont = `${fontUtils.getCurrentRootFontSize()}px`;
			calculatedFont = `${fontUtils.calculateRootFontSize()}px`;
		}
	}

	function testPxToRem(px: number): string {
		return fontUtils ? fontUtils.pxToRem(px) : '计算中...';
	}

	function testRemToPx(rem: number): number {
		return fontUtils ? fontUtils.remToPx(rem) : 0;
	}
</script>

<svelte:head>
	<title>Vite 字体适配插件演示</title>
</svelte:head>

<div class="container mx-auto max-w-6xl px-4 py-8">
	<h1 class="f16 mb-8 text-center text-4xl font-bold">🔌 Vite 字体适配插件演示</h1>

	<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
		<!-- 插件配置信息 -->
		<div class="rounded-lg bg-white p-6 shadow-md">
			<h2 class="mb-4 text-2xl font-semibold">📋 插件配置</h2>
			<div class="space-y-2 text-sm">
				<div class="flex justify-between">
					<span class="font-medium">设计稿宽度:</span>
					<code class="rounded bg-gray-100 px-2 py-1">{fontConfig.designWidth}px</code>
				</div>
				<div class="flex justify-between">
					<span class="font-medium">基础字体:</span>
					<code class="rounded bg-gray-100 px-2 py-1">{fontConfig.baseFont}px</code>
				</div>
				<div class="flex justify-between">
					<span class="font-medium">字体范围:</span>
					<code class="rounded bg-gray-100 px-2 py-1"
						>{fontConfig.minFont}px - {fontConfig.maxFont}px</code
					>
				</div>
				<div class="flex justify-between">
					<span class="font-medium">开发日志:</span>
					<code class="rounded bg-gray-100 px-2 py-1"
						>{fontConfig.enableDevLog ? '开启' : '关闭'}</code
					>
				</div>
			</div>
		</div>

		<!-- 实时字体信息 -->
		<div class="rounded-lg bg-white p-6 shadow-md">
			<h2 class="mb-4 text-2xl font-semibold">📏 实时字体信息</h2>
			<div class="space-y-2 text-sm">
				<div class="flex justify-between">
					<span class="font-medium">当前根字体:</span>
					<code class="rounded bg-green-100 px-2 py-1 text-green-700">{currentRootFont}</code>
				</div>
				<div class="flex justify-between">
					<span class="font-medium">计算字体大小:</span>
					<code class="rounded bg-blue-100 px-2 py-1 text-blue-700">{calculatedFont}</code>
				</div>
				<div class="flex justify-between">
					<span class="font-medium">窗口宽度:</span>
					<code class="rounded bg-gray-100 px-2 py-1"
						>{typeof window !== 'undefined' ? window.innerWidth : 0}px</code
					>
				</div>
				<div class="flex justify-between">
					<span class="font-medium">缩放比例:</span>
					<code class="rounded bg-purple-100 px-2 py-1 text-purple-700">
						{fontUtils
							? (fontUtils.getCurrentRootFontSize() / fontConfig.baseFont).toFixed(3)
							: '计算中...'}
					</code>
				</div>
			</div>
		</div>
	</div>

	<!-- PX 转 REM 工具 -->
	<div class="mt-8 rounded-lg bg-white p-6 shadow-md">
		<h2 class="mb-4 text-2xl font-semibold">🔧 PX ⇄ REM 转换工具</h2>
		<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
			{#each testPxValues as px}
				<div class="rounded bg-gray-50 p-3 text-center">
					<div class="font-mono text-lg font-bold text-blue-600">{px}px</div>
					<div class="text-xs text-gray-500">↓</div>
					<div class="font-mono text-sm text-green-600">{testPxToRem(px)}</div>
					<div class="text-xs text-gray-500">↓</div>
					<div class="font-mono text-xs text-purple-600">
						{testRemToPx(parseFloat(testPxToRem(px))).toFixed(1)}px
					</div>
				</div>
			{/each}
		</div>
		<p class="mt-4 text-center text-xs text-gray-500">
			当前根字体: {currentRootFont} | 1rem = {testRemToPx(1).toFixed(1)}px
		</p>
	</div>

	<!-- 字体变化历史 -->
	<div class="mt-8 rounded-lg bg-white p-6 shadow-md">
		<h2 class="mb-4 text-2xl font-semibold">📈 字体变化历史</h2>
		<div class="max-h-32 overflow-y-auto rounded bg-gray-50 p-4">
			{#if resizeHistory.length > 0}
				{#each resizeHistory as entry}
					<div class="mb-1 font-mono text-xs text-gray-600">{entry}</div>
				{/each}
			{:else}
				<p class="text-sm text-gray-500 italic">调整窗口大小来查看变化记录</p>
			{/if}
		</div>
	</div>

	<!-- px 转 rem 测试区域 -->
	<div class="mt-8 rounded-lg bg-white p-6 shadow-md">
		<h2 class="mb-4 text-2xl font-semibold">🔄 PX 自动转换测试</h2>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
			<div class="test-px-conversion bg-blue-100 text-center">
				<p class="f16">16px 字体 (应该是 1rem)</p>
			</div>
			<div class="large-text bg-green-100 p-4 text-center">
				<p>24px 字体 (应该是 1.5rem)</p>
			</div>
			<div class="no-rem-test bg-yellow-100 p-4 text-center">
				<p>18px 字体测试</p>
			</div>
		</div>
		<div class="mt-4 text-sm text-gray-600">
			<p>💡 提示：打开开发者工具查看这些元素的计算样式，px 值应该已经被转换为 rem</p>
		</div>
	</div>

	<!-- 插件优势 -->
	<div
		class="mt-8 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-6"
	>
		<h2 class="mb-4 text-2xl font-semibold text-blue-800">✨ Vite 插件的优势</h2>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<ul class="space-y-2 text-blue-700">
				<li class="flex items-center">
					<span class="mr-3 h-2 w-2 rounded-full bg-blue-500"></span>
					<span>自动注入，无需手动配置</span>
				</li>
				<li class="flex items-center">
					<span class="mr-3 h-2 w-2 rounded-full bg-blue-500"></span>
					<span>代码零污染，配置集中化</span>
				</li>
				<li class="flex items-center">
					<span class="mr-3 h-2 w-2 rounded-full bg-blue-500"></span>
					<span>支持开发和生产环境</span>
				</li>
			</ul>
			<ul class="space-y-2 text-purple-700">
				<li class="flex items-center">
					<span class="mr-3 h-2 w-2 rounded-full bg-purple-500"></span>
					<span>虚拟模块提供工具函数</span>
				</li>
				<li class="flex items-center">
					<span class="mr-3 h-2 w-2 rounded-full bg-purple-500"></span>
					<span>TypeScript 类型支持</span>
				</li>
				<li class="flex items-center">
					<span class="mr-3 h-2 w-2 rounded-full bg-purple-500"></span>
					<span>可配置化，易于扩展</span>
				</li>
			</ul>
		</div>
	</div>
</div>

<style lang="scss">
	/* 测试 px 转 rem */
	.f16 {
		font-size: 16px; /* 这个应该被转换为 1rem */
	}

	.test-px-conversion {
		/* 各种 px 值测试 */
		width: 100px;
		height: 80px;
		padding: 12px 16px;
		margin: 8px;
		border-radius: 4px;
		font-size: 14px;
		line-height: 20px;

		/* 这些值应该保持不变 */
		border: 1px solid #ccc; /* 1px 边框通常保持不变 */
	}

	.large-text {
		font-size: 24px; /* 应该转换为 1.5rem */
	}

	.no-rem-test {
		font-size: 18px; /* 如果类名包含 no-rem，应该不转换 */
	}
</style>
