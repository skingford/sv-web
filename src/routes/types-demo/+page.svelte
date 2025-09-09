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
	<h1 class="mb-6 text-3xl font-bold">@types 别名使用演示</h1>

	<div class="mb-6 rounded-lg bg-white p-6 shadow-lg">
		<h2 class="mb-4 text-xl font-semibold">🎯 类型别名配置</h2>
		<div class="rounded-lg bg-gray-100 p-4">
			<p class="mb-2 text-sm text-gray-600">
				现在可以使用 <code class="rounded bg-gray-200 px-2 py-1">@types</code> 别名来导入类型定义：
			</p>
			<pre class="text-sm"><code
					>import type &#123; Environment, LogLevel &#125; from '@types';</code
				></pre>
		</div>
	</div>

	<div class="grid gap-6 md:grid-cols-2">
		<div class="rounded-lg bg-white p-6 shadow">
			<h2 class="mb-4 text-xl font-semibold">📦 当前环境信息</h2>
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

		<div class="rounded-lg bg-white p-6 shadow">
			<h2 class="mb-4 text-xl font-semibold">🔧 类型测试</h2>
			<div class="space-y-3">
				<div>
					<label for="env-select" class="mb-1 block text-sm font-medium">设置环境:</label>
					<select
						id="env-select"
						bind:value={currentEnv}
						class="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
					>
						<option value="development">Development</option>
						<option value="production">Production</option>
						<option value="test">Test</option>
					</select>
				</div>

				<div>
					<label for="log-select" class="mb-1 block text-sm font-medium">设置日志级别:</label>
					<select
						id="log-select"
						bind:value={logLevel}
						class="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
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

	<div class="mt-6 rounded-lg bg-white p-6 shadow">
		<h2 class="mb-4 text-xl font-semibold">📁 支持的导入方式</h2>
		<div class="grid gap-4 text-sm md:grid-cols-2">
			<div>
				<h3 class="mb-2 font-semibold text-green-600">✅ 推荐用法:</h3>
				<pre class="rounded bg-gray-100 p-2"><code
						>import type &#123; Environment &#125; from '@types';
import type &#123; LogLevel &#125; from '@types';
import type &#123; EnvironmentVariables &#125; from '@types';</code
					></pre>
			</div>

			<div>
				<h3 class="mb-2 font-semibold text-blue-600">🔧 具体文件导入:</h3>
				<pre class="rounded bg-gray-100 p-2"><code
						>import type &#123; Environment &#125; from '@types/env.d';
// 注意: .d.ts 文件需要省略 .ts 扩展名</code
					></pre>
			</div>
		</div>
	</div>

	<div class="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
		<h3 class="mb-2 font-semibold text-blue-800">💡 配置说明</h3>
		<ul class="space-y-1 text-sm text-blue-700">
			<li>
				• <strong>Vite 别名:</strong> <code>vite.config.ts</code> 中配置了 <code>@types</code> 路径映射
			</li>
			<li>• <strong>SvelteKit 别名:</strong> <code>svelte.config.js</code> 中配置了相应别名</li>
			<li>• <strong>TypeScript 支持:</strong> <code>tsconfig.json</code> 中添加了路径映射</li>
			<li>• <strong>统一导出:</strong> 通过 <code>types/index.ts</code> 统一导出所有类型</li>
		</ul>
	</div>
</div>
