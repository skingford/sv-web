<script lang="ts">
	interface Props {
		adjective?: string;
		ondecrement?: () => void;
		onincrement?: () => void;
	}

	let { adjective = 'awesome', ondecrement, onincrement }: Props = $props();

	function handleDecrement() {
		ondecrement?.();
	}

	function handleIncrement() {
		onincrement?.();
	}
</script>

<div class="blog-card">
	<p>this component is {adjective}</p>
	<div class="button-group">
		<button onclick={handleDecrement} class="btn-secondary">decrement</button>
		<button onclick={handleIncrement} class="btn">increment</button>
	</div>
</div>

<style lang="scss">
	@use '$lib/styles/global.scss' as *;

	.blog-card {
		@include card-style();
		text-align: center;
		max-width: 300px;
		margin: 1rem;

		p {
			margin-bottom: 1rem;
			color: $secondary-color;
			font-size: 1.1rem;
		}

		.button-group {
			display: flex;
			gap: 0.5rem;
			justify-content: center;
		}
	}
</style>
