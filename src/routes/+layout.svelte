<script lang="ts">
	import '../app.css';
	import '$lib/styles/globals.scss';
	import favicon from '$lib/assets/favicon.svg';
	import { initAuth } from '$lib/stores/auth';
	import type { LayoutData } from './$types';

	let { children, data }: { children: any; data: LayoutData } = $props();

	// Initialize auth store with user data from locals
	$effect(() => {
		if (data) {
			initAuth(data.user || null);
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<script src="/font-adapter-sync.js"></script>
</svelte:head>

{@render children?.()}
