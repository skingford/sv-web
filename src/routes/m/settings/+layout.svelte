<script lang="ts">
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
</script>

<h1>Settings</h1>

<div class="submenu">
	{#each data.sections as section}
		<div>
			<a href="/settings/{section.slug}">{section.title}</a>
		</div>
	{/each}
</div>

{@render children()}
