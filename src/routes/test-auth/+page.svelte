<script lang="ts">
	import { user, isAuthenticated } from '$lib/stores/auth';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Auth Test</title>
</svelte:head>

<div class="min-h-screen bg-[#0d1117] p-8">
	<div class="mx-auto max-w-2xl">
		<h1 class="mb-8 text-3xl font-bold text-[#f0f6fc]">Authentication Test</h1>

		<div class="space-y-6">
			<div class="rounded-lg border border-[#30363d] bg-[#161b22] p-6">
				<h2 class="mb-4 text-xl font-semibold text-[#f0f6fc]">Authentication Status</h2>
				<p class="mb-2 text-[#8b949e]">
					Status: <span class="text-[#f0f6fc]"
						>{$isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</span
					>
				</p>
				{#if $user}
					<div class="space-y-2">
						<p class="text-[#8b949e]">
							Username: <span class="text-[#f0f6fc]">{$user.username}</span>
						</p>
						<p class="text-[#8b949e]">Email: <span class="text-[#f0f6fc]">{$user.email}</span></p>
						<p class="text-[#8b949e]">Role: <span class="text-[#f0f6fc]">{$user.role}</span></p>
					</div>
				{/if}
			</div>

			<div class="rounded-lg border border-[#30363d] bg-[#161b22] p-6">
				<h2 class="mb-4 text-xl font-semibold text-[#f0f6fc]">Test Links</h2>
				<div class="space-y-2">
					<a href="/login" class="block text-[#58a6ff] hover:underline">Login Page</a>
					<a href="/dashboard" class="block text-[#58a6ff] hover:underline">Dashboard (Protected)</a
					>
					<a href="/admin" class="block text-[#58a6ff] hover:underline">Admin (Admin Only)</a>
					<a href="/settings" class="block text-[#58a6ff] hover:underline">Settings (Protected)</a>
					<a href="/logout" class="block text-[#58a6ff] hover:underline">Logout</a>
				</div>
			</div>

			<div class="rounded-lg border border-[#30363d] bg-[#161b22] p-6">
				<h2 class="mb-4 text-xl font-semibold text-[#f0f6fc]">Test Credentials</h2>
				<div class="space-y-2 text-sm">
					<p class="text-[#8b949e]">
						Regular User: <code class="text-[#f0f6fc]">demo@example.com</code> /
						<code class="text-[#f0f6fc]">password</code>
					</p>
					<p class="text-[#8b949e]">
						Admin User: <code class="text-[#f0f6fc]">admin@example.com</code> /
						<code class="text-[#f0f6fc]">admin123</code>
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
