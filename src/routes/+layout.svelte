<script lang="ts">
	import 'normalize.css';
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/styles/global.scss';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav>
	<a href="/">Home</a>
	<a href="/about">About</a>
	<a href="/settings">Settings</a>
	<a href="/blog">Blog</a>
</nav>

<main class="container">
	{@render children?.()}
</main>

<style lang="scss">
	@use 'sass:color';
	@use '$lib/styles/global.scss' as *;

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
