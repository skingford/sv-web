<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	const form = $state<{
		username: string;
		email: string;
		password: string;
	}>({
		username: '',
		email: '',
		password: ''
	});

	let errors = {
		username: '',
		email: '',
		password: ''
	};

	let isLoading = $state(false);

	function validateUsername(username: string) {
		if (!username) return 'Username is required';
		if (username.length < 3) return 'Username must be at least 3 characters';
		if (!/^[a-zA-Z0-9-_]+$/.test(username))
			return 'Username can only contain letters, numbers, hyphens, and underscores';
		return '';
	}

	function validateEmail(email: string) {
		if (!email) return 'Email is required';
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address';
		return '';
	}

	function validatePassword(password: string) {
		if (!password) return 'Password is required';
		if (password.length < 8) return 'Password must be at least 8 characters';
		if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password))
			return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
		return '';
	}

	function handleInput(field: keyof typeof form) {
		return (event: Event) => {
			const target = event.target as HTMLInputElement;
			form[field] = target.value;

			// Clear error when user starts typing
			if (errors[field]) {
				errors[field] = '';
			}
		};
	}

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		// Validate all fields
		errors.username = validateUsername(form.username);
		errors.email = validateEmail(form.email);
		errors.password = validatePassword(form.password);

		// Check if there are any errors
		if (errors.username || errors.email || errors.password) {
			return;
		}

		isLoading = true;

		// Simulate API call
		setTimeout(() => {
			isLoading = false;
			// In a real app, you'd handle the actual registration here
			console.log('Registration data:', form);
			goto('/login');
		}, 1500);
	}
</script>

<svelte:head>
	<title>Sign up for GitHub</title>
</svelte:head>

<div class="flex min-h-screen flex-col justify-center bg-primary-50 py-12 sm:px-6 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<!-- GitHub Logo -->
		<div class="flex justify-center">
			<svg class="h-12 w-12 text-primary-900" fill="currentColor" viewBox="0 0 24 24">
				<path
					d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
				/>
			</svg>
		</div>

		<h2 class="mt-6 text-center text-3xl font-bold text-primary-900">Join GitHub</h2>
		<p class="mt-2 text-center text-sm text-primary-600">Create your account</p>
	</div>

	<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
		<div class="border border-primary-200 bg-white px-4 py-8 shadow-lg sm:rounded-lg sm:px-10">
			<form class="space-y-6" onsubmit={handleSubmit} use:enhance>
				<!-- Username Field -->
				<div>
					<label for="username" class="block text-sm font-medium text-primary-700">
						Username
					</label>
					<div class="mt-1">
						<input
							id="username"
							name="username"
							type="text"
							autocomplete="username"
							required
							class="block w-full appearance-none rounded-md border border-primary-300 px-3 py-2 placeholder-primary-400 focus:border-secondary-500 focus:ring-secondary-500 focus:outline-none sm:text-sm"
							class:border-red-300={errors.username}
							class:focus:ring-red-500={errors.username}
							class:focus:border-red-500={errors.username}
							placeholder="Enter your username"
							bind:value={form.username}
							oninput={handleInput('username')}
						/>
						{#if errors.username}
							<p class="mt-2 text-sm text-red-600">{errors.username}</p>
						{/if}
					</div>
				</div>

				<!-- Email Field -->
				<div>
					<label for="email" class="block text-sm font-medium text-primary-700">
						Email address
					</label>
					<div class="mt-1">
						<input
							id="email"
							name="email"
							type="email"
							autocomplete="email"
							required
							class="block w-full appearance-none rounded-md border border-primary-300 px-3 py-2 placeholder-primary-400 focus:border-secondary-500 focus:ring-secondary-500 focus:outline-none sm:text-sm"
							class:border-red-300={errors.email}
							class:focus:ring-red-500={errors.email}
							class:focus:border-red-500={errors.email}
							placeholder="Enter your email"
							bind:value={form.email}
							oninput={handleInput('email')}
						/>
						{#if errors.email}
							<p class="mt-2 text-sm text-red-600">{errors.email}</p>
						{/if}
					</div>
				</div>

				<!-- Password Field -->
				<div>
					<label for="password" class="block text-sm font-medium text-primary-700">
						Password
					</label>
					<div class="mt-1">
						<input
							id="password"
							name="password"
							type="password"
							autocomplete="new-password"
							required
							class="block w-full appearance-none rounded-md border border-primary-300 px-3 py-2 placeholder-primary-400 focus:border-secondary-500 focus:ring-secondary-500 focus:outline-none sm:text-sm"
							class:border-red-300={errors.password}
							class:focus:ring-red-500={errors.password}
							class:focus:border-red-500={errors.password}
							placeholder="Create a password"
							bind:value={form.password}
							oninput={handleInput('password')}
						/>
						{#if errors.password}
							<p class="mt-2 text-sm text-red-600">{errors.password}</p>
						{/if}
					</div>
					<div class="mt-2">
						<p class="text-xs text-primary-500">
							Make sure it's at least 8 characters including a number, lowercase letter, and
							uppercase letter.
						</p>
					</div>
				</div>

				<!-- Terms and Privacy -->
				<div class="text-xs text-primary-500">
					<p>
						By creating an account, you agree to the
						<a href="/terms" class="text-secondary-600 underline hover:text-secondary-500"
							>Terms of Service</a
						>. For more information about GitHub's privacy practices, see the
						<a href="/privacy" class="text-secondary-600 underline hover:text-secondary-500"
							>GitHub Privacy Statement</a
						>. We'll occasionally send you account-related emails.
					</p>
				</div>

				<!-- Submit Button -->
				<div>
					<button
						type="submit"
						disabled={isLoading}
						class="group relative flex w-full justify-center rounded-md border border-transparent bg-secondary-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-secondary-700 focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
					>
						{#if isLoading}
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
							Creating account...
						{:else}
							Create account
						{/if}
					</button>
				</div>
			</form>

			<!-- Sign In Link -->
			<div class="mt-6">
				<div class="relative">
					<div class="absolute inset-0 flex items-center">
						<div class="w-full border-t border-primary-300"></div>
					</div>
					<div class="relative flex justify-center text-sm">
						<span class="bg-white px-2 text-primary-500">Already have an account?</span>
					</div>
				</div>

				<div class="mt-6">
					<a
						href="/login"
						class="flex w-full justify-center rounded-md border border-primary-300 bg-white px-4 py-2 text-sm font-medium text-primary-700 shadow-sm transition-colors duration-200 hover:bg-primary-50 focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2 focus:outline-none"
					>
						Sign in to your account
					</a>
				</div>
			</div>
		</div>
	</div>
</div>
