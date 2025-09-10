<script lang="ts">
	import '../app.css';
	import '$lib/styles/globals.scss';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<script src="/font-adapter-sync.js"></script>
</svelte:head>

{@render children?.()}
