<script lang="ts">
	import { IconArchive } from '../../icons/index.js';

	/** Raw SVG string for the large muted glyph. Defaults to the archive (inbox) icon. */
	export let icon: string = IconArchive;
	/** Bold headline, e.g. "No open tickets". */
	export let title: string;
	/** Muted supporting line under the title. */
	export let description: string | undefined = undefined;
	export { className as class };
	let className = '';
</script>

<div class="{className} empty-state">
	<span class="es-icon" aria-hidden="true">{@html icon}</span>
	<p class="es-title">{title}</p>
	{#if description}<p class="es-description">{description}</p>{/if}
	{#if $$slots.action}
		<span class="es-action"><slot name="action" /></span>
	{/if}
</div>

<style>
	.empty-state {
		font-family: var(--db-fontstack);
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 8px;
		padding: 32px 16px;
	}
	.es-icon {
		display: block;
		width: 64px;
		height: 64px;
		color: var(--db-color-icon-secondary, var(--db-color-text-tertiary, var(--db-color-text-secondary)));
		opacity: 0.65;
		margin-bottom: 4px;
	}
	.es-icon :global(svg) {
		width: 100%;
		height: 100%;
		display: block;
	}
	.es-title {
		margin: 0;
		font-size: var(--db-fontsize-large);
		font-weight: var(--db-fontweight-bold);
		color: var(--db-color-text);
	}
	.es-description {
		margin: 0;
		max-width: 34ch;
		font-size: var(--db-fontsize-medium);
		line-height: var(--db-lineHeight-large);
		color: var(--db-color-text-secondary);
	}
	.es-action {
		margin-top: 8px;
	}
</style>
