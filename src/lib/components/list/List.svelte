<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Chip } from '../chip/index.js';

	type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
	/** Small icon+text pair under the title. `icon` is a raw SVG string. */
	type ListSubtitleItem = { text: string; icon?: string };
	/** Trailing elements on the right edge of a rich row. */
	type ListTrailing =
		| { kind: 'badge'; text: string; tone?: Tone }
		| { kind: 'count'; value: string | number; icon?: string }
		| { kind: 'avatar'; name: string }
		| { kind: 'icon'; icon: string };
	/** Legacy label/value column (fields-grid row, used when `title` is absent). */
	type ListField = { label: string; value: string; badge?: boolean };
	/**
	 * One list row. All strings arrive pre-formatted (dates already humanised
	 * app-side). Rich row when `title` is set; legacy label/value grid row when
	 * only `fields` is set.
	 */
	type ListItem = {
		/** Primary text. Presence of `title` selects the rich-row layout. */
		title?: string;
		/** Meta items under the title, separated by a middle dot. */
		subtitle?: ListSubtitleItem[];
		/** Leading raw-SVG icon in a 36px circle (ignored if `avatarName` set). */
		leadingIcon?: string;
		/** Leading 36px initials avatar derived from this name ("?" if empty). */
		avatarName?: string;
		/** Trailing badge / count / avatar / icon elements. */
		trailing?: ListTrailing[];
		/** Legacy mode: label/value columns for this row (no `title`). */
		fields?: ListField[];
	};

	export let items: ListItem[] = [];
	/** Make rich rows interactive: pointer cursor, hover, `itemClick` events. */
	export let clickable = false;
	export { className as class };
	let className = '';

	const dispatch = createEventDispatcher<{ itemClick: { item: ListItem; index: number } }>();

	function rowClick(item: ListItem, index: number) {
		if (clickable) dispatch('itemClick', { item, index });
	}
	function rowKeydown(e: KeyboardEvent, item: ListItem, index: number) {
		if (clickable && (e.key === 'Enter' || e.key === ' ')) {
			e.preventDefault();
			dispatch('itemClick', { item, index });
		}
	}
	function initials(name: string): string {
		const parts = String(name || '')
			.trim()
			.split(/\s+/)
			.filter(Boolean);
		if (!parts.length) return '?';
		if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
		return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
	}
</script>

<div class="list {className}">
	{#each items as item, index}
		{#if item.title != null}
			<!-- svelte-ignore a11y-no-noninteractive-tabindex (role is 'button' whenever tabindex is set) -->
			<div
				class="rli"
				class:rli-link={clickable}
				role={clickable ? 'button' : undefined}
				tabindex={clickable ? 0 : undefined}
				on:click={() => rowClick(item, index)}
				on:keydown={(e) => rowKeydown(e, item, index)}
			>
				{#if item.avatarName !== undefined}
					<span class="rli-avatar">{initials(item.avatarName)}</span>
				{:else if item.leadingIcon}
					<span class="rli-lead">{@html item.leadingIcon}</span>
				{/if}
				<div class="rli-main">
					<div class="rli-title">{item.title}</div>
					{#if item.subtitle && item.subtitle.length}
						{@const metas = item.subtitle.filter((s) => s.text)}
						<div class="rli-sub">
							{#each metas as s, si}
								{#if si > 0}<span class="rli-sep">·</span>{/if}
								<span class="rli-meta">{#if s.icon}<span class="rli-ic">{@html s.icon}</span>{/if}{s.text}</span>
							{/each}
						</div>
					{/if}
				</div>
				{#if item.trailing && item.trailing.length}
					<div class="rli-trail" class:rli-ind={item.avatarName !== undefined || !!item.leadingIcon}>
						{#each item.trailing as t}
							{#if t.kind === 'badge'}
								{#if t.text}<span class="rli-badge rli-badge-{t.tone ?? 'neutral'}">{t.text}</span>{/if}
							{:else if t.kind === 'count'}
								<span class="rli-count">{#if t.icon}<span class="rli-ic">{@html t.icon}</span>{/if}{t.value}</span>
							{:else if t.kind === 'avatar'}
								<span class="rli-avatar rli-avatar-sm">{initials(t.name)}</span>
							{:else if t.kind === 'icon'}
								<span class="rli-ic rli-ticon">{@html t.icon}</span>
							{/if}
						{/each}
					</div>
				{/if}
			</div>
		{:else}
			<div class="list-item">
				{#each item.fields ?? [] as f}
					<div class="li-field">
						<span class="li-label">{f.label}</span>
						{#if f.badge && f.value}
							<span class="li-chip"><Chip>{f.value}</Chip></span>
						{:else}
							<span class="li-value">{f.value}</span>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	{/each}
</div>

<style>
	/* NOTE: flat single-class selectors only (no descendant/sibling selectors
	   targeting nodes inside the each-blocks); injected {@html} SVGs are sized
	   via `.wrapper :global(svg)` — a scoped parent + global target is safe. */
	.list {
		display: flex;
		flex-direction: column;
		font-family: var(--db-fontstack);
		/* Rows adapt to the LIST's own width, not the viewport (see below). */
		container-type: inline-size;
	}

	/* --- rich row: leading icon/avatar + title/subtitle + trailing --------- */
	.rli {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 0;
		min-height: 44px;
		border-bottom: 1px solid var(--db-color-border);
	}
	.rli:last-child {
		border-bottom: none;
	}
	.rli-link {
		cursor: pointer;
	}
	.rli-link:hover {
		background: var(--db-color-bg-hover, var(--db-color-bg-secondary));
	}
	.rli-lead {
		flex: 0 0 auto;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		border: 1px solid var(--db-color-border);
		background: var(--db-color-bg);
		color: var(--db-color-text-secondary);
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}
	.rli-lead :global(svg) {
		width: 18px;
		height: 18px;
	}
	.rli-avatar {
		flex: 0 0 auto;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: var(--db-color-bg-secondary);
		color: var(--db-color-text);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: var(--db-fontsize-small);
		font-weight: var(--db-fontweight-medium);
		text-transform: uppercase;
	}
	.rli-avatar-sm {
		width: 30px;
		height: 30px;
		font-size: var(--db-fontsize-medium);
	}
	.rli-main {
		flex: 1 1 auto;
		min-width: 0;
	}
	.rli-title {
		font-size: var(--db-fontsize-medium);
		font-weight: var(--db-fontweight-medium);
		color: var(--db-color-text);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.rli-sub {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0 6px;
		margin-top: 3px;
		font-size: var(--db-fontsize-small);
		color: var(--db-color-text-secondary);
	}
	.rli-meta {
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}
	.rli-ic {
		display: inline-flex;
	}
	.rli-ic :global(svg) {
		width: 13px;
		height: 13px;
	}
	.rli-sep {
		color: var(--db-color-text-tertiary, var(--db-color-text-secondary));
	}
	.rli-trail {
		flex: 0 0 auto;
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.rli-count {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-size: var(--db-fontsize-medium);
		color: var(--db-color-text-secondary);
	}
	.rli-count :global(svg) {
		width: 17px;
		height: 17px;
	}
	.rli-ticon {
		color: var(--db-color-text-secondary);
	}
	.rli-ticon :global(svg) {
		width: 16px;
		height: 16px;
	}

	/* --- trailing badge: Desk status pill (tinted bg + border + text) ------ */
	.rli-badge {
		display: inline-flex;
		align-items: center;
		width: fit-content;
		padding: 2px 10px;
		border: 1px solid var(--db-color-border);
		border-radius: var(--db-border-radius-small);
		font-size: var(--db-fontsize-medium);
		font-weight: var(--db-fontweight-medium);
		background-color: var(--db-color-bg-chip);
		color: var(--db-color-text);
	}
	.rli-badge-info {
		background-color: var(--db-color-bg-info-secondary, var(--db-color-bg-secondary));
		border-color: var(--db-color-border-info, var(--db-color-border));
		color: var(--db-color-text-info, var(--db-color-text));
	}
	.rli-badge-success {
		background-color: var(--db-color-bg-success-secondary, var(--db-color-bg-secondary));
		border-color: var(--db-color-border-success, var(--db-color-border));
		color: var(--db-color-text-success, var(--db-color-text));
	}
	.rli-badge-warning {
		background-color: var(--db-color-bg-warning-secondary, var(--db-color-bg-secondary));
		border-color: var(--db-color-border-warning, var(--db-color-border));
		color: var(--db-color-text-warning, var(--db-color-text));
	}
	.rli-badge-danger {
		background-color: var(--db-color-bg-danger-secondary, var(--db-color-bg-secondary));
		border-color: var(--db-color-border-danger, var(--db-color-border));
		color: var(--db-color-text-danger, var(--db-color-text));
	}

	/* Responsive rows: below ~480px of LIST width (narrow left tabs / side
	   panels) the trailing badge/count drops onto its own line under the
	   text and the title relaxes from single-line ellipsis to a 2-line
	   clamp, so long titles and long badges stop fighting for one row.
	   Container query, not @media — the list adapts to its own width even
	   inside a wide viewport. */
	@container (max-width: 479px) {
		.rli {
			flex-wrap: wrap;
			row-gap: 4px;
		}
		/* Basis 0, not auto: a long (wrapping) title's max-content width would
		   otherwise wrap the whole text column below the lead avatar/icon. */
		.rli-main {
			flex-basis: 0;
		}
		.rli-title {
			white-space: normal;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			line-clamp: 2;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}
		.rli-trail {
			flex: 1 1 100%;
			justify-content: flex-start;
		}
		/* Indent under the text column when the row has a lead (36px + 12px gap). */
		.rli-ind {
			padding-left: 48px;
		}
	}

	/* --- legacy label/value grid row (no title) ----------------------------- */
	.list-item {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--db-size-xxxsmall, 4px) var(--db-size-medium, 16px);
		min-height: 44px;
		padding: var(--db-size-small, 12px) 0;
		background: var(--db-color-bg);
		border-bottom: 1px solid var(--db-color-border);
	}
	.list-item:last-child {
		border-bottom: none;
	}
	.list-item:hover {
		background: var(--db-color-bg-secondary);
	}
	.li-field {
		display: flex;
		flex-direction: column;
		gap: var(--db-size-xxxsmall, 4px);
	}
	.li-label {
		font-size: var(--db-fontsize-small);
		color: var(--db-color-text-secondary);
	}
	/* Figma primary value is 16px medium; kept at 14px per the font standard. */
	.li-value {
		font-size: var(--db-fontsize-medium);
		font-weight: var(--db-fontweight-medium);
		color: var(--db-color-text);
		word-break: break-word;
	}
	.li-chip {
		align-self: flex-start;
		width: fit-content;
	}
</style>
