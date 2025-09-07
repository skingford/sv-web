<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/styles/global.scss';

	let { children } = $props();

	$effect(() => {
		// 确保在浏览器环境中
		if (typeof window === 'undefined') return;

		// 延迟加载简化版字体适配器
		const animationId = requestAnimationFrame(() => {
			import('$lib/utils/font-adapter').then(({ initFontAdapter }) => {
				// 初始化字体适配器，返回清理函数
				const cleanup = initFontAdapter();

				// 监听字体变化事件（可选，用于调试）
				const handleFontResize = (event: CustomEvent) => {
					if (import.meta.env.DEV) {
						console.log('Font resize:', event.detail);
					}
				};

				window.addEventListener('fontResize', handleFontResize as EventListener);

				// 组件销毁时清理
				return () => {
					cleanup();
					window.removeEventListener('fontResize', handleFontResize as EventListener);
				};
			});
		});

		return () => {
			cancelAnimationFrame(animationId);
		};
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
	<a href="/font-test">字体测试</a>
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
