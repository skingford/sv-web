<script lang="ts">
	import { goto } from '$app/navigation';

	function logout() {
		// Clear session and redirect to login
		document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		goto('/login');
	}
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<nav class="border-b border-gray-200 bg-white shadow-sm">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 justify-between">
				<div class="flex items-center">
					<svg class="h-8 w-8 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
						<path
							d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
						/>
					</svg>
					<span class="ml-2 text-xl font-semibold text-gray-900">GitHub</span>
				</div>
				<div class="flex items-center space-x-4">
					<span class="text-sm text-gray-700">Welcome back!</span>
					<button
						on:click={logout}
						class="text-sm text-gray-500 transition-colors hover:text-gray-700"
					>
						Sign out
					</button>
				</div>
			</div>
		</div>
	</nav>

	<main class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
		<div class="px-4 py-6 sm:px-0">
			<div
				class="flex h-96 items-center justify-center rounded-lg border-4 border-dashed border-gray-200"
			>
				<div class="text-center">
					<h1 class="mb-4 text-3xl font-bold text-gray-900">Welcome to your Dashboard!</h1>
					<p class="text-gray-600">You have successfully logged in.</p>
					<p class="mt-2 text-sm text-gray-500">
						Demo credentials: <code class="rounded bg-gray-100 px-2 py-1">demo@example.com</code> /
						<code class="rounded bg-gray-100 px-2 py-1">password</code>
					</p>
				</div>
			</div>
		</div>
	</main>
</div>
