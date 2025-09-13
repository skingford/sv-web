<script>
	import { cache } from '$lib/utils/cache/index';

	cache.set(
		'test',
		{
			name: 'test',
			age: 18
		},
		{
			ttl: 1000 * 60 // 1 minute
		}
	);

	const test = cache.get('test');

	console.log('test', test);
</script>

<h1>home</h1>
<nav>
	<a href="/">Home</a>
	<a href="/m/settings/profile">profile</a>
	<a href="/signup">signup</a>
	<a href="/login">login</a>
</nav>
