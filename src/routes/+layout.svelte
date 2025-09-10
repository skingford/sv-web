<script lang="ts">
	import 'normalize.css';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<script src="/font-adapter-sync.js"></script>
</svelte:head>

{@render children?.()}
