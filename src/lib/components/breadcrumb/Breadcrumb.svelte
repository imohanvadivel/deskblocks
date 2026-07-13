<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	/** One crumb. The last item is rendered as the current page (not clickable). */
	type BreadcrumbItem = { label: string; id?: string };

	export let items: BreadcrumbItem[] = [];
	export { className as class };
	let className = '';

	const dispatch = createEventDispatcher<{
		navigate: { index: number; id: string | undefined; item: BreadcrumbItem };
	}>();
</script>

<nav class="{className} breadcrumb" aria-label="Breadcrumb">
	{#each items as item, i}
		{#if i > 0}<span class="bc-sep" aria-hidden="true">›</span>{/if}
		{#if i < items.length - 1}
			<button
				class="bc-link"
				on:click={() => dispatch('navigate', { index: i, id: item.id, item })}
			>
				{item.label}
			</button>
		{:else}
			<span class="bc-current" aria-current="page">{item.label}</span>
		{/if}
	{/each}
</nav>

<style>
	.breadcrumb {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px;
		font-family: var(--db-fontstack);
		font-size: var(--db-fontsize-medium);
		line-height: var(--db-lineHeight-large);
	}
	.bc-link {
		font: inherit;
		font-size: var(--db-fontsize-medium);
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		color: var(--db-color-text-brand);
	}
	.bc-link:hover {
		text-decoration: underline;
	}
	.bc-current {
		color: var(--db-color-text);
		font-weight: var(--db-fontweight-medium);
	}
	.bc-sep {
		color: var(--db-color-text-tertiary, var(--db-color-text-secondary));
	}
</style>
