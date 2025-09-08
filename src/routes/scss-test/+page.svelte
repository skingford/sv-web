<svelte:head>
	<title>SCSS 自动导入测试</title>
</svelte:head>

<div class="container">
	<h1>🎨 SCSS 变量自动导入测试</h1>

	<div class="info-section">
		<h2>📋 测试说明</h2>
		<p>这个页面用来验证 Vite CSS 配置是否正确自动导入了 SCSS 变量文件。</p>
		<p>如果变量正确导入，下面的元素应该显示为预定义的颜色。</p>
	</div>

	<div class="color-demo">
		<h2>🌈 颜色变量测试</h2>
		<div class="color-grid">
			<div class="color-card primary">
				<h3>Primary Color</h3>
				<p>$primary-color</p>
			</div>
			<div class="color-card secondary">
				<h3>Secondary Color</h3>
				<p>$secondary-color</p>
			</div>
			<div class="color-card success">
				<h3>Success Color</h3>
				<p>$success-color</p>
			</div>
			<div class="color-card warning">
				<h3>Warning Color</h3>
				<p>$warning-color</p>
			</div>
		</div>
	</div>

	<div class="button-demo">
		<h2>🔘 按钮 Mixin 测试</h2>
		<div class="button-grid">
			<button class="btn-primary">Primary Button</button>
			<button class="btn-secondary">Secondary Button</button>
			<button class="btn-success">Success Button</button>
		</div>
	</div>

	<div class="layout-demo">
		<h2>📐 布局变量测试</h2>
		<div class="card-demo">
			<div class="demo-card">
				<h4>示例卡片</h4>
				<p>使用 $border-radius 和其他布局变量</p>
			</div>
		</div>
	</div>

	<div class="status-section">
		<h2>✅ 测试结果</h2>
		<p>如果上面的元素正确显示了颜色和样式，说明 SCSS 变量自动导入功能正常工作！</p>
		<div class="result-indicator">🎉 SCSS 变量自动导入成功！</div>
	</div>
</div>

<style lang="scss">
	@use 'sass:color';

	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
	}

	h1 {
		text-align: center;
		color: $primary-color; // 使用变量
		margin-bottom: 2rem;
	}

	.info-section {
		background: #f8f9fa;
		padding: 1.5rem;
		border-radius: $border-radius; // 使用变量
		margin-bottom: 2rem;
		border-left: 4px solid $primary-color; // 使用变量
	}

	.color-demo {
		margin: 2rem 0;
	}

	.color-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
		margin-top: 1rem;
	}

	.color-card {
		padding: 1.5rem;
		border-radius: $border-radius; // 使用变量
		color: white;
		text-align: center;

		&.primary {
			background-color: $primary-color; // 使用变量
		}

		&.secondary {
			background-color: $secondary-color; // 使用变量
		}

		&.success {
			background-color: $success-color; // 使用变量
		}

		&.warning {
			background-color: $warning-color; // 使用变量
		}

		h3 {
			margin: 0 0 0.5rem 0;
			font-size: 1.2rem;
		}

		p {
			margin: 0;
			font-family: monospace;
			opacity: 0.9;
		}
	}

	.button-demo {
		margin: 2rem 0;
	}

	.button-grid {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		margin-top: 1rem;
	}

	.btn-primary {
		@include button-style($primary-color); // 使用 mixin 和变量
	}

	.btn-secondary {
		@include button-style($secondary-color); // 使用 mixin 和变量
	}

	.btn-success {
		@include button-style($success-color); // 使用 mixin 和变量
	}

	.layout-demo {
		margin: 2rem 0;
	}

	.card-demo {
		margin-top: 1rem;
	}

	.demo-card {
		@include card-style(); // 使用 mixin
		background: white;
		border: 1px solid color.adjust($secondary-color, $lightness: 30%); // 使用变量和现代 SCSS 函数

		h4 {
			margin: 0 0 0.5rem 0;
			color: $primary-color; // 使用变量
		}

		p {
			margin: 0;
			color: $secondary-color; // 使用变量
		}
	}

	.status-section {
		margin: 3rem 0 2rem 0;
		text-align: center;
	}

	.result-indicator {
		background: linear-gradient(
			135deg,
			$success-color,
			color.adjust($success-color, $lightness: 10%)
		); // 使用变量
		color: white;
		padding: 1rem 2rem;
		border-radius: $border-radius; // 使用变量
		font-size: 1.2rem;
		font-weight: 500;
		margin: 1rem 0;
		display: inline-block;
	}
</style>
