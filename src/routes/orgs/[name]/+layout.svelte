<script lang="ts">
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';

	export let data: LayoutData;

	// 获取当前路径以高亮对应的导航项
	$: currentPath = $page.url.pathname;
</script>

<div class="min-h-screen bg-[#0d1117]">
	<!-- Organization Header -->
	<div class="border-b border-gray-700 bg-[#0d1117]">
		<div class="mx-auto max-w-7xl px-4 py-4">
			<div class="mb-4 flex items-center gap-4">
				<div
					class="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500"
				>
					<span class="text-lg font-bold text-white">{data.name.charAt(0).toUpperCase()}</span>
				</div>
				<div>
					<h1 class="text-2xl font-bold text-white">{data.name}</h1>
					<p class="text-gray-400">Organization</p>
				</div>
			</div>

			<!-- Navigation tabs -->
			<nav class="flex space-x-8 border-b border-gray-700">
				<a
					href="/orgs/{data.name}"
					class="border-b-2 pb-3 {currentPath === `/orgs/${data.name}`
						? 'border-orange-500 text-white'
						: 'border-transparent text-gray-400 hover:text-white'}"
				>
					Overview
				</a>
				<a
					href="/orgs/{data.name}/repositories"
					class="border-b-2 pb-3 {currentPath.includes('/repositories')
						? 'border-orange-500 text-white'
						: 'border-transparent text-gray-400 hover:text-white'}"
				>
					Repositories
				</a>
				<a
					href="/orgs/{data.name}/people"
					class="border-b-2 pb-3 {currentPath.includes('/people')
						? 'border-orange-500 text-white'
						: 'border-transparent text-gray-400 hover:text-white'}"
				>
					People
				</a>
				<a
					href="/orgs/{data.name}/teams"
					class="border-b-2 pb-3 {currentPath.includes('/teams')
						? 'border-orange-500 text-white'
						: 'border-transparent text-gray-400 hover:text-white'}"
				>
					Teams
				</a>
				<a
					href="/orgs/{data.name}/projects"
					class="border-b-2 pb-3 {currentPath.includes('/projects')
						? 'border-orange-500 text-white'
						: 'border-transparent text-gray-400 hover:text-white'}"
				>
					Projects
				</a>
				<a
					href="/orgs/{data.name}/settings"
					class="border-b-2 pb-3 {currentPath.includes('/settings')
						? 'border-orange-500 text-white'
						: 'border-transparent text-gray-400 hover:text-white'}"
				>
					Settings
				</a>
			</nav>
		</div>
	</div>

	<!-- Page content -->
	<slot />
</div>
