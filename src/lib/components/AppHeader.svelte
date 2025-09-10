<header class="AppHeader">
	<h2 class="AppHeader-sr-only">Navigation Menu</h2>
	<div class="AppHeader-globalBar">
		<div class="AppHeader-globalBar-start responsive-context-region">
			<div>按钮图标</div>
			<div class="AppHeader-logo ml-1">logo</div>
			<div class="AppHeader-context-full">
				<nav>
					<a href="/">
						<span>Dashboard</span>
					</a>
				</nav>
			</div>
		</div>
		<div class="AppHeader-globalBar-end">
			<div class="AppHeader-search-wrap AppHeader-search-wrap--hasTrailing">
				<div class="AppHeader-search-control AppHeader-search-control-overflow">
					<label
						for="AppHeader-searchInput"
						aria-label="Search or jump to…"
						class="AppHeader-search-visual--leading"
					>
						<svg
							aria-hidden="true"
							height="16"
							viewBox="0 0 16 16"
							version="1.1"
							width="16"
							data-view-component="true"
							class="octicon octicon-search"
						>
							<path
								d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z"
							></path>
						</svg>
					</label>

					<button type="button">
						<div class="overflow-hidden">
							<span id="qb-input-query" data-target="qbsearch-input.inputButtonText">
								Type <kbd class="AppHeader-search-kbd">/</kbd> to search
							</span>
						</div>
					</button>
				</div>
			</div>

			<div>1</div>
			<div>1</div>
			<div>1</div>
			<div>1</div>
		</div>
	</div>
</header>

<style lang="scss">
	.AppHeader {
		background-color: #010409;
		color: #f0f6fc;
		background: var(--AppHeader-bg);
		box-shadow: inset 0 calc(var(--borderWidth-thin, 1px) * -1) var(--borderColor-default);

		&-sr-only {
			position: absolute;
			width: 1px;
			height: 1px;
			padding: 0;
			overflow: hidden;
			clip-path: rect(0 0 0 0);
			overflow-wrap: normal;
			border: 0;
		}
		&-globalBar {
			display: flex;
			padding: var(--base-size-16, var(--base-size-16));
			gap: var(--base-size-12, 12px);

			&-start {
				flex: 1 1 auto;
				display: flex;
				gap: var(--base-size-8, 8px);
			}

			&-end {
				flex: 0 1 auto;
				display: flex;
				justify-content: flex-end;
				gap: var(--controlStack-medium-gap-auto, 8px);
				max-height: calc(var(--base-size-32, 32px));
			}
		}

		.responsive-context-region {
			overflow: hidden;
		}
	}
</style>
