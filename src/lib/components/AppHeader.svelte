<script lang="ts">
	import { user, isAuthenticated, logout } from '$lib/stores/auth';

	// Mock notifications count - replace with real data
	let notifications = 3;

	// Navigation items
	const navItems = [
		{ label: 'Platform', href: '/platform', hasDropdown: true },
		{ label: 'Solutions', href: '/solutions', hasDropdown: true },
		{ label: 'Resources', href: '/resources', hasDropdown: true },
		{ label: 'Open Source', href: '/opensource', hasDropdown: true },
		{ label: 'Enterprise', href: '/enterprise' },
		{ label: 'Pricing', href: '/pricing' }
	];

	let searchQuery = '';
	let showMobileMenu = false;
	let showUserMenu = false;
	let showNotifications = false;

	// Search suggestions - mock data
	let searchSuggestions = [
		{ type: 'repository', name: 'microsoft/vscode', description: 'Visual Studio Code' },
		{ type: 'user', name: 'torvalds', description: 'Linus Torvalds' },
		{ type: 'organization', name: 'github', description: 'GitHub' }
	];

	let showSearchSuggestions = $derived(searchQuery.length > 0);
</script>

<header class="AppHeader">
	<div class="AppHeader-globalBar">
		<div class="AppHeader-globalBar-start">
			<!-- GitHub Logo -->
			<a href="/" class="AppHeader-logo" aria-label="Homepage">
				<svg
					height="32"
					aria-hidden="true"
					viewBox="0 0 16 16"
					version="1.1"
					width="32"
					class="octicon octicon-mark-github"
				>
					<path
						fill="currentColor"
						d="M8 0c4.42 0 8 3.58 8 8 0 3.54-2.29 6.53-5.47 7.59-.4-.07-.55-.17-.55-.38 0-.19.01-.82.01-1.49 2.01.37 2.53-.49 2.69-.94.09-.23.48-.94.82-1.13.28-.15.68-.52-.01-.53-.63-.01-1.08.58-1.23.82-.72 1.21-1.87.87-2.33.66-.07-.52-.28-.87-.51-1.07 1.78-.2 3.64-.89 3.64-3.95 0-.87-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.21-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.21.73.90.82 1.13.16.45.68.81 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.31-.55.38C2.29 14.53 0 11.54 0 8c0-4.42 3.58-8 8-8Z"
					></path>
				</svg>
			</a>

			<!-- Main Navigation -->
			<nav class="AppHeader-nav" aria-label="Global">
				{#each navItems as item}
					<div class="AppHeader-nav-item">
						<a href={item.href} class="AppHeader-nav-link">
							{item.label}
							{#if item.hasDropdown}
								<svg
									aria-hidden="true"
									height="16"
									viewBox="0 0 16 16"
									version="1.1"
									width="16"
									class="octicon octicon-triangle-down"
								>
									<path
										d="m4.427 7.427 3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.396 7H4.604a.25.25 0 0 0-.177.427Z"
									></path>
								</svg>
							{/if}
						</a>
					</div>
				{/each}
			</nav>
		</div>

		<div class="AppHeader-globalBar-end">
			<!-- Search -->
			<div class="AppHeader-search">
				<div class="AppHeader-search-input-container">
					<svg
						aria-hidden="true"
						height="16"
						viewBox="0 0 16 16"
						version="1.1"
						width="16"
						class="octicon octicon-search AppHeader-search-icon"
					>
						<path
							d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z"
						></path>
					</svg>
					<input
						type="text"
						placeholder="Search or jump to..."
						bind:value={searchQuery}
						class="AppHeader-search-input"
						aria-label="Search or jump to..."
					/>
					<kbd class="AppHeader-search-kbd">/</kbd>
				</div>

				<!-- Search Suggestions -->
				{#if showSearchSuggestions}
					<div class="AppHeader-search-suggestions">
						{#each searchSuggestions as suggestion}
							<a href="/{suggestion.name}" class="AppHeader-search-suggestion">
								<div class="AppHeader-search-suggestion-icon">
									{#if suggestion.type === 'repository'}
										<svg
											aria-hidden="true"
											height="16"
											viewBox="0 0 16 16"
											version="1.1"
											width="16"
											class="octicon octicon-repo"
										>
											<path
												d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8.5Zm0-1.5v-2h-8A1 1 0 0 0 3.5 4v6.5a1 1 0 0 0 1 1h8Z"
											></path>
										</svg>
									{:else if suggestion.type === 'user'}
										<svg
											aria-hidden="true"
											height="16"
											viewBox="0 0 16 16"
											version="1.1"
											width="16"
											class="octicon octicon-person"
										>
											<path
												d="M10.561 8.073a6.005 6.005 0 0 1 3.432 5.142.75.75 0 1 1-1.498.07 4.5 4.5 0 0 0-8.99 0 .75.75 0 0 1-1.498-.07 6.004 6.004 0 0 1 3.431-5.142 3.999 3.999 0 1 1 5.123 0ZM10.5 5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"
											></path>
										</svg>
									{:else}
										<svg
											aria-hidden="true"
											height="16"
											viewBox="0 0 16 16"
											version="1.1"
											width="16"
											class="octicon octicon-organization"
										>
											<path
												d="M1.75 16A1.75 1.75 0 0 1 0 14.25V1.75C0 .784.784 0 1.75 0h8.5C11.216 0 12 .784 12 1.75v12.5c0 .085-.006.168-.018.25h2.268a.25.25 0 0 0 .25-.25V8.285a.25.25 0 0 0-.111-.208l-1.055-.703a.749.749 0 1 1 .832-1.248l1.055.703c.487.325.779.871.779 1.456v5.965A1.75 1.75 0 0 1 14.25 16h-3.5a.766.766 0 0 1-.197-.026c-.099.017-.2.026-.303.026h-8.5ZM14.5 10.24v-.001l-.001.001-1.06-.703 1.062.703ZM1.75 1.5a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25h-8.5Z"
											></path>
										</svg>
									{/if}
								</div>
								<div class="AppHeader-search-suggestion-content">
									<div class="AppHeader-search-suggestion-title">{suggestion.name}</div>
									<div class="AppHeader-search-suggestion-description">
										{suggestion.description}
									</div>
								</div>
							</a>
						{/each}
					</div>
				{/if}
			</div>

			<!-- User Actions -->
			{#if $isAuthenticated && $user}
				<div class="AppHeader-user">
					<!-- Create Menu -->
					<div class="AppHeader-user-item">
						<button class="AppHeader-button" aria-label="Create new..." aria-expanded="false">
							<svg
								aria-hidden="true"
								height="16"
								viewBox="0 0 16 16"
								version="1.1"
								width="16"
								class="octicon octicon-plus"
							>
								<path
									d="M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z"
								></path>
							</svg>
							<svg
								aria-hidden="true"
								height="16"
								viewBox="0 0 16 16"
								version="1.1"
								width="16"
								class="octicon octicon-triangle-down"
							>
								<path
									d="m4.427 7.427 3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.396 7H4.604a.25.25 0 0 0-.177.427Z"
								></path>
							</svg>
						</button>
					</div>

					<!-- Issues -->
					<div class="AppHeader-user-item">
						<a href="/issues" class="AppHeader-button" aria-label="Issues">
							<svg
								aria-hidden="true"
								height="16"
								viewBox="0 0 16 16"
								version="1.1"
								width="16"
								class="octicon octicon-issue-opened"
							>
								<path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
								<path
									d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"
								></path>
							</svg>
						</a>
					</div>

					<!-- Pull Requests -->
					<div class="AppHeader-user-item">
						<a href="/pulls" class="AppHeader-button" aria-label="Pull requests">
							<svg
								aria-hidden="true"
								height="16"
								viewBox="0 0 16 16"
								version="1.1"
								width="16"
								class="octicon octicon-git-pull-request"
							>
								<path
									d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z"
								></path>
							</svg>
						</a>
					</div>

					<!-- Notifications -->
					<div class="AppHeader-user-item">
						<button
							class="AppHeader-button AppHeader-button--hasIndicator"
							aria-label="Notifications"
							on:click={() => (showNotifications = !showNotifications)}
						>
							<svg
								aria-hidden="true"
								height="16"
								viewBox="0 0 16 16"
								version="1.1"
								width="16"
								class="octicon octicon-bell"
							>
								<path
									d="M8 16a2 2 0 0 0 1.985-1.75c.017-.137-.097-.25-.235-.25h-3.5c-.138 0-.252.113-.235.25A2 2 0 0 0 8 16ZM3 5a5 5 0 0 1 10 0v2.947c0 .05.015.098.042.139l1.703 2.555A.482.482 0 0 1 14.3 11.5H1.7a.482.482 0 0 1-.445-.859l1.703-2.555A.25.25 0 0 0 3 8.947V5Z"
								></path>
							</svg>
							{#if notifications > 0}
								<span class="AppHeader-button-indicator">{notifications}</span>
							{/if}
						</button>
					</div>

					<!-- User Menu -->
					<div class="AppHeader-user-item">
						<button
							class="AppHeader-user-avatar"
							aria-label="View profile and more"
							on:click={() => (showUserMenu = !showUserMenu)}
						>
							<img
								src={$user.avatar || 'https://github.com/octocat.png'}
								alt="@{$user.username}"
								width="20"
								height="20"
							/>
							<svg
								aria-hidden="true"
								height="16"
								viewBox="0 0 16 16"
								version="1.1"
								width="16"
								class="octicon octicon-triangle-down"
							>
								<path
									d="m4.427 7.427 3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.396 7H4.604a.25.25 0 0 0-.177.427Z"
								></path>
							</svg>
						</button>
					</div>
				</div>
			{:else}
				<!-- Sign In/Up -->
				<div class="AppHeader-actions">
					<a href="/login" class="AppHeader-link">Sign in</a>
					<a href="/signup" class="AppHeader-button AppHeader-button--primary">Sign up</a>
				</div>
			{/if}

			<!-- Mobile Menu Toggle -->
			<button
				class="AppHeader-button AppHeader-button--mobile"
				aria-label="Toggle navigation"
				on:click={() => (showMobileMenu = !showMobileMenu)}
			>
				<svg
					aria-hidden="true"
					height="24"
					viewBox="0 0 16 16"
					version="1.1"
					width="24"
					class="octicon octicon-three-bars"
				>
					<path
						d="M1 2.75A.75.75 0 0 1 1.75 2h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 2.75Zm0 5A.75.75 0 0 1 1.75 7h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 7.75ZM1.75 12h12.5a.75.75 0 0 1 0 1.5H1.75a.75.75 0 0 1 0-1.5Z"
					></path>
				</svg>
			</button>
		</div>
	</div>
</header>

<style>
	.AppHeader {
		background-color: var(--AppHeader-bg, #010409);
		border-bottom: 1px solid #21262d;
		position: sticky;
		top: 0;
		z-index: 32;
	}

	.AppHeader-globalBar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 16px;
		height: 64px;
		max-width: 1280px;
		margin: 0 auto;
	}

	.AppHeader-globalBar-start {
		display: flex;
		align-items: center;
		gap: 16px;
		flex: 1;
		min-width: 0;
	}

	.AppHeader-globalBar-end {
		display: flex;
		align-items: center;
		gap: 8px;
		flex-shrink: 0;
	}

	/* Logo */
	.AppHeader-logo {
		display: flex;
		align-items: center;
		color: var(--fgColor-default, #f0f6fc);
		text-decoration: none;
		flex-shrink: 0;
	}

	.AppHeader-logo:hover {
		color: #8b949e;
	}

	/* Navigation */
	.AppHeader-nav {
		display: none;
		align-items: center;
		gap: 0;
	}

	@media (min-width: 1012px) {
		.AppHeader-nav {
			display: flex;
		}
	}

	.AppHeader-nav-item {
		position: relative;
	}

	.AppHeader-nav-link {
		display: flex;
		align-items: center;
		gap: 4px;
		padding: 8px 16px;
		color: var(--fgColor-default, #f0f6fc);
		text-decoration: none;
		font-size: 14px;
		font-weight: 600;
		border-radius: 6px;
		transition: color 0.2s ease;
	}

	.AppHeader-nav-link:hover {
		color: #8b949e;
	}

	.AppHeader-nav-link svg {
		width: 12px;
		height: 12px;
		opacity: 0.7;
	}

	/* Search */
	.AppHeader-search {
		position: relative;
		flex: 1;
		max-width: 272px;
		margin: 0 16px;
	}

	@media (max-width: 768px) {
		.AppHeader-search {
			display: none;
		}
	}

	.AppHeader-search-input-container {
		position: relative;
		display: flex;
		align-items: center;
	}

	.AppHeader-search-input {
		width: 100%;
		padding: 5px 12px 5px 32px;
		background-color: #0d1117;
		border: 1px solid #30363d;
		border-radius: 6px;
		color: var(--fgColor-default, #f0f6fc);
		font-size: 14px;
		line-height: 20px;
		transition:
			border-color 0.2s ease,
			box-shadow 0.2s ease;
	}

	.AppHeader-search-input::placeholder {
		color: #8b949e;
	}

	.AppHeader-search-input:focus {
		outline: none;
		border-color: #58a6ff;
		box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.3);
	}

	.AppHeader-search-icon {
		position: absolute;
		left: 8px;
		color: #8b949e;
		pointer-events: none;
	}

	.AppHeader-search-kbd {
		position: absolute;
		right: 8px;
		padding: 2px 6px;
		background-color: #21262d;
		border: 1px solid #30363d;
		border-radius: 3px;
		color: #8b949e;
		font-size: 11px;
		font-family:
			ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;
		pointer-events: none;
	}

	.AppHeader-search-suggestions {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		background-color: #161b22;
		border: 1px solid #30363d;
		border-radius: 6px;
		box-shadow: 0 16px 32px rgba(1, 4, 9, 0.85);
		margin-top: 4px;
		overflow: hidden;
		z-index: 99;
	}

	.AppHeader-search-suggestion {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 12px;
		color: var(--fgColor-default, #f0f6fc);
		text-decoration: none;
		border-bottom: 1px solid #21262d;
		transition: background-color 0.2s ease;
	}

	.AppHeader-search-suggestion:last-child {
		border-bottom: none;
	}

	.AppHeader-search-suggestion:hover {
		background-color: #21262d;
	}

	.AppHeader-search-suggestion-icon {
		color: #8b949e;
		flex-shrink: 0;
	}

	.AppHeader-search-suggestion-content {
		flex: 1;
		min-width: 0;
	}

	.AppHeader-search-suggestion-title {
		font-size: 14px;
		font-weight: 600;
	}

	.AppHeader-search-suggestion-description {
		font-size: 12px;
		color: #8b949e;
	}

	/* User Actions */
	.AppHeader-user {
		display: none;
		align-items: center;
		gap: 8px;
	}

	@media (min-width: 768px) {
		.AppHeader-user {
			display: flex;
		}
	}

	.AppHeader-user-item {
		position: relative;
	}

	.AppHeader-button {
		display: flex;
		align-items: center;
		gap: 4px;
		padding: 5px 8px;
		background: transparent;
		border: 1px solid transparent;
		border-radius: 6px;
		color: var(--fgColor-default, #f0f6fc);
		font-size: 14px;
		text-decoration: none;
		cursor: pointer;
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease;
	}

	.AppHeader-button:hover {
		background-color: #21262d;
		border-color: #30363d;
	}

	.AppHeader-button--primary {
		background-color: #238636;
		border-color: #238636;
		color: #ffffff;
		font-weight: 500;
	}

	.AppHeader-button--primary:hover {
		background-color: #2ea043;
		border-color: #2ea043;
	}

	.AppHeader-button--hasIndicator {
		position: relative;
	}

	.AppHeader-button-indicator {
		position: absolute;
		top: -2px;
		right: -2px;
		min-width: 16px;
		height: 16px;
		padding: 0 4px;
		background-color: #da3633;
		border: 2px solid var(--AppHeader-bg, #010409);
		border-radius: 8px;
		color: #ffffff;
		font-size: 10px;
		font-weight: 600;
		line-height: 12px;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.AppHeader-user-avatar {
		display: flex;
		align-items: center;
		gap: 4px;
		padding: 2px 4px 2px 2px;
		background: transparent;
		border: 1px solid transparent;
		border-radius: 6px;
		cursor: pointer;
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease;
	}

	.AppHeader-user-avatar:hover {
		background-color: #21262d;
		border-color: #30363d;
	}

	.AppHeader-user-avatar img {
		border-radius: 50%;
	}

	.AppHeader-user-avatar svg {
		width: 12px;
		height: 12px;
		color: #8b949e;
	}

	/* Actions for non-signed in users */
	.AppHeader-actions {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.AppHeader-link {
		padding: 5px 8px;
		color: var(--fgColor-default, #f0f6fc);
		text-decoration: none;
		font-size: 14px;
		border-radius: 6px;
		transition: color 0.2s ease;
	}

	.AppHeader-link:hover {
		color: #8b949e;
	}

	/* Mobile Menu Button */
	.AppHeader-button--mobile {
		display: flex;
		padding: 4px;
	}

	@media (min-width: 768px) {
		.AppHeader-button--mobile {
			display: none;
		}
	}

	/* Octicons */
	.octicon {
		display: inline-block;
		vertical-align: text-top;
		fill: currentColor;
	}

	/* Responsive adjustments */
	@media (max-width: 544px) {
		.AppHeader-globalBar {
			padding: 0 8px;
		}

		.AppHeader-globalBar-start {
			gap: 8px;
		}
	}

	@media (max-width: 1011px) {
		.AppHeader-search {
			max-width: 200px;
		}
	}
</style>
