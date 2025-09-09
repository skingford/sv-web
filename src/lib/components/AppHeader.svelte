<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';

	let isMenuOpen = $state(false);
	let isUserMenuOpen = $state(false);
	let searchQuery = $state('');
	let headerElement: HTMLElement;

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
		if (isMenuOpen) {
			isUserMenuOpen = false;
		}
	}

	function toggleUserMenu() {
		isUserMenuOpen = !isUserMenuOpen;
		if (isUserMenuOpen) {
			isMenuOpen = false;
		}
	}

	function handleSearch(event: Event) {
		event.preventDefault();
		if (searchQuery.trim()) {
			// 这里可以添加搜索逻辑
			console.log('搜索:', searchQuery);
		}
	}

	function closeMenus() {
		isMenuOpen = false;
		isUserMenuOpen = false;
	}

	onMount(() => {
		function handleClickOutside(event: MouseEvent) {
			if (headerElement && !headerElement.contains(event.target as Node)) {
				closeMenus();
			}
		}

		function handleEscape(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				closeMenus();
			}
		}

		document.addEventListener('click', handleClickOutside);
		document.addEventListener('keydown', handleEscape);

		return () => {
			document.removeEventListener('click', handleClickOutside);
			document.removeEventListener('keydown', handleEscape);
		};
	});
</script>

<header
	bind:this={headerElement}
	class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
	<div class="container mx-auto px-4">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo 和品牌 -->
			<div class="flex items-center space-x-4">
				<a href="/" class="flex items-center space-x-2">
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
						<svg class="h-5 w-5 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
							<path
								d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
							/>
						</svg>
					</div>
					<span class="text-xl font-bold text-foreground">GitHub</span>
				</a>
			</div>

			<!-- 桌面端导航菜单 -->
			<nav class="hidden items-center space-x-6 md:flex">
				<div class="group relative">
					<button
						class="flex items-center space-x-1 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
					>
						<span>产品</span>
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 9l-7 7-7-7"
							></path>
						</svg>
					</button>
					<!-- 下拉菜单可以在这里添加 -->
				</div>

				<div class="group relative">
					<button
						class="flex items-center space-x-1 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
					>
						<span>解决方案</span>
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 9l-7 7-7-7"
							></path>
						</svg>
					</button>
				</div>

				<div class="group relative">
					<button
						class="flex items-center space-x-1 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
					>
						<span>开源</span>
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 9l-7 7-7-7"
							></path>
						</svg>
					</button>
				</div>

				<a
					href="/pricing"
					class="text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
				>
					定价
				</a>
			</nav>

			<!-- 搜索框 -->
			<div class="mx-8 hidden max-w-md flex-1 lg:flex">
				<form onsubmit={handleSearch} class="relative w-full">
					<div class="relative">
						<input
							type="text"
							placeholder="搜索或跳转到..."
							bind:value={searchQuery}
							class="h-9 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-ring focus:outline-none"
						/>
						<div
							class="absolute top-1/2 right-2 flex -translate-y-1/2 transform items-center space-x-1"
						>
							<kbd
								class="rounded border bg-muted-foreground/10 px-1.5 py-0.5 font-mono text-xs text-muted-foreground"
								>/</kbd
							>
						</div>
					</div>
				</form>
			</div>

			<!-- 右侧用户区域 -->
			<div class="flex items-center space-x-4">
				<!-- 通知按钮 -->
				<button
					class="relative p-2 text-muted-foreground transition-colors hover:text-foreground"
					aria-label="通知"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 17h5l-5 5v-5zM4.5 19.5L9 15H4.5v4.5zM15 7h5l-5-5v5zM4.5 4.5L9 9H4.5V4.5z"
						></path>
					</svg>
					<span class="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-destructive"></span>
				</button>

				<!-- 用户头像和菜单 -->
				<div class="relative">
					<button
						onclick={toggleUserMenu}
						class="flex items-center space-x-2 rounded-full p-1 transition-colors hover:bg-muted"
					>
						<div
							class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
						>
							<span class="text-sm font-medium text-white">U</span>
						</div>
						<svg
							class="h-4 w-4 text-muted-foreground"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 9l-7 7-7-7"
							></path>
						</svg>
					</button>

					<!-- 用户下拉菜单 -->
					{#if isUserMenuOpen}
						<div
							class="absolute right-0 z-50 mt-2 w-64 rounded-md border border-border bg-popover shadow-lg"
						>
							<div class="border-b border-border p-4">
								<div class="flex items-center space-x-3">
									<div
										class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
									>
										<span class="text-sm font-medium text-white">U</span>
									</div>
									<div>
										<p class="text-sm font-medium text-foreground">用户名</p>
										<p class="text-xs text-muted-foreground">user@example.com</p>
									</div>
								</div>
							</div>
							<div class="py-2">
								<a href="/profile" class="block px-4 py-2 text-sm text-foreground hover:bg-muted"
									>个人资料</a
								>
								<a href="/settings" class="block px-4 py-2 text-sm text-foreground hover:bg-muted"
									>设置</a
								>
								<a href="/help" class="block px-4 py-2 text-sm text-foreground hover:bg-muted"
									>帮助</a
								>
								<div class="my-2 border-t border-border"></div>
								<button
									class="block w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted"
									>登出</button
								>
							</div>
						</div>
					{/if}
				</div>

				<!-- 移动端菜单按钮 -->
				<button
					onclick={toggleMenu}
					class="p-2 text-muted-foreground transition-colors hover:text-foreground md:hidden"
					aria-label="打开菜单"
				>
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						></path>
					</svg>
				</button>
			</div>
		</div>

		<!-- 移动端菜单 -->
		{#if isMenuOpen}
			<div class="border-t border-border bg-background md:hidden">
				<div class="space-y-4 px-4 py-4">
					<!-- 移动端搜索框 -->
					<form onsubmit={handleSearch} class="relative">
						<input
							type="text"
							placeholder="搜索或跳转到..."
							bind:value={searchQuery}
							class="h-9 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-ring focus:outline-none"
						/>
					</form>

					<!-- 移动端导航链接 -->
					<nav class="space-y-2">
						<a
							href="/products"
							class="block py-2 text-sm font-medium text-foreground hover:text-muted-foreground"
							>产品</a
						>
						<a
							href="/solutions"
							class="block py-2 text-sm font-medium text-foreground hover:text-muted-foreground"
							>解决方案</a
						>
						<a
							href="/open-source"
							class="block py-2 text-sm font-medium text-foreground hover:text-muted-foreground"
							>开源</a
						>
						<a
							href="/pricing"
							class="block py-2 text-sm font-medium text-foreground hover:text-muted-foreground"
							>定价</a
						>
					</nav>
				</div>
			</div>
		{/if}
	</div>
</header>
