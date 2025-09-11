<script lang="ts">
	import AppHeader from '$lib/components/AppHeader.svelte';
	const { children } = $props();
</script>

<AppHeader />
<main class="flex">
	<aside>left menu</aside>
	<section class="flex-1">
		{@render children?.()}
	</section>
</main>
