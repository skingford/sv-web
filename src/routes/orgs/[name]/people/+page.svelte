<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	// Mock data for demonstration - in real app this would come from your API
	let searchQuery = '';
	let selectedRole = 'all';
	let people = [
		{
			id: 1,
			username: '970299422',
			displayName: '夏司',
			avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
			role: 'Owner',
			isPrivate: false,
			teams: 0
		},
		{
			id: 2,
			username: 'aatoe',
			displayName: 'Juice「智远乱」',
			avatar: 'https://avatars.githubusercontent.com/u/2?v=4',
			role: 'Member',
			isPrivate: false,
			teams: 0
		},
		{
			id: 3,
			username: 'AnRun',
			displayName: '何佳欣',
			avatar: 'https://avatars.githubusercontent.com/u/3?v=4',
			role: 'Member',
			isPrivate: false,
			teams: 0
		},
		{
			id: 4,
			username: 'crawl-d',
			displayName: 'dingJun',
			avatar: 'https://avatars.githubusercontent.com/u/4?v=4',
			role: 'Member',
			isPrivate: false,
			teams: 0
		},
		{
			id: 5,
			username: 'evlex',
			displayName: '巨宝贝',
			avatar: 'https://avatars.githubusercontent.com/u/5?v=4',
			role: 'Member',
			isPrivate: false,
			teams: 0
		},
		{
			id: 6,
			username: 'Github-newbee',
			displayName: '何佳欣',
			avatar: 'https://avatars.githubusercontent.com/u/6?v=4',
			role: 'Member',
			isPrivate: false,
			teams: 0
		},
		{
			id: 7,
			username: 'haoqianwu',
			displayName: '何佳武',
			avatar: 'https://avatars.githubusercontent.com/u/7?v=4',
			role: 'Member',
			isPrivate: false,
			teams: 0
		}
	];

	$: filteredPeople = people.filter((person) => {
		const matchesSearch =
			person.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
			person.displayName.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesRole = selectedRole === 'all' || person.role.toLowerCase() === selectedRole;
		return matchesSearch && matchesRole;
	});

	$: memberCount = people.filter((p) => p.role === 'Member').length;
	$: ownerCount = people.filter((p) => p.role === 'Owner').length;
</script>

<svelte:head>
	<title>People · {data.name}</title>
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-6">
	<div class="flex flex-col gap-6 lg:flex-row">
		<!-- Sidebar -->
		<div class="w-full lg:w-80">
			<div class="rounded-lg border border-gray-700 bg-[#161b22] p-4">
				<h2 class="mb-4 text-lg font-semibold text-white">Organization permissions</h2>

				<div class="space-y-3">
					<div class="flex items-center justify-between">
						<span class="text-gray-300">Members</span>
						<span class="rounded-full bg-gray-700 px-2 py-1 text-xs text-gray-300"
							>{memberCount}</span
						>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-gray-300">Security Managers</span>
						<span class="rounded-full bg-gray-700 px-2 py-1 text-xs text-gray-300">0</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Main content -->
		<div class="flex-1">
			<!-- Header -->
			<div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 class="text-2xl font-bold text-white">People</h1>
					<p class="text-gray-400">
						{filteredPeople.length} people in the {data.name} organization
					</p>
				</div>

				<!-- Membership filter -->
				<div class="flex items-center gap-2">
					<span class="text-sm text-gray-400">Membership</span>
					<select
						bind:value={selectedRole}
						class="rounded-md border border-gray-600 bg-[#21262d] px-3 py-1 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					>
						<option value="all">All roles</option>
						<option value="owner">Owner</option>
						<option value="member">Member</option>
					</select>
				</div>
			</div>

			<!-- Search -->
			<div class="mb-6">
				<div class="relative">
					<svg
						class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						></path>
					</svg>
					<input
						type="text"
						placeholder="Find a member..."
						bind:value={searchQuery}
						class="w-full rounded-md border border-gray-600 bg-[#0d1117] py-2 pr-4 pl-10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					/>
				</div>
			</div>

			<!-- People list -->
			<div class="space-y-0 overflow-hidden rounded-lg border border-gray-700">
				{#each filteredPeople as person, index}
					<div
						class="flex items-center justify-between border-b border-gray-700 bg-[#0d1117] p-4 last:border-b-0 hover:bg-[#161b22]"
					>
						<div class="flex items-center gap-3">
							<img
								src={person.avatar}
								alt="{person.username} avatar"
								class="h-10 w-10 rounded-full"
							/>
							<div>
								<div class="flex items-center gap-2">
									<span class="font-medium text-white">{person.displayName}</span>
									{#if person.isPrivate}
										<svg class="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
											<path
												fill-rule="evenodd"
												d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
												clip-rule="evenodd"
											></path>
										</svg>
										<span class="text-xs text-gray-400">Private</span>
									{/if}
								</div>
								<div class="text-sm text-gray-400">{person.username}</div>
							</div>
						</div>

						<div class="flex items-center gap-4">
							<div class="flex items-center gap-2 text-sm text-gray-400">
								{#if person.isPrivate}
									<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
											clip-rule="evenodd"
										></path>
									</svg>
									<span>Private</span>
								{/if}
							</div>

							<div class="flex items-center gap-2">
								<span class="rounded-full bg-green-900 px-2 py-1 text-xs text-green-300">
									{person.role}
								</span>
								<span class="text-sm text-gray-400">{person.teams} teams</span>
							</div>
						</div>
					</div>
				{/each}

				{#if filteredPeople.length === 0}
					<div class="p-8 text-center">
						<div
							class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-800"
						>
							<svg
								class="h-8 w-8 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
								></path>
							</svg>
						</div>
						<h3 class="mb-2 text-lg font-medium text-white">No people found</h3>
						<p class="text-gray-400">
							Try adjusting your search or filter to find what you're looking for.
						</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
