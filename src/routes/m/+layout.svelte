<script lang="ts">
	import AppHeader from '$lib/components/AppHeader.svelte';
	let { children } = $props();
</script>

<AppHeader />
<main class="container">
	{@render children?.()}
</main>
