<script lang="ts">
	import { IconStar, IconStarFilled, IconLike, IconArrowFillUp } from '../../icons/index.js';

	/** The rating value. Stars: rounded to the nearest star. Thumbs/votes: shown as a count. */
	export let value = 0;
	/** Number of stars (stars variant only). Clamped to 1–20. */
	export let max = 5;
	/**
	 * "stars" → a row of filled/empty stars.
	 * "thumbs" → a thumbs-up glyph + count.
	 * "votes" → an upvote arrow + count.
	 */
	export let variant: 'stars' | 'thumbs' | 'votes' = 'stars';
	export let label: string | undefined = undefined;
	export { className as class };
	let className = '';

	$: maxStars = Math.max(1, Math.min(20, Math.floor(max ?? 5)));
	$: count = isNaN(Number(value)) ? 0 : Number(value);
	$: filled = Math.round(count);
</script>

<div class="{className} rating">
	{#if label}<span class="rating-label">{label}</span>{/if}
	{#if variant === 'stars'}
		<span class="rating-stars" role="img" aria-label="{filled} out of {maxStars}">
			{#each Array(maxStars) as _, idx}
				<span class="rt-star {idx < filled ? 'rt-on' : 'rt-off'}">{@html idx < filled ? IconStarFilled : IconStar}</span>
			{/each}
		</span>
	{:else if variant === 'thumbs'}
		<span class="rating-glyph rt-like" role="img" aria-label="{count} likes">
			{@html IconLike}<span class="rating-count">{count}</span>
		</span>
	{:else}
		<span class="rating-glyph rt-vote" role="img" aria-label="{count} votes">
			{@html IconArrowFillUp}<span class="rating-count">{count}</span>
		</span>
	{/if}
</div>

<style>
	.rating {
		display: flex;
		flex-direction: column;
		gap: 6px;
		font-family: var(--db-fontstack);
	}
	.rating-label {
		font-size: var(--db-fontsize-small);
		color: var(--db-color-text-secondary);
	}
	.rating-stars {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		color: var(--db-color-icon-warning, #e9a100);
	}
	.rt-star {
		display: inline-flex;
	}
	.rt-off {
		color: var(--db-color-text-tertiary, var(--db-color-border-strong));
	}
	.rating-stars :global(svg) {
		width: 16px;
		height: 16px;
		display: block;
	}
	.rating-glyph :global(svg) {
		width: 16px;
		height: 16px;
		display: block;
	}
	.rating-glyph {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: var(--db-fontsize-medium);
		color: var(--db-color-text);
	}
	.rating-glyph.rt-like {
		color: var(--db-color-icon-success, var(--db-color-text));
	}
	.rating-glyph.rt-vote {
		color: var(--db-color-text-brand, var(--db-color-text));
	}
	.rating-count {
		color: var(--db-color-text);
		font-weight: var(--db-fontweight-medium);
	}
</style>
