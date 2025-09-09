<script lang="ts">
	// 使用 @types 别名导入类型
	import type { Environment, LogLevel } from '@types';
	import { env } from '$lib/utils/env';

	// 类型测试
	let currentEnv: Environment = env.config.environment;
	let logLevel: LogLevel = env.config.logLevel;

	// 创建一个示例函数使用导入的类型
	function setEnvironment(newEnv: Environment) {
		currentEnv = newEnv;
	}

	function setLogLevel(level: LogLevel) {
		logLevel = level;
	}
</script>

<svelte:head>
	<title>@types 别名演示</title>
</svelte:head>

<div class="container mx-auto p-6">
	<h1 class="text-3xl font-bold mb-6">@types 别名使用演示</h1>

	<div class="bg-white shadow-lg rounded-lg p-6 mb-6">
		<h2 class="text-xl font-semibold mb-4">🎯 类型别名配置</h2>
		<div class="bg-gray-100 p-4 rounded-lg">
			<p class="text-sm text-gray-600 mb-2">
				现在可以使用 <code class="bg-gray-200 px-2 py-1 rounded">@types</code> 别名来导入类型定义：
			</p>
			<pre class="text-sm"><code
					>import type &#123; Environment, LogLevel &#125; from '@types';</code
				></pre>
		</div>
	</div>

	<div class="grid md:grid-cols-2 gap-6">
		<div class="bg-white shadow rounded-lg p-6">
			<h2 class="text-xl font-semibold mb-4">📦 当前环境信息</h2>
			<div class="space-y-2">
				<div class="flex justify-between">
					<span class="font-medium">环境类型:</span>
					<span class="text-blue-600">{currentEnv}</span>
				</div>
				<div class="flex justify-between">
					<span class="font-medium">日志级别:</span>
					<span class="text-green-600">{logLevel}</span>
				</div>
			</div>
		</div>

		<div class="bg-white shadow rounded-lg p-6">
			<h2 class="text-xl font-semibold mb-4">🔧 类型测试</h2>
			<div class="space-y-3">
				<div>
					<label for="env-select" class="block text-sm font-medium mb-1">设置环境:</label>
					<select
						id="env-select"
						bind:value={currentEnv}
						class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
					>
						<option value="development">Development</option>
						<option value="production">Production</option>
						<option value="test">Test</option>
					</select>
				</div>

				<div>
					<label for="log-select" class="block text-sm font-medium mb-1">设置日志级别:</label>
					<select
						id="log-select"
						bind:value={logLevel}
						class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
					>
						<option value="debug">Debug</option>
						<option value="info">Info</option>
						<option value="warn">Warn</option>
						<option value="error">Error</option>
					</select>
				</div>
			</div>
		</div>
	</div>

	<div class="bg-white shadow rounded-lg p-6 mt-6">
		<h2 class="text-xl font-semibold mb-4">📁 支持的导入方式</h2>
		<div class="grid md:grid-cols-2 gap-4 text-sm">
			<div>
				<h3 class="font-semibold mb-2 text-green-600">✅ 推荐用法:</h3>
				<pre class="bg-gray-100 p-2 rounded"><code
						>import type &#123; Environment &#125; from '@types';
import type &#123; LogLevel &#125; from '@types';
import type &#123; EnvironmentVariables &#125; from '@types';</code
					></pre>
			</div>

			<div>
				<h3 class="font-semibold mb-2 text-blue-600">🔧 具体文件导入:</h3>
				<pre class="bg-gray-100 p-2 rounded"><code
						>import type &#123; Environment &#125; from '@types/env.d';
// 注意: .d.ts 文件需要省略 .ts 扩展名</code
					></pre>
			</div>
		</div>
	</div>

	<div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
		<h3 class="font-semibold text-blue-800 mb-2">💡 配置说明</h3>
		<ul class="text-blue-700 text-sm space-y-1">
			<li>
				• <strong>Vite 别名:</strong> <code>vite.config.ts</code> 中配置了 <code>@types</code> 路径映射
			</li>
			<li>• <strong>SvelteKit 别名:</strong> <code>svelte.config.js</code> 中配置了相应别名</li>
			<li>• <strong>TypeScript 支持:</strong> <code>tsconfig.json</code> 中添加了路径映射</li>
			<li>• <strong>统一导出:</strong> 通过 <code>types/index.ts</code> 统一导出所有类型</li>
		</ul>
	</div>
</div>
