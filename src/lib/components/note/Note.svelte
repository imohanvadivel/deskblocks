<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { IconInfo, IconCheckmark, IconWarning, IconAlert } from '../../icons/index.js';

	/** Semantic tone of the callout — drives the tint, border and default glyph. */
	export let tone: 'info' | 'success' | 'warning' | 'danger' = 'info';
	/** Optional bold title line above the note body. */
	export let title: string | undefined = undefined;
	/** Renders a close button; clicking it hides the note and fires `dismiss`. */
	export let dismissible = false;
	/** Raw SVG string overriding the tone's default status glyph. */
	export let icon: string | undefined = undefined;
	export { className as class };
	let className = '';

	const dispatch = createEventDispatcher();
	let hidden = false;

	const TONE_ICONS: Record<string, string> = {
		info: IconInfo,
		success: IconCheckmark,
		warning: IconWarning,
		danger: IconAlert
	};
	$: glyph = icon ?? TONE_ICONS[tone] ?? IconInfo;

	function handleDismiss() {
		hidden = true;
		dispatch('dismiss');
	}
</script>

{#if !hidden}
	<div class="{className} note tone-{tone}" role="status">
		<span class="note-icon icon-{tone}" aria-hidden="true">{@html glyph}</span>
		<div class="note-body">
			{#if title}<div class="note-title">{title}</div>{/if}
			<div class="note-text"><slot /></div>
		</div>
		{#if dismissible}
			<button class="note-dismiss" aria-label="Dismiss" on:click={handleDismiss}>&times;</button>
		{/if}
	</div>
{/if}

<style>
	.note {
		font-family: var(--db-fontstack);
		font-size: var(--db-fontsize-medium);
		line-height: 20px;
		padding: 10px 14px;
		border-radius: var(--db-border-radius-small);
		border: 1px solid var(--db-color-border);
		color: var(--db-color-text);
		display: flex;
		gap: 6px;
		align-items: flex-start;
	}
	/* Subtle tinted callouts — light secondary bg + colored border + dark text
	   (NOT the saturated bg-* fills, which are for buttons/badges). */
	.note.tone-info {
		background: var(--db-color-bg-info-secondary, var(--db-color-bg-secondary));
		border-color: var(--db-color-border-info, var(--db-color-border));
	}
	.note.tone-success {
		background: var(--db-color-bg-success-secondary, var(--db-color-bg-secondary));
		border-color: var(--db-color-border-success, var(--db-color-border));
	}
	.note.tone-warning {
		background: var(--db-color-bg-warning-secondary, var(--db-color-bg-secondary));
		border-color: var(--db-color-border-warning, var(--db-color-border));
	}
	.note.tone-danger {
		background: var(--db-color-bg-danger-secondary, var(--db-color-bg-secondary));
		border-color: var(--db-color-border-danger, var(--db-color-border));
	}

	.note-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: none;
		width: 16px;
		/* Match the text line-height so the 16px glyph centres on the first line
		   (with the parent's flex-start, it stays aligned on multi-line notes). */
		height: 20px;
		line-height: 0;
	}
	.note-icon :global(svg) {
		width: 16px;
		height: 16px;
		display: block;
	}
	/* Tint the status icon to the tone (falls back to the tone border). */
	.note-icon.icon-info {
		color: var(--db-color-icon-info, var(--db-color-border-info, var(--db-color-text)));
	}
	.note-icon.icon-success {
		color: var(--db-color-icon-success, var(--db-color-border-success, var(--db-color-text)));
	}
	.note-icon.icon-warning {
		color: var(--db-color-icon-warning, var(--db-color-border-warning, var(--db-color-text)));
	}
	.note-icon.icon-danger {
		color: var(--db-color-icon-danger, var(--db-color-border-danger, var(--db-color-text)));
	}

	.note-body {
		flex: 1 1 auto;
		min-width: 0;
	}
	.note-title {
		font-weight: var(--db-fontweight-bold);
		margin-bottom: 2px;
	}
	.note-text {
		word-break: break-word;
	}
	.note-dismiss {
		flex: none;
		font: inherit;
		font-family: var(--db-fontstack);
		font-size: var(--db-fontsize-large);
		line-height: 1;
		color: var(--db-color-text-secondary);
		background: none;
		border: none;
		cursor: pointer;
		padding: 0 0 0 6px;
	}
</style>
