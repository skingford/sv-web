<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Admin Dashboard</title>
</svelte:head>

<div class="min-h-screen bg-[#0d1117] p-8">
	<div class="mx-auto max-w-7xl">
		<div class="mb-8">
			<h1 class="mb-2 text-3xl font-bold text-[#f0f6fc]">Admin Dashboard</h1>
			<p class="text-[#8b949e]">Welcome back, {data.user.username}!</p>
		</div>

		<div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
			<div class="rounded-lg border border-[#30363d] bg-[#161b22] p-6">
				<h3 class="mb-2 text-lg font-semibold text-[#f0f6fc]">Total Users</h3>
				<p class="text-3xl font-bold text-[#58a6ff]">{data.adminData.totalUsers}</p>
			</div>

			<div class="rounded-lg border border-[#30363d] bg-[#161b22] p-6">
				<h3 class="mb-2 text-lg font-semibold text-[#f0f6fc]">Organizations</h3>
				<p class="text-3xl font-bold text-[#3fb950]">{data.adminData.totalOrganizations}</p>
			</div>

			<div class="rounded-lg border border-[#30363d] bg-[#161b22] p-6">
				<h3 class="mb-2 text-lg font-semibold text-[#f0f6fc]">System Health</h3>
				<p class="text-3xl font-bold text-[#3fb950] capitalize">{data.adminData.systemHealth}</p>
			</div>
		</div>

		<div class="rounded-lg border border-[#30363d] bg-[#161b22] p-6">
			<h2 class="mb-4 text-xl font-semibold text-[#f0f6fc]">Admin Actions</h2>
			<div class="space-y-4">
				<button
					class="rounded-md bg-[#238636] px-4 py-2 text-white transition-colors hover:bg-[#2ea043]"
				>
					Manage Users
				</button>
				<button
					class="ml-4 rounded-md bg-[#da3633] px-4 py-2 text-white transition-colors hover:bg-[#f85149]"
				>
					System Settings
				</button>
			</div>
		</div>
	</div>
</div>
