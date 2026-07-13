<script lang="ts">
	import { Chip } from '../chip/index.js';

	type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

	/** Tag labels. An empty list renders a single "—" placeholder. */
	export let tags: string[] = [];
	/** Optional semantic tone applied to every tag pill (tinted bg + colored border/text). */
	export let tone: Tone | undefined = undefined;
	export { className as class };
	let className = '';
</script>

<div class="{className} tags">
	{#if tags.length}
		{#each tags as t}
			<Chip class={'db-tag' + (tone && tone !== 'neutral' ? ' db-tag-' + tone : '')}>{t}</Chip>
		{/each}
	{:else}
		<span class="tags-empty">—</span>
	{/if}
</div>

<style>
	.tags {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
		font-family: var(--db-fontstack);
	}
	.tags-empty {
		font-size: var(--db-fontsize-medium);
		color: var(--db-color-text);
		word-break: break-word;
	}
	/* Desk status pill: tinted bg + colored border + text, squared radius —
	   overrides the Chip's default rounded look. */
	.tags :global(.chip.db-tag) {
		width: fit-content;
		height: auto;
		padding: 2px 10px;
		border: 1px solid var(--db-color-border);
		border-radius: var(--db-border-radius-small);
		font-size: var(--db-fontsize-medium);
		font-weight: var(--db-fontweight-medium);
		background-color: var(--db-color-bg-chip);
		color: var(--db-color-text);
	}
	.tags :global(.chip.db-tag-info) {
		background-color: var(--db-color-bg-info-secondary, var(--db-color-bg-secondary));
		border-color: var(--db-color-border-info, var(--db-color-border));
		color: var(--db-color-text-info, var(--db-color-text));
	}
	.tags :global(.chip.db-tag-success) {
		background-color: var(--db-color-bg-success-secondary, var(--db-color-bg-secondary));
		border-color: var(--db-color-border-success, var(--db-color-border));
		color: var(--db-color-text-success, var(--db-color-text));
	}
	.tags :global(.chip.db-tag-warning) {
		background-color: var(--db-color-bg-warning-secondary, var(--db-color-bg-secondary));
		border-color: var(--db-color-border-warning, var(--db-color-border));
		color: var(--db-color-text-warning, var(--db-color-text));
	}
	.tags :global(.chip.db-tag-danger) {
		background-color: var(--db-color-bg-danger-secondary, var(--db-color-bg-secondary));
		border-color: var(--db-color-border-danger, var(--db-color-border));
		color: var(--db-color-text-danger, var(--db-color-text));
	}
</style>
