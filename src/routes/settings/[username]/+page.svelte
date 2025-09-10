<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1>博客文章: {data.username}</h1>
<p>当前动态参数 username 的值是: <strong>{data.username}</strong></p>
