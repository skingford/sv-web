<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuSeparator,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import { Badge } from '$lib/components/ui/badge';
	import { Input } from '$lib/components/ui/input';
	import {
		NavigationMenuRoot as NavigationMenu,
		NavigationMenuContent,
		NavigationMenuItem,
		NavigationMenuLink,
		NavigationMenuList,
		NavigationMenuTrigger
	} from '$lib/components/ui/navigation-menu';
	import {
		Sheet,
		SheetContent,
		SheetHeader,
		SheetTitle,
		SheetTrigger
	} from '$lib/components/ui/sheet';

	let searchQuery = $state('');

	function handleSearch(event: Event) {
		event.preventDefault();
		if (searchQuery.trim()) {
			// 这里可以添加搜索逻辑
			console.log('搜索:', searchQuery);
		}
	}
</script>

<header
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
			<NavigationMenu class="hidden md:flex">
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuTrigger>产品</NavigationMenuTrigger>
						<NavigationMenuContent>
							<div class="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
								<div class="row-span-3">
									<NavigationMenuLink>
										<a
											class="flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none select-none focus:shadow-md"
											href="/products"
										>
											<div class="mt-4 mb-2 text-lg font-medium">产品中心</div>
											<p class="text-sm leading-tight text-muted-foreground">
												探索我们的核心产品和服务
											</p>
										</a>
									</NavigationMenuLink>
								</div>
								<div class="grid gap-3">
									<NavigationMenuLink>
										<a
											href="/products/github-actions"
											class="block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
										>
											<div class="text-sm leading-none font-medium">GitHub Actions</div>
											<p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
												自动化您的工作流程
											</p>
										</a>
									</NavigationMenuLink>
									<NavigationMenuLink>
										<a
											href="/products/codespaces"
											class="block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
										>
											<div class="text-sm leading-none font-medium">Codespaces</div>
											<p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
												云端开发环境
											</p>
										</a>
									</NavigationMenuLink>
								</div>
							</div>
						</NavigationMenuContent>
					</NavigationMenuItem>

					<NavigationMenuItem>
						<NavigationMenuTrigger>解决方案</NavigationMenuTrigger>
						<NavigationMenuContent>
							<div class="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
								<div class="grid gap-3">
									<NavigationMenuLink>
										<a
											href="/solutions/enterprise"
											class="block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
										>
											<div class="text-sm leading-none font-medium">企业解决方案</div>
											<p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
												为大型企业提供完整的开发平台
											</p>
										</a>
									</NavigationMenuLink>
									<NavigationMenuLink>
										<a
											href="/solutions/startup"
											class="block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
										>
											<div class="text-sm leading-none font-medium">初创公司</div>
											<p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
												快速启动您的项目
											</p>
										</a>
									</NavigationMenuLink>
								</div>
							</div>
						</NavigationMenuContent>
					</NavigationMenuItem>

					<NavigationMenuItem>
						<NavigationMenuTrigger>开源</NavigationMenuTrigger>
						<NavigationMenuContent>
							<div class="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
								<div class="grid gap-3">
									<NavigationMenuLink>
										<a
											href="/open-source/projects"
											class="block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
										>
											<div class="text-sm leading-none font-medium">开源项目</div>
											<p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
												探索和贡献开源项目
											</p>
										</a>
									</NavigationMenuLink>
									<NavigationMenuLink>
										<a
											href="/open-source/community"
											class="block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
										>
											<div class="text-sm leading-none font-medium">社区</div>
											<p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
												加入我们的开发者社区
											</p>
										</a>
									</NavigationMenuLink>
								</div>
							</div>
						</NavigationMenuContent>
					</NavigationMenuItem>

					<NavigationMenuItem>
						<NavigationMenuLink>
							<a
								href="/pricing"
								class="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
							>
								<span>定价</span>
							</a>
						</NavigationMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>

			<!-- 搜索框 -->
			<div class="mx-8 hidden max-w-md flex-1 lg:flex">
				<form onsubmit={handleSearch} class="relative w-full">
					<div class="relative">
						<Input
							type="text"
							placeholder="搜索或跳转到..."
							bind:value={searchQuery}
							class="pr-12"
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
				<Button variant="ghost" size="icon" class="relative" aria-label="通知">
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 17h5l-5 5v-5zM4.5 19.5L9 15H4.5v4.5zM15 7h5l-5-5v5zM4.5 4.5L9 9H4.5V4.5z"
						></path>
					</svg>
					<Badge
						variant="destructive"
						class="absolute -top-1 -right-1 h-3 w-3 rounded-full p-0 text-xs"
					>
						3
					</Badge>
				</Button>

				<!-- 用户头像和菜单 -->
				<DropdownMenu>
					<DropdownMenuTrigger class="relative h-8 w-8 rounded-full">
						<Avatar class="h-8 w-8">
							<AvatarImage src="/avatars/01.png" alt="用户头像" />
							<AvatarFallback class="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
								U
							</AvatarFallback>
						</Avatar>
					</DropdownMenuTrigger>
					<DropdownMenuContent class="w-64" align="end" forceMount>
						<div class="flex items-center justify-start gap-2 p-2">
							<div class="flex flex-col space-y-1 leading-none">
								<p class="font-medium">用户名</p>
								<p class="w-[200px] truncate text-sm text-muted-foreground">user@example.com</p>
							</div>
						</div>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<a href="/profile" class="block w-full">个人资料</a>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<a href="/settings" class="block w-full">设置</a>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<a href="/help" class="block w-full">帮助</a>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<button class="block w-full text-left">登出</button>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				<!-- 移动端菜单 -->
				<Sheet>
					<SheetTrigger>
						<Button variant="ghost" size="icon" class="md:hidden" aria-label="打开菜单">
							<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 6h16M4 12h16M4 18h16"
								></path>
							</svg>
						</Button>
					</SheetTrigger>
					<SheetContent side="right" class="w-[300px] sm:w-[400px]">
						<SheetHeader>
							<SheetTitle>菜单</SheetTitle>
						</SheetHeader>
						<div class="mt-6 space-y-6">
							<!-- 移动端搜索框 -->
							<form onsubmit={handleSearch} class="space-y-2">
								<Input type="text" placeholder="搜索或跳转到..." bind:value={searchQuery} />
							</form>

							<!-- 移动端导航链接 -->
							<nav class="space-y-4">
								<div class="space-y-2">
									<h4 class="text-sm font-medium text-muted-foreground">产品</h4>
									<div class="space-y-1">
										<a
											href="/products"
											class="block py-2 text-sm text-foreground hover:text-muted-foreground"
											>产品中心</a
										>
										<a
											href="/products/github-actions"
											class="block py-2 text-sm text-foreground hover:text-muted-foreground"
											>GitHub Actions</a
										>
										<a
											href="/products/codespaces"
											class="block py-2 text-sm text-foreground hover:text-muted-foreground"
											>Codespaces</a
										>
									</div>
								</div>

								<div class="space-y-2">
									<h4 class="text-sm font-medium text-muted-foreground">解决方案</h4>
									<div class="space-y-1">
										<a
											href="/solutions/enterprise"
											class="block py-2 text-sm text-foreground hover:text-muted-foreground"
											>企业解决方案</a
										>
										<a
											href="/solutions/startup"
											class="block py-2 text-sm text-foreground hover:text-muted-foreground"
											>初创公司</a
										>
									</div>
								</div>

								<div class="space-y-2">
									<h4 class="text-sm font-medium text-muted-foreground">开源</h4>
									<div class="space-y-1">
										<a
											href="/open-source/projects"
											class="block py-2 text-sm text-foreground hover:text-muted-foreground"
											>开源项目</a
										>
										<a
											href="/open-source/community"
											class="block py-2 text-sm text-foreground hover:text-muted-foreground">社区</a
										>
									</div>
								</div>

								<div class="space-y-1">
									<a
										href="/pricing"
										class="block py-2 text-sm text-foreground hover:text-muted-foreground">定价</a
									>
								</div>
							</nav>
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</div>
	</div>
</header>
