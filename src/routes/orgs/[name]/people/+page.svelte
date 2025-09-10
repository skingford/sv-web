<script lang="ts">
	import type { PageData } from './$types';
	import { Input, Button, Badge, Avatar, Card } from 'flowbite-svelte';
	import { SearchOutline, UsersGroupOutline, LockSolid } from 'flowbite-svelte-icons';

	let searchQuery = $state('');
	let selectedMembership = $state('all');

	const data: any = {
		name: 'example-org',
		totalCount: 42,
		members: [
			{
				id: 1,
				username: 'johndoe',
				displayName: 'John Doe',
				avatar: 'https://i.pravatar.cc/150?img=1',
				role: 'Owner',
				teams: 5,
				isPrivate: false
			},
			{
				id: 2,
				username: 'janedoe',
				displayName: 'Jane Doe',
				avatar: 'https://i.pravatar.cc/150?img=2',
				role: 'Member',
				teams: 3,
				isPrivate: true
			},
			{
				id: 3,
				username: 'alice',
				displayName: 'Alice Smith',
				avatar: 'https://i.pravatar.cc/150?img=3',
				role: 'Member',
				teams: 2,
				isPrivate: false
			},
			{
				id: 4,
				username: 'bob',
				displayName: 'Bob Johnson',
				avatar: 'https://i.pravatar.cc/150?img=4',
				role: 'Owner',
				teams: 4,
				isPrivate: true
			},
			{
				id: 5,
				username: 'charlie',
				displayName: 'Charlie Brown',
				avatar: 'https://i.pravatar.cc/150?img=5',
				role: 'Member',
				teams: 1,
				isPrivate: false
			}
			// 更多成员...
		]
	};

	// 过滤成员
	const filteredMembers: any = data.members;
	// const filteredMembers:any = $derived(() => {
	// 	return data.members.filter((member:any) => {
	// 		const matchesSearch = member.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
	// 							member.displayName.toLowerCase().includes(searchQuery.toLowerCase());
	// 		return matchesSearch;
	// 	});
	// });
</script>

<svelte:head>
	<title>People · {data.name} organization</title>
</svelte:head>

<div class="min-h-screen bg-[#0d1117] text-white">
	<!-- Search and filters section -->
	<div class="border-b border-gray-700 bg-[#0d1117]">
		<div class="mx-auto max-w-7xl px-4 py-6">
			<div class="mb-6 flex items-center gap-3">
				<UsersGroupOutline class="h-8 w-8 text-gray-400" />
				<h1 class="text-3xl font-bold">People</h1>
			</div>

			<!-- Search and filters -->
			<div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
				<!-- Search input -->
				<div class="relative max-w-md flex-1">
					<SearchOutline class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
					<Input
						bind:value={searchQuery}
						placeholder="Find a member..."
						class="border-gray-600 bg-[#21262d] pl-10 text-white placeholder-gray-400 focus:border-blue-500"
					/>
				</div>

				<!-- Membership filter -->
				<div class="flex items-center gap-2">
					<span class="text-sm text-gray-300">Membership</span>
					<select
						bind:value={selectedMembership}
						class="rounded-md border border-gray-600 bg-[#21262d] px-3 py-2 text-sm text-white focus:border-blue-500"
					>
						<option value="all">All</option>
						<option value="members">Members only</option>
						<option value="owners">Owners only</option>
					</select>
				</div>
			</div>

			<!-- Member count -->
			<div class="mt-4 text-gray-400">
				{filteredMembers.length} people in the {data.name} organization
			</div>
		</div>
	</div>

	<!-- Sidebar and Content -->
	<div class="mx-auto max-w-7xl px-4 py-6">
		<div class="flex gap-6">
			<!-- Sidebar -->
			<div class="w-64 flex-shrink-0">
				<nav class="space-y-1">
					<div class="flex items-center gap-2 rounded-md bg-[#21262d] px-3 py-2 text-white">
						<UsersGroupOutline class="h-4 w-4" />
						<span class="font-medium">Members</span>
						<Badge class="ml-auto bg-gray-600 text-white">{data.totalCount}</Badge>
					</div>
					<a
						href="/orgs/{data.name}/teams"
						class="flex items-center gap-2 rounded-md px-3 py-2 text-gray-300 hover:bg-[#21262d] hover:text-white"
					>
						<UsersGroupOutline class="h-4 w-4" />
						<span>Security Managers</span>
					</a>
				</nav>
			</div>

			<!-- Main content -->
			<div class="flex-1">
				<div class="space-y-3">
					{#each filteredMembers as member}
						<Card class="border-gray-700 bg-[#21262d] transition-colors hover:bg-[#2d333b]">
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-4">
									<!-- Avatar -->
									<Avatar src={member.avatar} alt={member.username} class="h-12 w-12" />

									<!-- User info -->
									<div>
										<div class="flex items-center gap-2">
											<span class="font-semibold text-blue-400">{member.displayName}</span>
											{#if member.isPrivate}
												<LockSolid class="h-3 w-3 text-gray-400" />
												<span class="text-xs text-gray-400">Private</span>
											{/if}
										</div>
										<div class="text-sm text-gray-300">{member.username}</div>
									</div>
								</div>

								<!-- Member info -->
								<div class="flex items-center gap-6 text-sm text-gray-400">
									<span>{member.role}</span>
									<span>{member.teams} teams</span>
								</div>
							</div>
						</Card>
					{/each}
				</div>

				<!-- Empty state -->
				{#if filteredMembers.length === 0}
					<div class="py-12 text-center">
						<UsersGroupOutline class="mx-auto mb-4 h-12 w-12 text-gray-500" />
						<h3 class="mb-2 text-lg font-medium text-gray-300">No members found</h3>
						<p class="text-gray-500">Try adjusting your search or filter criteria.</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
