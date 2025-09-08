<script lang="ts">
	import { onMount } from 'svelte';

	// 测试虚拟模块是否可用
	let status = '检测中...';
	let config: any = null;
	let currentFontSize = '未知';
</script>

<svelte:head>
	<title>字体适配测试页面</title>
</svelte:head>

<div class="container">
	<h1>🔧 字体适配 Vite 插件测试</h1>

	<div class="info-card">
		<h2>📊 插件状态</h2>
		<p><strong>状态：</strong>{status}</p>
		<p><strong>当前根字体大小：</strong>{currentFontSize}</p>
		<p><strong>窗口宽度：</strong>{typeof window !== 'undefined' ? window.innerWidth : 0}px</p>
	</div>

	{#if config}
		<div class="info-card">
			<h2>⚙️ 插件配置</h2>
			<pre>{JSON.stringify(config, null, 2)}</pre>
		</div>
	{/if}

	<div class="test-area">
		<h2>📏 字体大小测试</h2>
		<div class="size-demos">
			<div class="demo size-1">1rem 字体（应该跟随根字体变化）</div>
			<div class="demo size-1-5">1.5rem 字体</div>
			<div class="demo size-2">2rem 字体</div>
		</div>
	</div>

	<div class="instructions">
		<h2>📱 测试说明</h2>
		<ol>
			<li>调整浏览器窗口宽度，观察字体大小变化</li>
			<li>查看浏览器控制台日志</li>
			<li>检查根字体大小是否在 12px-20px 范围内</li>
		</ol>
	</div>
</div>

<style lang="scss">
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
	}

	h1 {
		text-align: center;
		color: #333;
		margin-bottom: 2rem;
	}

	.info-card {
		background: #f8f9fa;
		border: 1px solid #dee2e6;
		border-radius: 8px;
		padding: 1.5rem;
		margin-bottom: 1.5rem;

		h2 {
			margin-top: 0;
			color: #495057;
		}

		pre {
			background: #e9ecef;
			padding: 1rem;
			border-radius: 4px;
			overflow-x: auto;
			font-size: 0.875rem;
		}
	}

	.test-area {
		margin: 2rem 0;
	}

	.size-demos {
		display: grid;
		gap: 1rem;
		margin-top: 1rem;
	}

	.demo {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 1rem;
		border-radius: 8px;
		text-align: center;
		font-weight: 500;

		&.size-1 {
			font-size: 1rem;
		}
		&.size-1-5 {
			font-size: 1.5rem;
		}
		&.size-2 {
			font-size: 2rem;
		}
	}

	.instructions {
		background: #e3f2fd;
		border: 1px solid #2196f3;
		border-radius: 8px;
		padding: 1.5rem;

		h2 {
			margin-top: 0;
			color: #1976d2;
		}

		ol {
			margin: 0;
			padding-left: 1.5rem;

			li {
				margin: 0.5rem 0;
				line-height: 1.6;
			}
		}
	}
</style>
