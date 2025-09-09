<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1>account: {data.id}</h1>
<p>当前动态参数 id 的值是: <strong>{data.id}</strong></p>
