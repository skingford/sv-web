<script lang="ts">
	import { goto } from '$app/navigation';
	import { login } from '$lib/api/auth';
	import type { LoginReq } from '$lib/api/auth';
	import { localCache, LoginInfoCacheKey } from '$lib/utils/cache';

	// export let form: ActionData;

	const form = $state<LoginReq>({
		username: 'admin',
		password: 'Admin!2025'
	});

	const formValid = $state({
		error: '',
		isLoading: false,
		rememberMe: false
	});

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();

		// 设置加载状态
		formValid.isLoading = true;
		formValid.error = '';

		try {
			console.log('[ login ] >', form);

			// 调用 alova API
			const data = await login(form);

			console.log('登录成功:', data);

			localCache.set(LoginInfoCacheKey, data, {
				ttl: data.expires_in,
				encrypt: true
			});

			// 跳转到首页
			goto('/dashboard');
		} catch (error: any) {
			console.error('登录失败:', error);
			formValid.error = error.message || '登录失败，请检查用户名和密码';
		} finally {
			// 重置加载状态
			formValid.isLoading = false;
		}
	};
</script>

<svelte:head>
	<title>Sign in to GitHub</title>
</svelte:head>

<div class="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<!-- GitHub Logo -->
		<div class="flex justify-center">
			<svg class="h-12 w-auto text-gray-900" fill="currentColor" viewBox="0 0 24 24">
				<path
					d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
				/>
			</svg>
		</div>
		<h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
			Sign in to GitHub
		</h2>
	</div>

	<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
		<div class="border border-gray-200 bg-white px-4 py-8 shadow-lg sm:rounded-lg sm:px-10">
			{#if formValid.error}
				<div class="mb-4 rounded-md border border-red-200 bg-red-50 p-4">
					<div class="flex">
						<div class="flex-shrink-0">
							<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
						<div class="ml-3">
							<p class="text-sm text-red-800">{formValid.error}</p>
						</div>
					</div>
				</div>
			{/if}

			<form class="space-y-6" onsubmit={handleSubmit}>
				<div>
					<label for="username" class="mb-2 block text-sm font-medium text-gray-700">
						Username or email address
					</label>
					<input
						id="username"
						name="username"
						type="text"
						autocomplete="username"
						required
						bind:value={form.username}
						class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
						placeholder="Enter your username or email address"
					/>
				</div>

				<div>
					<div class="mb-2 flex items-center justify-between">
						<label for="password" class="block text-sm font-medium text-gray-700"> Password </label>
						<a href="/forgot-password" class="text-sm text-blue-600 hover:text-blue-500">
							Forgot password?
						</a>
					</div>
					<input
						id="password"
						name="password"
						type="password"
						autocomplete="current-password"
						required
						bind:value={form.password}
						class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
						placeholder="Enter your password"
					/>
				</div>

				<div class="flex items-center">
					<input
						id="remember-me"
						name="remember-me"
						type="checkbox"
						bind:checked={formValid.rememberMe}
						class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
					/>
					<label for="remember-me" class="ml-2 block text-sm text-gray-700">
						Keep me signed in
					</label>
				</div>

				<div>
					<button
						type="submit"
						disabled={formValid.isLoading}
						class="flex w-full justify-center rounded-md bg-green-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
					>
						{#if formValid.isLoading}
							<svg
								class="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							Signing in...
						{:else}
							Sign in
						{/if}
					</button>
				</div>
			</form>

			<div class="mt-6">
				<div class="relative">
					<div class="absolute inset-0 flex items-center">
						<div class="w-full border-t border-gray-300"></div>
					</div>
					<div class="relative flex justify-center text-sm">
						<span class="bg-white px-2 text-gray-500">Or</span>
					</div>
				</div>

				<div class="mt-6">
					<button
						type="button"
						class="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
					>
						<svg class="mr-2 h-5 w-5" viewBox="0 0 24 24">
							<path
								fill="currentColor"
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							/>
							<path
								fill="currentColor"
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							/>
							<path
								fill="currentColor"
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
							/>
							<path
								fill="currentColor"
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							/>
						</svg>
						Continue with Google
					</button>
				</div>
			</div>
		</div>

		<div class="mt-6">
			<div class="text-center">
				<span class="text-sm text-gray-600">
					New to GitHub?
					<a href="/signup" class="font-medium text-blue-600 hover:text-blue-500">
						Create an account
					</a>
				</span>
			</div>
		</div>
	</div>
</div>
