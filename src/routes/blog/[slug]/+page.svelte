<script lang="ts">
import type { PageData } from './$types';

export let data: PageData;
</script>

<h1>博客文章: {data.slug}</h1>
<p>当前动态参数 slug 的值是: <strong>{data.slug}</strong></p>
