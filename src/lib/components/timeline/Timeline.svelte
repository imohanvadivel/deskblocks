<script lang="ts">
	/**
	 * A single timeline entry. All strings arrive pre-formatted — the component
	 * does no date parsing or formatting (day/time formatting stays app-side).
	 */
	type TimelineDetail = {
		/** Muted lead-in label, e.g. "Status". Optional. */
		label?: string;
		/** Detail text, e.g. `changed from Open to Closed`. */
		value: string;
	};
	type TimelineItem = {
		/** Day-group header text, e.g. `Today (13 Jul)` or `04 Jul 2025`.
		 *  Consecutive items with the same `day` share one header. */
		day?: string;
		/** Pre-formatted time label, e.g. `3:12 PM` or `20 minutes ago`. */
		time?: string;
		/** Event title, e.g. `Ticket Updated`. */
		title: string;
		/** Optional glyph beside the title: a raw SVG string (rendered inline)
		 *  or a short text/emoji marker. */
		icon?: string;
		/** Who performed the event; renders an initial avatar + name. */
		actor?: string;
		/** Label/value lines under the title. */
		details?: TimelineDetail[];
	};

	export let items: TimelineItem[] = [];
	export { className as class };
	let className = '';

	type TimelineGroup = { day: string; events: TimelineItem[] };
	/** Group consecutive items sharing the same `day` (mirrors the source
	 *  renderer: rows are assumed pre-sorted; only adjacency is grouped). */
	function groupByDay(list: TimelineItem[]): TimelineGroup[] {
		const groups: TimelineGroup[] = [];
		let cur: TimelineGroup | null = null;
		for (const it of list) {
			const day = it.day ?? '';
			if (!cur || cur.day !== day) {
				cur = { day, events: [] };
				groups.push(cur);
			}
			cur.events.push(it);
		}
		return groups;
	}
	$: groups = groupByDay(items);

	const initial = (name: string): string => (name ? name.trim().charAt(0).toUpperCase() : '?');
	const isSvg = (s?: string): boolean => typeof s === 'string' && s.trim().startsWith('<svg');
</script>

<div class="timeline {className}">
	{#each groups as g, gi}
		<div class="tl-group">
			<div class="tl-day" class:tl-day-first={gi === 0}>
				<span class="tl-cal" aria-hidden="true">
					<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M25.64 4.688h-2.848V3.2a.8.8 0 0 0-1.6 0v1.488H10.848V3.2a.8.8 0 1 0-1.6 0v1.488H6.4A4.005 4.005 0 0 0 2.44 8.688V25.64a4 4 0 0 0 4 4h19.2a4 4 0 0 0 4-4V8.648a4.006 4.006 0 0 0-4-3.96ZM6.4 6.288h2.88v1.488a.8.8 0 0 0 1.6 0V6.288h10.312v1.488a.8.8 0 1 0 1.6 0V6.288h2.848a2.4 2.4 0 0 1 2.4 2.4v2.704H4V8.648a2.36 2.36 0 0 1 2.4-2.36Zm19.24 21.712H6.4a2.36 2.36 0 0 1-2.36-2.4V12.952H28v12.688A2.37 2.37 0 0 1 25.64 28Z" fill="currentColor"/><path d="M9.616 19.016a1.248 1.248 0 1 0 0-2.496 1.248 1.248 0 0 0 0 2.496ZM16 16.52a1.248 1.248 0 1 0 .001 2.497A1.248 1.248 0 0 0 16 16.52ZM22.416 19.016a1.248 1.248 0 1 0 0-2.496 1.248 1.248 0 0 0 0 2.496ZM13.032 21.512a1.256 1.256 0 1 0 .001 2.512 1.256 1.256 0 0 0-.001-2.512ZM19.432 24.016a1.248 1.248 0 1 0 0-2.496 1.248 1.248 0 0 0 0 2.496Z" fill="currentColor"/></svg>
				</span>
				<span class="tl-day-label">{g.day}</span>
			</div>
			{#each g.events as ev}
				<div class="tl-event">
					<span class="tl-dot"></span>
					{#if ev.time}<div class="tl-time">{ev.time}</div>{/if}
					<div class="tl-title">
						{#if ev.icon}
							<span class="tl-icon">{#if isSvg(ev.icon)}{@html ev.icon}{:else}{ev.icon}{/if}</span>
						{/if}
						<span>{ev.title}</span>
					</div>
					{#if ev.actor}
						<div class="tl-actor"><span class="tl-avatar" aria-hidden="true">{initial(ev.actor)}</span>{ev.actor}</div>
					{/if}
					{#each ev.details ?? [] as d}
						<div class="tl-detail">
							{#if d.label}<span class="tl-detail-label">{d.label}</span>{/if}
							<span class="tl-detail-value">{d.value}</span>
						</div>
					{/each}
				</div>
			{/each}
		</div>
	{/each}
</div>

<style>
	/* Date-grouped timeline with a single continuous left rail. The calendar
	   icons and event dots sit on the rail (x=8) and mask it with a bg fill.
	   NOTE: flat single-class selectors only (no descendant/sibling selectors
	   targeting nodes inside the each-blocks); injected SVGs are sized via
	   `.wrapper :global(svg)`. */
	.timeline {
		position: relative;
		font-family: var(--db-fontstack);
	}
	.timeline::before {
		content: '';
		position: absolute;
		left: 8px;
		top: 6px;
		bottom: 12px;
		width: 1px;
		background: var(--db-color-border);
	}
	.tl-group {
		position: relative;
	}
	.tl-day {
		position: relative;
		display: flex;
		align-items: center;
		min-height: 20px;
		padding-left: 28px;
		margin: 20px 0 12px;
		font-size: var(--db-fontsize-medium);
		font-weight: var(--db-fontweight-bold);
		color: var(--db-color-text);
	}
	/* First group's day header hugs the top (app: .tl-group:first-child .tl-day,
	   flattened to a conditional class to keep selectors single-class). */
	.tl-day-first {
		margin-top: 4px;
	}
	.tl-cal {
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		display: flex;
		align-items: center;
		justify-content: center;
		width: 16px;
		height: 16px;
		background: var(--db-color-bg);
		color: var(--db-color-icon-secondary, var(--db-color-text-tertiary));
	}
	.tl-cal :global(svg) {
		width: 16px;
		height: 16px;
		display: block;
	}
	.tl-event {
		position: relative;
		padding: 0 0 18px 28px;
	}
	.tl-dot {
		position: absolute;
		left: 6px;
		top: 30px;
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: var(--db-color-text-tertiary, var(--db-color-border-strong));
		box-shadow: 0 0 0 3px var(--db-color-bg);
	}
	.tl-time {
		font-size: var(--db-fontsize-small);
		color: var(--db-color-text-secondary);
		margin-bottom: 6px;
	}
	.tl-title {
		display: flex;
		align-items: center;
		gap: 6px;
		font-weight: var(--db-fontweight-regular, 400);
		color: var(--db-color-text);
		font-size: var(--db-fontsize-medium);
		margin-bottom: 4px;
	}
	.tl-icon {
		display: inline-flex;
		align-items: center;
		line-height: 0;
		font-size: var(--db-fontsize-medium);
	}
	.tl-icon :global(svg) {
		width: 16px;
		height: 16px;
		display: block;
	}
	.tl-actor {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: var(--db-fontsize-small);
		color: var(--db-color-text-secondary);
		margin-bottom: 4px;
	}
	.tl-avatar {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: var(--db-color-bg-chip);
		color: var(--db-color-text);
		font-size: 10px;
		font-weight: var(--db-fontweight-medium);
	}
	.tl-detail {
		font-size: var(--db-fontsize-medium);
		line-height: var(--db-lineHeight-large);
	}
	.tl-detail-label {
		color: var(--db-color-text-secondary);
		margin-right: 6px;
	}
	.tl-detail-value {
		color: var(--db-color-text);
	}
</style>
