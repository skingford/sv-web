<script>
	let count = $state(0);
	let milliseconds = $state(1000);

	$effect(() => {
		const interval = setInterval(() => {
			count += 1;
		}, milliseconds);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<h1>{count}</h1>

<button onclick={() => (milliseconds *= 2)}>slower</button>
<button onclick={() => (milliseconds /= 2)}>faster</button>
