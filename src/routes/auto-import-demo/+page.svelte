<script lang="ts">
	// 🎉 这些 API 都是通过 unplugin-auto-import 自动引入的，无需手动 import！
	// - onMount, onDestroy (生命周期)
	// - $state, $derived, $effect ($props, $bindable - Svelte 5 runes)
	// - writable, readable, derived, get (stores)
	// - createEventDispatcher, setContext, getContext (工具函数)

	// Svelte 5 runes 示例
	let count = $state(0);
	let doubled = $derived(count * 2);

	// Store 示例
	const message = writable('Hello from auto-import!');
	const uppercaseMessage = derived(message, ($msg) => $msg.toUpperCase());

	// 生命周期示例
	onMount(() => {
		console.log('🚀 组件已挂载 - onMount 自动引入成功！');

		// 测试 tick 函数
		tick().then(() => {
			console.log('✅ tick() 执行完成');
		});

		return () => {
			console.log('🧹 组件清理函数');
		};
	});

	onDestroy(() => {
		console.log('💀 组件即将销毁 - onDestroy 自动引入成功！');
	});

	// 事件派发示例
	const dispatch = createEventDispatcher<{
		increment: { value: number };
		decrement: { value: number };
	}>();

	// Context 示例
	setContext('demo-context', {
		name: 'Auto Import Demo',
		version: '1.0.0'
	});

	function increment() {
		count++;
		dispatch('increment', { value: count });
	}

	function decrement() {
		count--;
		dispatch('decrement', { value: count });
	}

	function updateMessage() {
		$message = `Updated at ${new Date().toLocaleTimeString()}`;
	}

	// Effect 示例
	$effect(() => {
		console.log(`计数器变化: ${count}, 双倍值: ${doubled}`);
	});
</script>

<svelte:head>
	<title>Auto Import 演示</title>
</svelte:head>

<div class="container">
	<h1>🎯 unplugin-auto-import 演示</h1>

	<div class="intro">
		<p>
			这个页面演示了如何使用 <code>unplugin-auto-import</code> 自动引入 Svelte API，无需手动
			<code>import</code>！
		</p>
	</div>

	<div class="demo-section">
		<h2>🔢 Svelte 5 Runes ($state, $derived, $effect)</h2>
		<div class="runes-demo">
			<div class="counter">
				<button onclick={decrement}>-</button>
				<span class="count">{count}</span>
				<button onclick={increment}>+</button>
			</div>
			<p>双倍值 (derived): <strong>{doubled}</strong></p>
			<p class="note">💡 打开控制台查看 $effect 的日志输出</p>
		</div>
	</div>

	<div class="demo-section">
		<h2>📦 Svelte Stores (writable, derived)</h2>
		<div class="stores-demo">
			<p>原始消息: <code>{$message}</code></p>
			<p>大写消息: <code>{$uppercaseMessage}</code></p>
			<button onclick={updateMessage} class="btn">更新消息</button>
		</div>
	</div>

	<div class="demo-section">
		<h2>🔄 生命周期 (onMount, onDestroy)</h2>
		<div class="lifecycle-demo">
			<p>✅ onMount 已执行</p>
			<p>✅ onDestroy 已注册</p>
			<p class="note">💡 查看控制台日志或导航到其他页面查看生命周期</p>
		</div>
	</div>

	<div class="demo-section">
		<h2>📡 事件派发 (createEventDispatcher)</h2>
		<div class="events-demo">
			<p>每次点击计数器按钮都会派发自定义事件</p>
			<p class="note">💡 打开开发者工具查看事件派发</p>
		</div>
	</div>

	<div class="auto-imported-apis">
		<h2>📚 自动引入的 API 列表</h2>
		<div class="api-grid">
			<div class="api-category">
				<h3>生命周期</h3>
				<ul>
					<li>onMount</li>
					<li>onDestroy</li>
					<li>beforeUpdate</li>
					<li>afterUpdate</li>
					<li>tick</li>
				</ul>
			</div>
			<div class="api-category">
				<h3>Svelte 5 Runes</h3>
				<ul>
					<li>$state</li>
					<li>$derived</li>
					<li>$effect</li>
					<li>$props</li>
					<li>$bindable</li>
				</ul>
			</div>
			<div class="api-category">
				<h3>Stores</h3>
				<ul>
					<li>writable</li>
					<li>readable</li>
					<li>derived</li>
					<li>get</li>
				</ul>
			</div>
			<div class="api-category">
				<h3>工具函数</h3>
				<ul>
					<li>createEventDispatcher</li>
					<li>setContext</li>
					<li>getContext</li>
					<li>hasContext</li>
					<li>getAllContexts</li>
				</ul>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.container {
		max-width: 900px;
		margin: 0 auto;
		padding: 2rem;
		line-height: 1.6;
	}

	h1 {
		text-align: center;
		color: #ff3e00;
		margin-bottom: 2rem;
	}

	.intro {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 1.5rem;
		border-radius: 12px;
		margin-bottom: 2rem;

		code {
			background: rgba(255, 255, 255, 0.2);
			padding: 0.2rem 0.4rem;
			border-radius: 4px;
			font-weight: 600;
		}
	}

	.demo-section {
		background: white;
		border: 1px solid #e1e5e9;
		border-radius: 12px;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

		h2 {
			margin-top: 0;
			color: #333;
			border-bottom: 2px solid #ff3e00;
			padding-bottom: 0.5rem;
		}
	}

	.runes-demo {
		.counter {
			display: flex;
			align-items: center;
			gap: 1rem;
			margin-bottom: 1rem;

			button {
				background: #ff3e00;
				color: white;
				border: none;
				width: 40px;
				height: 40px;
				border-radius: 50%;
				font-size: 1.2rem;
				font-weight: bold;
				cursor: pointer;
				transition: all 0.2s;

				&:hover {
					background: #e63946;
					transform: scale(1.1);
				}
			}

			.count {
				font-size: 2rem;
				font-weight: bold;
				color: #333;
				min-width: 3rem;
				text-align: center;
			}
		}
	}

	.stores-demo {
		code {
			background: #f8f9fa;
			padding: 0.3rem 0.6rem;
			border-radius: 4px;
			border: 1px solid #dee2e6;
		}
	}

	.btn {
		background: #28a745;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 6px;
		cursor: pointer;
		font-weight: 500;
		transition: background 0.2s;

		&:hover {
			background: #218838;
		}
	}

	.note {
		font-style: italic;
		color: #6c757d;
		font-size: 0.9rem;
	}

	.auto-imported-apis {
		background: #f8f9fa;
		border: 1px solid #dee2e6;
		border-radius: 12px;
		padding: 1.5rem;
		margin-top: 2rem;

		h2 {
			margin-top: 0;
			color: #495057;
		}

		.api-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
			gap: 1.5rem;
			margin-top: 1rem;
		}

		.api-category {
			h3 {
				color: #ff3e00;
				margin-bottom: 0.5rem;
				font-size: 1.1rem;
			}

			ul {
				list-style: none;
				padding: 0;
				margin: 0;

				li {
					background: white;
					padding: 0.5rem;
					margin: 0.3rem 0;
					border-radius: 4px;
					border-left: 3px solid #ff3e00;
					font-family: 'Monaco', 'Menlo', monospace;
					font-size: 0.9rem;
				}
			}
		}
	}
</style>
