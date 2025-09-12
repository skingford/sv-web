<script lang="ts">
	// No imports needed for this component
</script>

<svelte:head>
	<title>Unauthorized Access</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-[#0d1117] px-4">
	<div class="w-full max-w-md text-center">
		<div class="mb-8">
			<svg
				class="mx-auto h-24 w-24 text-[#8b949e]"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-5V9m0 0V7m0 2h2m-2 0H10m8-2a9 9 0 11-18 0 9 9 0 0118 0z"
				></path>
			</svg>
		</div>

		<h1 class="mb-4 text-3xl font-bold text-[#f0f6fc]">Access Denied</h1>
		<p class="mb-8 text-[#8b949e]">
			You don't have permission to access this resource. Please contact an administrator if you
			believe this is an error.
		</p>

		<div class="space-y-4">
			<a
				href="/dashboard"
				class="inline-flex w-full items-center justify-center rounded-md bg-[#238636] px-4 py-2 font-medium text-white transition-colors hover:bg-[#2ea043]"
			>
				Go to Dashboard
			</a>
			<a
				href="/"
				class="inline-flex w-full items-center justify-center rounded-md border border-[#30363d] px-4 py-2 font-medium text-[#f0f6fc] transition-colors hover:bg-[#21262d]"
			>
				Go Home
			</a>
		</div>
	</div>
</div>
