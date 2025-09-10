<script lang="ts">
	import { config, env, appName, isDev, isProd, mode } from '$lib/utils/env';

	// 在组件挂载时打印配置（仅开发环境）
	if (config.enableDebug) {
		env.printConfig();
	}

	// 示例：根据环境变量动态显示内容
	const getApiStatus = () => {
		if (config.enableMock) return '🔸 使用 Mock 数据';
		return `🔗 连接到 ${config.apiBaseUrl}`;
	};

	const getFeatureStatus = (enabled: boolean) => (enabled ? '✅ 启用' : '❌ 禁用');
</script>

<svelte:head>
	<title>{appName} - 环境变量演示</title>
</svelte:head>

<div class="container mx-auto p-6 max-w-4xl">
	<h1 class="text-3xl font-bold mb-6">🔧 环境变量配置演示</h1>

	<!-- 环境信息卡片 -->
	<div class="bg-white rounded-lg shadow-lg p-6 mb-6">
		<h2 class="text-xl font-semibold mb-4 flex items-center">
			<span class="mr-2">🌍</span>
			环境信息
		</h2>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
				<h3 class="font-semibold text-blue-800">当前环境</h3>
				<p class="text-blue-600 text-lg">{config.environment}</p>
			</div>

			<div class="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
				<h3 class="font-semibold text-green-800">开发模式</h3>
				<p class="text-green-600 text-lg">{isDev ? '是' : '否'}</p>
			</div>

			<div class="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
				<h3 class="font-semibold text-purple-800">生产模式</h3>
				<p class="text-purple-600 text-lg">{isProd ? '是' : '否'}</p>
			</div>
		</div>
	</div>

	<!-- 应用信息 -->
	<div class="bg-white rounded-lg shadow-lg p-6 mb-6">
		<h2 class="text-xl font-semibold mb-4 flex items-center">
			<span class="mr-2">📱</span>
			应用信息
		</h2>

		<div class="space-y-3">
			<div class="flex justify-between items-center py-2 border-b border-gray-200">
				<span class="font-medium text-gray-700">应用名称:</span>
				<span class="text-gray-900">{config.appName}</span>
			</div>
			<div class="flex justify-between items-center py-2 border-b border-gray-200">
				<span class="font-medium text-gray-700">版本:</span>
				<span class="text-gray-900">{config.appVersion}</span>
			</div>
			<div class="flex justify-between items-center py-2">
				<span class="font-medium text-gray-700">描述:</span>
				<span class="text-gray-900 text-right max-w-xs">{config.appDescription}</span>
			</div>
		</div>
	</div>

	<!-- API 配置 -->
	<div class="bg-white rounded-lg shadow-lg p-6 mb-6">
		<h2 class="text-xl font-semibold mb-4 flex items-center">
			<span class="mr-2">🔗</span>
			API 配置
		</h2>

		<div class="space-y-3">
			<div class="flex justify-between items-center py-2 border-b border-gray-200">
				<span class="font-medium text-gray-700">API 地址:</span>
				<span class="text-gray-900 font-mono text-sm">{config.apiBaseUrl}</span>
			</div>
			<div class="flex justify-between items-center py-2 border-b border-gray-200">
				<span class="font-medium text-gray-700">超时时间:</span>
				<span class="text-gray-900">{config.apiTimeout}ms</span>
			</div>
			<div class="flex justify-between items-center py-2">
				<span class="font-medium text-gray-700">状态:</span>
				<span class="text-gray-900">{getApiStatus()}</span>
			</div>
		</div>
	</div>

	<!-- 功能开关 -->
	<div class="bg-white rounded-lg shadow-lg p-6 mb-6">
		<h2 class="text-xl font-semibold mb-4 flex items-center">
			<span class="mr-2">🎛️</span>
			功能开关
		</h2>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div class="space-y-3">
				<div class="flex justify-between items-center py-2">
					<span class="font-medium text-gray-700">Mock 数据:</span>
					<span>{getFeatureStatus(config.enableMock)}</span>
				</div>
				<div class="flex justify-between items-center py-2">
					<span class="font-medium text-gray-700">调试模式:</span>
					<span>{getFeatureStatus(config.enableDebug)}</span>
				</div>
				<div class="flex justify-between items-center py-2">
					<span class="font-medium text-gray-700">数据分析:</span>
					<span>{getFeatureStatus(config.enableAnalytics)}</span>
				</div>
			</div>

			<div class="space-y-3">
				<div class="flex justify-between items-center py-2">
					<span class="font-medium text-gray-700">VConsole:</span>
					<span>{getFeatureStatus(config.enableVConsole)}</span>
				</div>
				<div class="flex justify-between items-center py-2">
					<span class="font-medium text-gray-700">开发工具:</span>
					<span>{getFeatureStatus(config.showDevTools)}</span>
				</div>
				<div class="flex justify-between items-center py-2">
					<span class="font-medium text-gray-700">PWA:</span>
					<span>{getFeatureStatus(config.enablePWA)}</span>
				</div>
			</div>
		</div>
	</div>

	<!-- 开发者信息 -->
	{#if config.developerMode}
		<div class="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg mb-6">
			<h2 class="text-xl font-semibold mb-4 flex items-center text-yellow-800">
				<span class="mr-2">🛠️</span>
				开发者模式信息
			</h2>

			<div class="space-y-2 text-yellow-700">
				<p><strong>日志级别:</strong> {config.logLevel}</p>
				<p><strong>详细日志:</strong> {config.detailedLogs ? '启用' : '禁用'}</p>
				<p><strong>性能监控:</strong> {config.performanceMonitor ? '启用' : '禁用'}</p>
				{#if config.localApiPort}
					<p><strong>本地 API 端口:</strong> {config.localApiPort}</p>
				{/if}
				{#if config.websocketPort}
					<p><strong>WebSocket 端口:</strong> {config.websocketPort}</p>
				{/if}
			</div>
		</div>
	{/if}

	<!-- 第三方服务 -->
	{#if config.sentryDsn || config.gaTrackingId}
		<div class="bg-white rounded-lg shadow-lg p-6 mb-6">
			<h2 class="text-xl font-semibold mb-4 flex items-center">
				<span class="mr-2">🔌</span>
				第三方服务
			</h2>

			<div class="space-y-3">
				{#if config.sentryDsn}
					<div class="flex justify-between items-center py-2 border-b border-gray-200">
						<span class="font-medium text-gray-700">Sentry:</span>
						<span class="text-green-600">✅ 已配置</span>
					</div>
				{/if}
				{#if config.gaTrackingId}
					<div class="flex justify-between items-center py-2">
						<span class="font-medium text-gray-700">Google Analytics:</span>
						<span class="text-green-600">✅ 已配置</span>
					</div>
				{/if}
			</div>
		</div>
	{/if}

	<!-- 使用说明 -->
	<div class="bg-gray-50 rounded-lg p-6">
		<h2 class="text-xl font-semibold mb-4 flex items-center">
			<span class="mr-2">📚</span>
			使用说明
		</h2>

		<div class="space-y-4 text-gray-700">
			<div>
				<h3 class="font-semibold mb-2">环境变量文件优先级：</h3>
				<ol class="list-decimal list-inside space-y-1 ml-4">
					<li>
						<code class="bg-gray-200 px-1 rounded">.env.local</code> - 本地覆盖（被 git 忽略）
					</li>
					<li><code class="bg-gray-200 px-1 rounded">.env.{mode}</code> - 特定环境配置</li>
					<li><code class="bg-gray-200 px-1 rounded">.env</code> - 默认配置</li>
				</ol>
			</div>

			<div>
				<h3 class="font-semibold mb-2">在代码中使用：</h3>
				<pre class="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto"><code
						>{`// 导入环境变量工具
import { config, env, isDev } from '$lib/utils/env';

// 获取解析后的配置
console.log(config.apiBaseUrl);
console.log(config.enableDebug);

// 使用环境工具方法
const customValue = env.getString('VITE_CUSTOM_KEY');
const port = env.getOptionalNumber('VITE_PORT', 3000);`}</code
					></pre>
			</div>
		</div>
	</div>
</div>

<style>
	code {
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
	}
</style>
