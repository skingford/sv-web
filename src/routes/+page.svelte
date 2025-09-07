<div class="card text-center">
	<h1>Welcome to SvelteKit</h1>
	<p class="mb-3">Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
	
	<div class="button-group">
		<button class="btn">Primary Button</button>
		<button class="btn-secondary">Secondary Button</button>
		<button class="btn-success">Success Button</button>
	</div>
</div>

<style lang="scss">
	@use 'sass:color';
	@use '$lib/styles/global.scss' as *;

	h1 {
		color: $primary-color;
		font-size: 2.5rem;
		font-weight: bold;
		margin-bottom: 1rem;
		
		&:hover {
			color: color.adjust($primary-color, $lightness: -10%);
			transition: color $transition-duration ease;
		}
	}

	p {
		color: $secondary-color;
		line-height: 1.6;
		
		a {
			color: $primary-color;
			text-decoration: none;
			border-radius: $border-radius;
			padding: 0.2rem 0.4rem;
			
			&:hover {
				background-color: color.adjust($primary-color, $lightness: 45%);
				transition: background-color $transition-duration ease;
			}
		}
	}

	.button-group {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
		
		@include respond-to('mobile') {
			flex-direction: row;
		}
	}
</style>
