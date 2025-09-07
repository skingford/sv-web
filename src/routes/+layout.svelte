<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/styles/global.scss';

	let { children } = $props();

	$effect(() => {
		// 确保在浏览器环境中
		if (typeof window === 'undefined') return;

		// 动态导入rem-adapter，只在客户端运行
		import('$lib/utils/rem-adapter').then(({ default: remAdapter }) => {
			// 监听自定义事件
			const handleRemResize = (event: CustomEvent) => {
				console.log('Rem resize:', event.detail);
			};

			window.addEventListener('remResize', handleRemResize as EventListener);

			// 返回清理函数在effect销毁时执行
			return () => {
				window.removeEventListener('remResize', handleRemResize as EventListener);
			};
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav>
	<a href="/">Home</a>
	<a href="/about">About</a>
	<a href="/blog">Blog</a>
	<a href="/responsive-demo">响应式演示</a>
	<a href="/settings">Settings</a>
</nav>

<main class="container">
	{@render children?.()}
</main>

<style lang="scss">
	@use 'sass:color';
	@use '$lib/styles/variables.scss' as *;

	nav {
		background-color: $primary-color;
		padding: 1rem 2rem;
		display: flex;
		gap: 2rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

		a {
			color: white;
			text-decoration: none;
			font-weight: 500;
			padding: 0.5rem 1rem;
			border-radius: $border-radius;
			transition: background-color $transition-duration ease;

			&:hover {
				background-color: color.adjust($primary-color, $lightness: -15%);
			}

			&:active {
				background-color: color.adjust($primary-color, $lightness: -20%);
			}
		}
	}

	main {
		padding-top: 2rem;
		padding-bottom: 2rem;
	}
</style>
