<script lang="ts">
	export let disabled = false;
	export let inline = true;
	export let href: string | undefined = undefined;
	export let target: '_blank' | '_self' = '_blank';
	export let rel: HTMLLinkElement['rel'] | undefined = undefined;
	export let tabindex: number | undefined = 0;
	export { className as class };
	let className = '';
</script>

{#if disabled}
	<span class="{className} link" class:inline>
		<slot />
	</span>
{:else}
	<a
		{href}
		{target}
		{tabindex}
		class="{className} link"
		class:inline
		{rel}
		on:click
		on:mouseover
		on:mouseenter
		on:mouseleave
		on:focus
	>
		<slot />
	</a>
{/if}

<style>
	a {
		font-family: var(--db-fontstack);
		font-weight: var(--font-weight-regular);
		font-size: var(--db-fontsize-medium);
		--icon-color: var(--db-color-icon-brand);
		cursor: pointer;
		user-select: none;
		color: var(--db-color-text-brand);
		display: inline-flex;
		align-items: baseline;
		outline-offset: 0.125rem;
	}
	a:hover {
		cursor: pointer;
		--icon-color: var(--db-color-icon-brand-hover);
		color: var(--db-color-text-brand-hover);
	}
	a:focus {
		outline: var(--focus-ring-width) solid var(--db-color-border-focus);
	}
	span {
		font-family: var(--db-fontstack);
		font-weight: var(--font-weight-regular);
		font-size: var(--db-fontsize-medium);
		--icon-color: var(--db-color-icon-brand-disabled);
		cursor: not-allowed;
		color: var(--db-color-text-brand-disabled);
		display: inline-flex;
	}

	:global(.link .icon svg path) {
		fill: var(--db-color-icon-brand);
	}

	a :not(.inline), span :not(.inline) {
		display: flex;
	}
</style>
