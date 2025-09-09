<div class="hero-section">
	<div class="hero-content">
		<h1>欢迎使用 GitHub 风格的应用头部</h1>
		<p class="hero-description">
			这是一个现代化的、响应式的应用头部组件，模仿了 GitHub 的设计风格。
			包含搜索功能、用户菜单、通知系统和移动端适配。
		</p>

		<div class="feature-grid">
			<div class="feature-card">
				<div class="feature-icon">🔍</div>
				<h3>智能搜索</h3>
				<p>支持快速搜索和跳转功能</p>
			</div>

			<div class="feature-card">
				<div class="feature-icon">📱</div>
				<h3>响应式设计</h3>
				<p>完美适配桌面端和移动端</p>
			</div>

			<div class="feature-card">
				<div class="feature-icon">👤</div>
				<h3>用户中心</h3>
				<p>完整的用户菜单和个人资料管理</p>
			</div>

			<div class="feature-card">
				<div class="feature-icon">🔔</div>
				<h3>通知系统</h3>
				<p>实时通知和消息提醒</p>
			</div>
		</div>

		<div class="cta-section">
			<button class="btn-primary">开始使用</button>
			<button class="btn-secondary">了解更多</button>
		</div>
	</div>
</div>

<style lang="scss">
	@use 'sass:color';
	@use '$lib/styles/variables.scss' as *;

	.hero-section {
		padding: 4rem 2rem;
		background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
		min-height: calc(100vh - 4rem);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.hero-content {
		max-width: 1200px;
		text-align: center;
		width: 100%;
	}

	h1 {
		color: $primary-color;
		font-size: 3rem;
		font-weight: bold;
		margin-bottom: 1.5rem;
		line-height: 1.2;

		@include respond-to('mobile') {
			font-size: 2rem;
		}
	}

	.hero-description {
		color: $secondary-color;
		font-size: 1.25rem;
		line-height: 1.6;
		margin-bottom: 3rem;
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;

		@include respond-to('mobile') {
			font-size: 1rem;
			margin-bottom: 2rem;
		}
	}

	.feature-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 2rem;
		margin-bottom: 3rem;

		@include respond-to('mobile') {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}
	}

	.feature-card {
		@include card-style(2rem);
		text-align: center;
		transition: transform $transition-duration ease;

		&:hover {
			transform: translateY(-4px);
		}
	}

	.feature-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.feature-card h3 {
		color: $primary-color;
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	.feature-card p {
		color: $secondary-color;
		font-size: 0.95rem;
		line-height: 1.5;
	}

	.cta-section {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.btn-primary {
		@include button-style($primary-color, white);
		font-size: 1.1rem;
		padding: 1rem 2rem;
	}

	.btn-secondary {
		@include button-style(transparent, $primary-color);
		border: 2px solid $primary-color;
		font-size: 1.1rem;
		padding: 1rem 2rem;

		&:hover {
			background-color: $primary-color;
			color: white;
		}
	}
</style>
