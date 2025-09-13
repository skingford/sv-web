<script>
	import { localCache } from '$lib/utils/cache/index';

	localCache.set(
		'test',
		{
			name: 'test',
			age: 18
		},
		{
			ttl: 1 // 1 minute
		}
	);

	const test = localCache.get('test');

	console.log('get cache data', test);
</script>

<h1>home</h1>
<nav>
	<a href="/">Home</a>
	<a href="/m/settings/profile">profile</a>
	<a href="/signup">signup</a>
	<a href="/login">login</a>
</nav>
