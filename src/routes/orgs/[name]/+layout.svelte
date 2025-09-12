<script lang="ts">
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: any } = $props();

	// Mock data - replace with real API data
	let orgData = $derived(() => ({
		name: data.name,
		description: 'Building the future of software development',
		website: 'https://github.com',
		location: 'San Francisco, CA',
		email: 'hello@github.com',
		verified: true,
		publicRepos: 1234,
		followers: 56789,
		following: 123
	}));

	// Navigation items with icons and counts
	let navItems = $derived(() => [
		{
			href: `/orgs/${data.name}`,
			label: 'Overview',
			icon: 'overview',
			exact: true
		},
		{
			href: `/orgs/${data.name}/repositories`,
			label: 'Repositories',
			icon: 'repo',
			count: orgData().publicRepos
		},
		{
			href: `/orgs/${data.name}/people`,
			label: 'People',
			icon: 'people',
			count: 26
		},
		{
			href: `/orgs/${data.name}/teams`,
			label: 'Teams',
			icon: 'teams',
			count: 8
		},
		{
			href: `/orgs/${data.name}/projects`,
			label: 'Projects',
			icon: 'projects',
			count: 12
		},
		{
			href: `/orgs/${data.name}/packages`,
			label: 'Packages',
			icon: 'packages',
			count: 5
		},
		{
			href: `/orgs/${data.name}/settings`,
			label: 'Settings',
			icon: 'settings'
		}
	]);

	function isActiveTab(item: any): boolean {
		if (typeof window === 'undefined') return false;
		const currentPath = window.location.pathname;

		if (item.exact) {
			return currentPath === item.href;
		}
		return currentPath.startsWith(item.href);
	}
</script>

<div class="min-h-screen bg-[#0d1117]">
	<!-- Organization Header -->
	<div class="border-b border-[#21262d] bg-[#0d1117]">
		<div class="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
			<!-- Organization Info -->
			<div class="flex flex-col gap-4 py-6 sm:flex-row sm:items-start sm:gap-6">
				<!-- Avatar -->
				<div class="flex-shrink-0">
					<div
						class="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 ring-1 ring-[#30363d] sm:h-20 sm:w-20"
					>
						<span class="text-xl font-bold text-white sm:text-2xl">
							{data.name.charAt(0).toUpperCase()}
						</span>
					</div>
				</div>

				<!-- Organization Details -->
				<div class="min-w-0 flex-1">
					<div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
						<div class="flex items-center gap-2">
							<h1 class="text-2xl font-semibold text-[#f0f6fc] sm:text-3xl">{data.name}</h1>
							{#if orgData().verified}
								<svg class="h-5 w-5 text-[#3fb950]" fill="currentColor" viewBox="0 0 16 16">
									<path
										fill-rule="evenodd"
										d="M9.585.52a2.678 2.678 0 0 0-3.17 0l-.928.68a1.178 1.178 0 0 1-.518.215L3.83 1.59a2.678 2.678 0 0 0-2.24 2.24l-.175 1.14a1.178 1.178 0 0 1-.215.518l-.68.928a2.678 2.678 0 0 0 0 3.17l.68.928c.113.153.186.33.215.518l.175 1.138a2.678 2.678 0 0 0 2.24 2.24l1.138.175c.187.029.365.102.518.215l.928.68a2.678 2.678 0 0 0 3.17 0l.928-.68a1.17 1.17 0 0 1 .518-.215l1.138-.175a2.678 2.678 0 0 0 2.24-2.24l.175-1.138c.029-.187.102-.365.215-.518l.68-.928a2.678 2.678 0 0 0 0-3.17l-.68-.928a1.179 1.179 0 0 1-.215-.518L14.41 3.83a2.678 2.678 0 0 0-2.24-2.24l-1.138-.175a1.179 1.179 0 0 1-.518-.215L9.585.52zM7.303 1.728c.415-.305.98-.305 1.394 0l.928.68c.348.256.752.423 1.18.489l1.136.174c.51.078.909.478.987.987l.174 1.137c.066.427.233.831.489 1.18l.68.927c.305.415.305.98 0 1.394l-.68.928a2.678 2.678 0 0 0-.489 1.18l-.174 1.136a1.178 1.178 0 0 1-.987.987l-1.137.174a2.678 2.678 0 0 0-1.18.489l-.927.68c-.415.305-.98.305-1.394 0l-.928-.68a2.678 2.678 0 0 0-1.18-.489l-1.136-.174a1.178 1.178 0 0 1-.987-.987l-.174-1.137a2.678 2.678 0 0 0-.489-1.18l-.68-.927a1.178 1.178 0 0 1 0-1.394l.68-.928c.256-.348.423-.752.489-1.18l.174-1.136c.078-.51.478-.909.987-.987l1.137-.174a2.678 2.678 0 0 0 1.18-.489l.927-.68zM11.28 6.78a.75.75 0 0 0-1.06-1.06L7.25 8.69 5.78 7.22a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0l3.5-3.5z"
										clip-rule="evenodd"
									/>
								</svg>
							{/if}
						</div>

						<!-- Action buttons -->
						<div class="flex gap-2">
							<button
								class="flex items-center gap-1 rounded-md border border-[#30363d] bg-[#21262d] px-3 py-1.5 text-sm font-medium text-[#f0f6fc] hover:border-[#8b949e] hover:bg-[#30363d]"
							>
								<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
									<path
										d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"
									/>
								</svg>
								Star
							</button>
							<button
								class="rounded-md border border-[#30363d] bg-[#21262d] px-3 py-1.5 text-sm font-medium text-[#f0f6fc] hover:border-[#8b949e] hover:bg-[#30363d]"
							>
								Follow
							</button>
						</div>
					</div>

					{#if orgData().description}
						<p class="mt-2 text-[#8b949e]">{orgData().description}</p>
					{/if}

					<!-- Organization metadata -->
					<div class="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#8b949e]">
						{#if orgData().website}
							<a href={orgData().website} class="flex items-center gap-1 hover:text-[#58a6ff]">
								<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
									<path
										d="M7.775 3.275a.75.75 0 0 0 1.06 1.06l1.25-1.25a2 2 0 1 1 2.83 2.83l-2.5 2.5a2 2 0 0 1-2.83 0 .75.75 0 0 0-1.06 1.06 3.5 3.5 0 0 0 4.95 0l2.5-2.5a3.5 3.5 0 0 0-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 0 1 0-2.83l2.5-2.5a2 2 0 0 1 2.83 0 .75.75 0 0 0 1.06-1.06 3.5 3.5 0 0 0-4.95 0l-2.5 2.5a3.5 3.5 0 0 0 4.95 4.95l1.25-1.25a.75.75 0 0 0-1.06-1.06l-1.25 1.25a2 2 0 0 1-2.83 0z"
									/>
								</svg>
								{orgData().website.replace(/^https?:\/\//, '')}
							</a>
						{/if}
						{#if orgData().location}
							<span class="flex items-center gap-1">
								<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
									<path
										d="m12.596 11.596-3.535 3.536a1.5 1.5 0 0 1-2.122 0l-3.535-3.536a6.5 6.5 0 1 1 9.192-9.193 6.5 6.5 0 0 1 0 9.193Zm-1.06-8.132v-.001a5 5 0 1 0-7.072 7.072L8 14.07l3.536-3.534a5 5 0 0 0 0-7.072ZM8 9a2 2 0 1 1-.001-3.999A2 2 0 0 1 8 9Z"
									/>
								</svg>
								{orgData().location}
							</span>
						{/if}
						{#if orgData().email}
							<a
								href="mailto:{orgData().email}"
								class="flex items-center gap-1 hover:text-[#58a6ff]"
							>
								<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
									<path
										d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"
									/>
								</svg>
								{orgData().email}
							</a>
						{/if}
						<span class="flex items-center gap-1">
							<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
								<path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
								<path
									d="M1.5 8a6.5 6.5 0 1 1 13 0 6.5 6.5 0 0 1-13 0ZM8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Z"
								/>
							</svg>
							{orgData().followers.toLocaleString()} followers
						</span>
						<span class="flex items-center gap-1">
							{orgData().following.toLocaleString()} following
						</span>
					</div>
				</div>
			</div>

			<!-- Navigation tabs -->
			<nav
				class="flex overflow-x-auto border-b border-[#21262d]"
				aria-label="Organization navigation"
			>
				{#each navItems() as item}
					<a
						href={item.href}
						class="flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors {isActiveTab(
							item
						)
							? 'border-[#fd7e14] text-[#f0f6fc]'
							: 'border-transparent text-[#8b949e] hover:border-[#6e7681] hover:text-[#f0f6fc]'}"
						aria-current={isActiveTab(item) ? 'page' : undefined}
					>
						<!-- Tab icons -->
						{#if item.icon === 'overview'}
							<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
								<path
									d="M1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25V1.75C0 .784.784 0 1.75 0ZM1.5 1.75v12.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25ZM11.75 3a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-1.5 0V4.81L4.28 11.53a.75.75 0 0 1-1.06-1.06L10.19 3.5H3.75a.75.75 0 0 1 0-1.5h8Z"
								/>
							</svg>
						{:else if item.icon === 'repo'}
							<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
								<path
									d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8.5Zm0-1.5v-2h-8A1 1 0 0 0 3.5 4v6.5a1 1 0 0 0 1 1h8Z"
								/>
							</svg>
						{:else if item.icon === 'people'}
							<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
								<path
									d="M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4 4 0 0 0-7.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 3.102 8.05 3.493 3.493 0 0 1 2 5.5ZM11 4a3.001 3.001 0 0 1 2.22 5.018 5.01 5.01 0 0 1 2.56 3.012.75.75 0 0 1-1.44.428 3.509 3.509 0 0 0-2.14-1.681A4.982 4.982 0 0 1 12 15a4.982 4.982 0 0 1-.184-1.223 3.5 3.5 0 0 0-1.816.027.75.75 0 0 1-.218-1.483A5.001 5.001 0 0 1 11 4Z"
								/>
							</svg>
						{:else if item.icon === 'teams'}
							<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
								<path
									d="M1.5 14.25c0-.788.31-1.547.863-2.1a2.972 2.972 0 0 1 2.1-.863H4.5c.788 0 1.547.31 2.1.863.552.553.863 1.312.863 2.1v.75a.75.75 0 0 1-1.5 0v-.75c0-.397-.158-.778-.44-1.06A1.5 1.5 0 0 0 4.5 12.75h-.037c-.397 0-.778.158-1.06.44A1.5 1.5 0 0 0 3 14.25v.75a.75.75 0 0 1-1.5 0v-.75ZM6 6.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0ZM7.5 6.5a1 1 0 1 0 2 0 1 1 0 0 0-2 0ZM14 6.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-1.5 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Z"
								/>
							</svg>
						{:else if item.icon === 'projects'}
							<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
								<path
									d="M1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25V1.75C0 .784.784 0 1.75 0ZM1.5 1.75v12.5c0 .138.112.25.25.25H9.5v-13H1.75a.25.25 0 0 0-.25.25ZM11 14.5h3.25a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25H11Z"
								/>
							</svg>
						{:else if item.icon === 'packages'}
							<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
								<path
									d="m8.878.392 5.25 3.045c.54.314.872.89.872 1.514v6.098a1.75 1.75 0 0 1-.872 1.514l-5.25 3.045a1.75 1.75 0 0 1-1.756 0l-5.25-3.045A1.75 1.75 0 0 1 1 11.049V4.951c0-.624.332-1.201.872-1.514L7.122.392a1.75 1.75 0 0 1 1.756 0ZM7.875 1.69l-4.63 2.685L8 7.133l4.755-2.758-4.63-2.685a.248.248 0 0 0-.25 0ZM2.5 5.677v5.372c0 .09.047.171.125.216l4.625 2.683V8.432Zm6.25 8.271 4.625-2.683a.25.25 0 0 0 .125-.216V5.677L8.75 8.432Z"
								/>
							</svg>
						{:else if item.icon === 'settings'}
							<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
								<path
									d="M8 0a8.2 8.2 0 0 1 .701.031C9.444.095 9.99.645 10.16 1.29l.288 1.107c.018.066.079.158.212.224.231.114.454.243.668.386.123.082.233.09.299.071l1.103-.303c.644-.176 1.392.021 1.82.63.27.385.506.792.704 1.218.315.675.111 1.422-.364 1.891l-.814.806c-.049.048-.098.147-.088.294.016.257.016.515 0 .772-.01.147.039.246.088.294l.814.806c.475.469.679 1.216.364 1.891a7.977 7.977 0 0 1-.704 1.217c-.428.61-1.176.807-1.82.63l-1.103-.303c-.066-.019-.176-.011-.299.071a4.909 4.909 0 0 1-.668.386c-.133.066-.194.158-.212.224l-.288 1.107c-.169.645-.715 1.195-1.459 1.26a8.006 8.006 0 0 1-1.402 0c-.744-.065-1.29-.615-1.459-1.26l-.288-1.107c-.018-.066-.079-.158-.212-.224a4.875 4.875 0 0 1-.668-.386c-.123-.082-.233-.09-.299-.071l-1.103.303c-.644.176-1.392-.021-1.82-.63a8.12 8.12 0 0 1-.704-1.218c-.315-.675-.111-1.422.363-1.891l.815-.806c.05-.048.098-.147.088-.294a6.214 6.214 0 0 1 0-.772c.01-.147-.038-.246-.088-.294l-.815-.806C.635 6.045.431 5.298.746 4.623a7.92 7.92 0 0 1 .704-1.217c.428-.61 1.176-.807 1.82-.63l1.103.303c.066.019.176.011.299-.071.214-.143.437-.272.668-.386.133-.066.194-.158.212-.224l.288-1.107C5.009.645 5.555.095 6.299.03 6.856.003 7.51.003 8 0Zm-.571 1.525c-.036.003-.108.036-.137.146l-.289 1.105c-.147.561-.549.967-.998 1.189-.173.086-.34.183-.5.29-.417.278-.97.423-1.529.27l-1.103-.303c-.109-.03-.175.016-.195.045-.22.312-.412.644-.573.99-.014.031-.021.11.059.19l.815.806c.411.406.562.957.53 1.456a4.709 4.709 0 0 0 0 .582c.032.499-.119 1.05-.53 1.456l-.815.806c-.081.08-.073.159-.059.19.162.346.353.677.573.989.02.030.085.076.195.046l1.102-.303c.56-.153 1.113-.008 1.53.27.161.107.328.204.501.29.447.222.85.629.997 1.189l.289 1.105c.029.109.101.143.137.146a6.6 6.6 0 0 0 1.142 0c.036-.003.108-.036.137-.146l.289-1.105c.147-.561.549-.967.998-1.189.173-.086.34-.183.5-.29.417-.278.97-.423 1.529-.27l1.103.303c.109.029.175-.016.195-.045.22-.313.411-.644.573-.990.014-.031.021-.11-.059-.19l-.815-.806c-.411-.406-.562-.957-.53-1.456a4.709 4.709 0 0 0 0-.582c-.032-.499.119-1.05.53-1.456l.815-.806c.081-.08.073-.159.059-.19a6.464 6.464 0 0 0-.573-.989c-.02-.03-.085-.076-.195-.046l-1.102.303c-.56.153-1.113.008-1.53-.27a4.44 4.44 0 0 0-.501-.29c-.447-.222-.85-.629-.997-1.189l-.289-1.105c-.029-.11-.101-.143-.137-.146a6.6 6.6 0 0 0-1.142 0ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM9.5 8a1.5 1.5 0 1 0-3.001.001A1.5 1.5 0 0 0 9.5 8Z"
								/>
							</svg>
						{/if}

						<span>{item.label}</span>

						{#if item.count !== undefined}
							<span class="rounded-full bg-[#21262d] px-2 py-0.5 text-xs text-[#8b949e]">
								{item.count.toLocaleString()}
							</span>
						{/if}
					</a>
				{/each}
			</nav>
		</div>
	</div>

	<!-- Page content -->
	{@render children()}
</div>
