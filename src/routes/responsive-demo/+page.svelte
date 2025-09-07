<script lang="ts">
	let screenInfo = $state({
		clientWidth: 0,
		rootFontSize: 0,
		scale: 0
	});

	// 简单的px转rem函数，用于显示
	const pxToRem = (px: number) => `${(px / 16).toFixed(3)}rem`;

	// 获取当前根字体大小
	const getRootFontSize = () => {
		if (typeof window === 'undefined' || typeof document === 'undefined') return 16;
		return parseFloat(getComputedStyle(document.documentElement).fontSize);
	};

	// 更新屏幕信息
	const updateScreenInfo = () => {
		if (typeof window === 'undefined' || typeof document === 'undefined') return;

		screenInfo = {
			clientWidth: document.documentElement.clientWidth || window.innerWidth,
			rootFontSize: getRootFontSize(),
			scale: (document.documentElement.clientWidth || window.innerWidth) / 375
		};
	};

	$effect(() => {
		if (typeof window === 'undefined') return;

		// 初始化屏幕信息
		updateScreenInfo();

		// 监听rem变化事件（由layout中的rem-adapter触发）
		const handleRemResize = (event: CustomEvent) => {
			screenInfo = {
				clientWidth: event.detail.clientWidth,
				rootFontSize: event.detail.rootFontSize,
				scale: event.detail.scale
			};
		};

		// 监听窗口大小变化
		const handleResize = () => {
			updateScreenInfo();
		};

		window.addEventListener('remResize', handleRemResize as EventListener);
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('remResize', handleRemResize as EventListener);
			window.removeEventListener('resize', handleResize);
		};
	});
</script>

<svelte:head>
	<title>Rem响应式适配演示</title>
</svelte:head>

<div class="demo-container">
	<h1 class="font-3xl text-center">Rem响应式适配演示</h1>

	<!-- 屏幕信息 -->
	<div class="info-card card m-lg">
		<h2 class="font-xl">屏幕信息</h2>
		<div class="info-grid">
			<div class="info-item">
				<span class="label">屏幕宽度:</span>
				<span class="value">{screenInfo.clientWidth}px</span>
			</div>
			<div class="info-item">
				<span class="label">根字体大小:</span>
				<span class="value">{screenInfo.rootFontSize.toFixed(2)}px</span>
			</div>
			<div class="info-item">
				<span class="label">缩放比例:</span>
				<span class="value">{screenInfo.scale.toFixed(3)}</span>
			</div>
		</div>
	</div>

	<!-- 字体大小演示 -->
	<div class="font-demo card m-lg">
		<h2 class="font-xl">字体大小演示</h2>
		<div class="font-samples">
			<p class="font-xs">超小字体 (12px → {pxToRem(12)})</p>
			<p class="font-sm">小字体 (14px → {pxToRem(14)})</p>
			<p class="font-base">基础字体 (16px → {pxToRem(16)})</p>
			<p class="font-lg">大字体 (18px → {pxToRem(18)})</p>
			<p class="font-xl">超大字体 (20px → {pxToRem(20)})</p>
			<p class="font-2xl">特大字体 (24px → {pxToRem(24)})</p>
			<p class="font-3xl">巨大字体 (30px → {pxToRem(30)})</p>
		</div>
	</div>

	<!-- 间距演示 -->
	<div class="spacing-demo card m-lg">
		<h2 class="font-xl">间距演示</h2>
		<div class="spacing-samples">
			<div class="spacing-item p-xs">超小间距 (4px)</div>
			<div class="spacing-item p-sm">小间距 (8px)</div>
			<div class="spacing-item p-base">基础间距 (12px)</div>
			<div class="spacing-item p-lg">大间距 (16px)</div>
			<div class="spacing-item p-xl">超大间距 (24px)</div>
		</div>
	</div>

	<!-- 组件演示 -->
	<div class="component-demo card m-lg">
		<h2 class="font-xl">组件演示</h2>
		<div class="flex flex-wrap items-center justify-center" style="gap: 16px;">
			<button class="btn">主要按钮</button>
			<button class="btn-secondary">次要按钮</button>
			<button class="btn-success">成功按钮</button>
		</div>
	</div>

	<!-- 响应式显示演示 -->
	<div class="responsive-demo card m-lg">
		<h2 class="font-xl">响应式显示演示</h2>
		<div class="responsive-content">
			<div class="hidden-mobile block-tablet">
				<p class="font-lg">📱 在移动设备上隐藏，平板及以上显示</p>
			</div>
			<div class="block-mobile hidden-tablet">
				<p class="font-lg">💻 在移动设备上显示，平板及以上隐藏</p>
			</div>
			<div class="hidden-desktop">
				<p class="font-lg">🖥️ 在桌面设备上隐藏</p>
			</div>
		</div>
	</div>

	<!-- 使用说明 -->
	<div class="instructions card m-lg">
		<h2 class="font-xl">使用说明</h2>
		<ul class="instruction-list">
			<li>调整浏览器窗口大小观察适配效果</li>
			<li>在移动设备上查看真实效果</li>
			<li>根字体大小会根据屏幕宽度自动调整</li>
			<li>所有使用px的样式会自动转换为rem</li>
			<li>最小字体大小12px，最大20px</li>
		</ul>
	</div>
</div>

<style lang="scss">
	// 不导入全局样式，避免未使用CSS选择器警告
	// 只使用组件特有样式

	.demo-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 20px;
	}

	.info-card {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;

		h2 {
			margin-bottom: 16px;
			color: white;
		}
	}

	.info-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 12px;
	}

	.info-item {
		display: flex;
		justify-content: space-between;
		padding: 8px 12px;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 6px;

		.label {
			font-weight: 500;
		}

		.value {
			font-weight: bold;
			color: #ffd700;
		}
	}

	.font-demo {
		.font-samples p {
			margin: 8px 0;
			padding: 8px;
			border: 1px solid #e0e0e0;
			border-radius: 4px;
			background: #f9f9f9;
		}
	}

	.spacing-demo {
		.spacing-samples {
			display: flex;
			flex-direction: column;
			gap: 8px;
		}

		.spacing-item {
			background: #f0f8ff;
			border: 2px dashed #4a90e2;
			border-radius: 4px;
			font-weight: 500;
		}
	}

	.component-demo {
		text-align: center;
	}

	.responsive-demo {
		.responsive-content > div {
			padding: 12px;
			margin: 8px 0;
			border-radius: 6px;
			text-align: center;

			&:nth-child(1) {
				background: #e8f5e8;
				border: 2px solid #4caf50;
			}

			&:nth-child(2) {
				background: #fff3e0;
				border: 2px solid #ff9800;
			}

			&:nth-child(3) {
				background: #f3e5f5;
				border: 2px solid #9c27b0;
			}
		}
	}

	.instructions {
		background: #f8f9fa;

		.instruction-list {
			padding-left: 20px;

			li {
				margin: 8px 0;
				line-height: 1.6;
			}
		}
	}
</style>
