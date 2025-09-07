<script lang="ts">
	import BlogCard from '$lib/components/blog_card.svelte';

	let count = $state(0);
</script>

<h1>blog {count}</h1>
<BlogCard adjective="awesome" ondecrement={() => (count -= 1)} onincrement={() => (count += 1)} />
<BlogCard adjective="fantastic" />
<BlogCard adjective="amazing" />
<BlogCard adjective="incredible" />
<BlogCard adjective="wonderful" />
<BlogCard adjective="awesome" />
<BlogCard adjective="fantastic" />
<BlogCard adjective="amazing" />
<BlogCard adjective="incredible" />
<BlogCard adjective="wonderful" />
