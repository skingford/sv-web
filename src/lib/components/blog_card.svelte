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
	@use '$lib/styles/variables.scss' as *;

	.blog-card {
		@include card-style();
		text-align: center;
		max-width: 300px; // PostCSS会将这些px转换为rem
		margin: 16px; // 等效于1rem
		transition: transform $transition-duration ease;

		&:hover {
			transform: translateY(-4px); // 悬停效果
		}

		p {
			margin-bottom: 16px; // 等效于1rem
			color: $secondary-color;
			font-size: 18px; // 会被转换为1.125rem
		}

		.button-group {
			display: flex;
			gap: 8px; // 会被转换为0.5rem
			justify-content: center;
			flex-wrap: wrap; // 响应式换行
		}
	}

	// 响应式适配
	@include respond-to('mobile') {
		.blog-card {
			max-width: 280px;
			margin: 12px;

			p {
				font-size: 16px;
			}
		}
	}

	@include respond-to('tablet') {
		.blog-card {
			max-width: 320px;
			margin: 20px;
		}
	}
</style>
