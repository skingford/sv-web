<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';

	let username = $state('');
	let password = $state('');
	let isLoading = $state(false);
	let errorMessage = $state('');

	async function handleSubmit(event: Event) {
		event.preventDefault();

		// 重置错误信息
		errorMessage = '';

		// 简单验证
		if (!username.trim()) {
			errorMessage = 'Please enter your username or email address';
			return;
		}

		if (!password) {
			errorMessage = 'Please enter your password';
			return;
		}

		isLoading = true;

		try {
			// 模拟登录 API 调用
			await new Promise((resolve) => setTimeout(resolve, 1000));

			console.log('Login with:', { username, password });

			// 这里你可以添加实际的登录逻辑
			// 例如：调用你的 API、重定向到仪表板等
			alert('登录成功！(这是一个演示)');
		} catch (error) {
			errorMessage = 'Login failed. Please check your credentials and try again.';
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Sign in to GitHub</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-background p-4">
	<div class="mx-auto w-full max-w-sm">
		<!-- GitHub Logo -->
		<div class="mb-8 flex justify-center">
			<svg
				height="48"
				aria-hidden="true"
				viewBox="0 0 16 16"
				version="1.1"
				width="48"
				class="fill-foreground"
			>
				<path
					fill-rule="evenodd"
					d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
				></path>
			</svg>
		</div>

		<Card class="shadow-lg">
			<CardHeader class="pb-4">
				<CardTitle class="text-center text-xl font-semibold">Sign in to GitHub</CardTitle>
			</CardHeader>
			<CardContent class="space-y-4">
				<!-- 错误信息显示 -->
				{#if errorMessage}
					<div
						class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200"
					>
						{errorMessage}
					</div>
				{/if}

				<form onsubmit={handleSubmit} class="space-y-4">
					<div class="space-y-2">
						<Label for="username">Username or email address</Label>
						<Input
							id="username"
							type="text"
							bind:value={username}
							placeholder="Username or email address"
							class="w-full"
							disabled={isLoading}
							required
						/>
					</div>

					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<Label for="password">Password</Label>
							<a href="/forgot-password" class="text-sm text-primary hover:underline">
								Forgot password?
							</a>
						</div>
						<Input
							id="password"
							type="password"
							bind:value={password}
							placeholder="Password"
							class="w-full"
							disabled={isLoading}
							required
						/>
					</div>

					<Button
						type="submit"
						class="w-full bg-green-600 text-white hover:bg-green-700"
						disabled={isLoading}
					>
						{#if isLoading}
							<svg
								class="mr-3 -ml-1 h-4 w-4 animate-spin text-white"
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
					</Button>
				</form>

				<Separator />

				<div class="text-center">
					<p class="text-sm text-muted-foreground">
						New to GitHub?
						<a href="/signup" class="ml-1 text-primary hover:underline"> Create an account </a>
					</p>
				</div>

				<Separator />

				<div class="space-y-3">
					<p class="text-center text-xs text-muted-foreground">
						By signing in, you agree to our
						<a href="/terms" class="text-primary hover:underline">Terms</a>
						and
						<a href="/privacy" class="text-primary hover:underline">Privacy Policy</a>
					</p>

					<div class="text-center">
						<Button variant="outline" class="w-full">
							<svg class="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
								<path
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								/>
								<path
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								/>
								<path
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								/>
								<path
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								/>
							</svg>
							Continue with Google
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>

		<!-- Enterprise Link -->
		<div class="mt-6 text-center">
			<p class="text-sm text-muted-foreground">
				Looking for GitHub Enterprise?
				<a href="/enterprise" class="ml-1 text-primary hover:underline"> Learn more </a>
			</p>
		</div>
	</div>
</div>
