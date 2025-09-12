<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Mock data for demonstration - in real app this would come from your API
	let searchQuery = '';
	let selectedRole = 'all';
	let selectedVisibility = 'all';

	let people = [
		{
			id: 1,
			username: '970299422',
			displayName: '夏司',
			avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
			role: 'Owner',
			isPrivate: false,
			teams: 0,
			joinDate: '2023-01-15'
		},
		{
			id: 2,
			username: 'aatoe',
			displayName: 'Juice「智远乱」',
			avatar: 'https://avatars.githubusercontent.com/u/2?v=4',
			role: 'Member',
			isPrivate: false,
			teams: 2,
			joinDate: '2023-03-22'
		},
		{
			id: 3,
			username: 'AnRun',
			displayName: '何佳欣',
			avatar: 'https://avatars.githubusercontent.com/u/3?v=4',
			role: 'Member',
			isPrivate: true,
			teams: 1,
			joinDate: '2023-05-10'
		},
		{
			id: 4,
			username: 'crawl-d',
			displayName: 'dingJun',
			avatar: 'https://avatars.githubusercontent.com/u/4?v=4',
			role: 'Member',
			isPrivate: false,
			teams: 3,
			joinDate: '2023-07-08'
		},
		{
			id: 5,
			username: 'evlex',
			displayName: '巨宝贝',
			avatar: 'https://avatars.githubusercontent.com/u/5?v=4',
			role: 'Member',
			isPrivate: false,
			teams: 1,
			joinDate: '2023-09-14'
		},
		{
			id: 6,
			username: 'Github-newbee',
			displayName: '何佳欣',
			avatar: 'https://avatars.githubusercontent.com/u/6?v=4',
			role: 'Member',
			isPrivate: true,
			teams: 0,
			joinDate: '2023-11-03'
		},
		{
			id: 7,
			username: 'haoqianwu',
			displayName: '何佳武',
			avatar: 'https://avatars.githubusercontent.com/u/7?v=4',
			role: 'Member',
			isPrivate: false,
			teams: 2,
			joinDate: '2024-01-20'
		}
	];

	let filteredPeople = $derived(
		people.filter((person) => {
			const matchesSearch =
				person.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
				person.displayName.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesRole = selectedRole === 'all' || person.role.toLowerCase() === selectedRole;
			const matchesVisibility =
				selectedVisibility === 'all' ||
				(selectedVisibility === 'public' && !person.isPrivate) ||
				(selectedVisibility === 'private' && person.isPrivate);
			return matchesSearch && matchesRole && matchesVisibility;
		})
	);

	let memberCount = $derived(people.filter((p) => p.role === 'Member').length);
	let ownerCount = $derived(people.filter((p) => p.role === 'Owner').length);
	let publicMemberCount = $derived(people.filter((p) => !p.isPrivate).length);
	let privateMemberCount = $derived(people.filter((p) => p.isPrivate).length);
</script>

<svelte:head>
	<title>People · {data.name}</title>
</svelte:head>

<div class="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
	<div class="flex flex-col gap-8 lg:flex-row">
		<!-- Sidebar -->
		<div class="w-full lg:w-80">
			<div class="rounded-md border border-[#30363d] bg-[#161b22] p-4">
				<h2 class="mb-4 flex items-center gap-2 text-base font-semibold text-[#f0f6fc]">
					<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
						<path
							d="M1.5 14.25c0-.788.31-1.547.863-2.1a2.972 2.972 0 0 1 2.1-.863H4.5c.788 0 1.547.31 2.1.863.552.553.863 1.312.863 2.1v.75a.75.75 0 0 1-1.5 0v-.75c0-.397-.158-.778-.44-1.06A1.5 1.5 0 0 0 4.5 12.75h-.037c-.397 0-.778.158-1.06.44A1.5 1.5 0 0 0 3 14.25v.75a.75.75 0 0 1-1.5 0v-.75ZM6 6.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0ZM7.5 6.5a1 1 0 1 0 2 0 1 1 0 0 0-2 0ZM14 6.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-1.5 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Z"
						/>
					</svg>
					Organization permissions
				</h2>

				<div class="space-y-3">
					<div class="flex items-center justify-between py-1">
						<span class="text-sm text-[#8b949e]">Members</span>
						<span class="rounded-full bg-[#21262d] px-2 py-0.5 text-xs text-[#8b949e]">
							{memberCount}
						</span>
					</div>
					<div class="flex items-center justify-between py-1">
						<span class="text-sm text-[#8b949e]">Public members</span>
						<span class="rounded-full bg-[#21262d] px-2 py-0.5 text-xs text-[#8b949e]">
							{publicMemberCount}
						</span>
					</div>
					<div class="flex items-center justify-between py-1">
						<span class="text-sm text-[#8b949e]">Private members</span>
						<span class="rounded-full bg-[#21262d] px-2 py-0.5 text-xs text-[#8b949e]">
							{privateMemberCount}
						</span>
					</div>
					<div class="flex items-center justify-between py-1">
						<span class="text-sm text-[#8b949e]">Owners</span>
						<span class="rounded-full bg-[#21262d] px-2 py-0.5 text-xs text-[#8b949e]">
							{ownerCount}
						</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Main content -->
		<div class="min-w-0 flex-1">
			<!-- Header -->
			<div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<h1 class="text-2xl font-semibold text-[#f0f6fc]">People</h1>
					<p class="mt-1 text-[#8b949e]">
						{filteredPeople.length}
						{filteredPeople.length === 1 ? 'person' : 'people'} in the {data.name} organization
					</p>
				</div>

				<!-- Invite button -->
				<button
					class="flex items-center gap-2 rounded-md bg-[#238636] px-4 py-2 text-sm font-medium text-white hover:bg-[#2ea043] focus:ring-2 focus:ring-[#238636] focus:ring-offset-2 focus:ring-offset-[#0d1117] focus:outline-none"
				>
					<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
						<path
							d="M8 2a.75.75 0 0 1 .75.75v4.5h4.5a.75.75 0 0 1 0 1.5h-4.5v4.5a.75.75 0 0 1-1.5 0v-4.5h-4.5a.75.75 0 0 1 0-1.5h4.5v-4.5A.75.75 0 0 1 8 2Z"
						/>
					</svg>
					Invite a member
				</button>
			</div>

			<!-- Filters -->
			<div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<!-- Search -->
				<div class="relative max-w-md flex-1">
					<svg
						class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#8b949e]"
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
						class="w-full rounded-md border border-[#30363d] bg-[#0d1117] py-2 pr-4 pl-10 text-sm text-[#f0f6fc] placeholder-[#8b949e] focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] focus:outline-none"
					/>
				</div>

				<!-- Filter dropdowns -->
				<div class="flex gap-3">
					<div class="flex items-center gap-2">
						<label for="role-filter" class="text-sm text-[#8b949e]">Role:</label>
						<select
							id="role-filter"
							bind:value={selectedRole}
							class="rounded-md border border-[#30363d] bg-[#21262d] px-3 py-1.5 text-sm text-[#f0f6fc] focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] focus:outline-none"
						>
							<option value="all">All roles</option>
							<option value="owner">Owner</option>
							<option value="member">Member</option>
						</select>
					</div>

					<div class="flex items-center gap-2">
						<label for="visibility-filter" class="text-sm text-[#8b949e]">Visibility:</label>
						<select
							id="visibility-filter"
							bind:value={selectedVisibility}
							class="rounded-md border border-[#30363d] bg-[#21262d] px-3 py-1.5 text-sm text-[#f0f6fc] focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] focus:outline-none"
						>
							<option value="all">All</option>
							<option value="public">Public</option>
							<option value="private">Private</option>
						</select>
					</div>
				</div>
			</div>

			<!-- People list -->
			<div class="overflow-hidden rounded-md border border-[#30363d]">
				{#each filteredPeople as person}
					<div
						class="flex items-center justify-between border-b border-[#21262d] bg-[#0d1117] p-4 transition-colors last:border-b-0 hover:bg-[#161b22]"
					>
						<div class="flex items-center gap-4">
							<a href="/{person.username}" class="flex-shrink-0">
								<img
									src={person.avatar}
									alt="{person.username} avatar"
									class="h-12 w-12 rounded-full ring-1 ring-[#30363d]"
								/>
							</a>
							<div class="min-w-0 flex-1">
								<div class="flex items-center gap-2">
									<a
										href="/{person.username}"
										class="font-semibold text-[#f0f6fc] hover:text-[#58a6ff]"
									>
										{person.displayName}
									</a>
									{#if person.isPrivate}
										<svg class="h-4 w-4 text-[#8b949e]" fill="currentColor" viewBox="0 0 16 16">
											<path
												d="M4 4a4 4 0 0 1 8 0v2h.25c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 12.25 15h-8.5A1.75 1.75 0 0 1 2 13.25v-5.5C2 6.784 2.784 6 3.75 6H4Zm8.25 3.5h-8.5a.25.25 0 0 0-.25.25v5.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-5.5a.25.25 0 0 0-.25-.25ZM10.5 6V4a2.5 2.5 0 1 0-5 0v2Z"
											/>
										</svg>
									{/if}
								</div>
								<div class="flex items-center gap-2 text-sm text-[#8b949e]">
									<span>{person.username}</span>
									{#if person.isPrivate}
										<span class="text-xs">• Private member</span>
									{/if}
								</div>
							</div>
						</div>

						<div class="flex items-center gap-6">
							<!-- Role badge -->
							<div class="flex items-center gap-2">
								<span
									class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {person.role ===
									'Owner'
										? 'bg-[#7c3aed]/10 text-[#a855f7]'
										: 'bg-[#238636]/10 text-[#3fb950]'}"
								>
									{person.role}
								</span>
							</div>

							<!-- Teams count -->
							<div class="flex items-center gap-1 text-sm text-[#8b949e]">
								<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
									<path
										d="M1.5 14.25c0-.788.31-1.547.863-2.1a2.972 2.972 0 0 1 2.1-.863H4.5c.788 0 1.547.31 2.1.863.552.553.863 1.312.863 2.1v.75a.75.75 0 0 1-1.5 0v-.75c0-.397-.158-.778-.44-1.06A1.5 1.5 0 0 0 4.5 12.75h-.037c-.397 0-.778.158-1.06.44A1.5 1.5 0 0 0 3 14.25v.75a.75.75 0 0 1-1.5 0v-.75ZM6 6.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0ZM7.5 6.5a1 1 0 1 0 2 0 1 1 0 0 0-2 0ZM14 6.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-1.5 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Z"
									/>
								</svg>
								<span>{person.teams} {person.teams === 1 ? 'team' : 'teams'}</span>
							</div>

							<!-- More options -->
							<div class="relative">
								<button
									class="rounded-md p-1 text-[#8b949e] hover:bg-[#21262d] hover:text-[#f0f6fc]"
								>
									<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
										<path
											d="M8 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM1.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm13 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
										/>
									</svg>
								</button>
							</div>
						</div>
					</div>
				{/each}

				{#if filteredPeople.length === 0}
					<div class="p-12 text-center">
						<div
							class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#21262d]"
						>
							<svg
								class="h-8 w-8 text-[#8b949e]"
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
						<h3 class="mb-2 text-lg font-semibold text-[#f0f6fc]">No people found</h3>
						<p class="text-[#8b949e]">
							Try adjusting your search or filter to find what you're looking for.
						</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
