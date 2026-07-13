<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	/**
	 * One conversation message. Time strings arrive pre-formatted (absolute +
	 * relative formatting stays app-side).
	 */
	type ThreadMessage = {
		/** Display name of the sender (initials avatar is derived from it). */
		author: string;
		/** Pre-formatted absolute time, e.g. `04 Jul 3:12 PM`. */
		time?: string;
		/** Pre-formatted relative time, e.g. `2 hours ago` (shown in parens). */
		relativeTime?: string;
		/** Collapsed summary text (always shown when the row is closed). */
		preview: string;
		/** Full body. When it differs from `preview` the row is expandable. */
		body?: string;
		/** Avatar image URL; falls back to author initials. */
		avatar?: string;
		/** Outgoing message (agent reply): brand left border + tinted bg. */
		outgoing?: boolean;
	};

	export let messages: ThreadMessage[] = [];
	export { className as class };
	let className = '';

	const dispatch = createEventDispatcher<{ toggle: { index: number; open: boolean } }>();

	// Per-row expanded state, internal to the component.
	let open: Record<number, boolean> = {};
	function toggle(index: number) {
		open[index] = !open[index];
		open = open; // reassign for reactivity
		dispatch('toggle', { index, open: !!open[index] });
	}

	const fullBody = (m: ThreadMessage): string => m.body || m.preview;
	/** Expandable when there's more to show, or the summary is long. */
	const isExpandable = (m: ThreadMessage): boolean =>
		(!!fullBody(m) && fullBody(m) !== m.preview) || (m.preview ?? '').length > 120;

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

<div class="thread {className}">
	{#each messages as msg, mi}
		{@const expandable = isExpandable(msg)}
		{@const isOpen = !!open[mi]}
		<!-- svelte-ignore a11y-no-noninteractive-tabindex (role is 'button' whenever tabindex is set) -->
		<div
			class="msg"
			class:msg-out={msg.outgoing}
			class:msg-divided={mi > 0}
			class:msg-expandable={expandable}
			class:msg-open={isOpen}
			role={expandable ? 'button' : undefined}
			tabindex={expandable ? 0 : undefined}
			on:click={() => expandable && toggle(mi)}
			on:keydown={(e) => {
				if (expandable && (e.key === 'Enter' || e.key === ' ')) {
					e.preventDefault();
					toggle(mi);
				}
			}}
		>
			<div class="msg-avatar" aria-hidden="true">
				{#if msg.avatar}<img class="msg-avatar-img" src={msg.avatar} alt="" />{:else}{initials(msg.author)}{/if}
			</div>
			<div class="msg-main">
				<div class="msg-head">
					<span class="msg-author">{msg.author}</span>
					{#if msg.time}<span class="msg-sep">·</span><span class="msg-time">{msg.time}</span>{/if}
					{#if msg.relativeTime}<span class="msg-rel">({msg.relativeTime})</span>{/if}
				</div>
				<div class="msg-body" class:clamp={!isOpen}>{isOpen ? fullBody(msg) : msg.preview}</div>
				{#if expandable}<span class="msg-toggle">{isOpen ? 'Show less' : 'Show more'}</span>{/if}
			</div>
		</div>
	{/each}
</div>

<style>
	/* Rows sit flush (no inter-row gap); a top border divides them.
	   HARD RULE: flat single-class selectors only. A descendant `.msg-avatar img`
	   or sibling `.msg + .msg` here drives Svelte's scoped-selector matcher into
	   catastrophic backtracking (minutes-long builds) — never reintroduce them. */
	.thread {
		display: flex;
		flex-direction: column;
		font-family: var(--db-fontstack);
	}
	.msg {
		display: flex;
		gap: 12px;
		padding: 12px;
	}
	.msg-divided {
		border-top: 1px solid var(--db-color-border);
	}
	.msg-expandable {
		cursor: pointer;
	}
	.msg-expandable:hover {
		background: var(--db-color-bg-hover, var(--db-color-bg-secondary));
	}
	.msg-out {
		border-left: 2px solid var(--db-color-bg-brand, var(--db-color-text-brand));
		background: var(--db-color-bg-secondary);
	}
	.msg-avatar {
		flex: 0 0 auto;
		width: 30px;
		height: 30px;
		border-radius: 50%;
		border: 1px solid var(--db-color-border);
		background: var(--db-color-bg-secondary);
		color: var(--db-color-text-secondary);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--db-fontsize-small);
		font-weight: var(--db-fontweight-medium);
		overflow: hidden;
	}
	.msg-avatar-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.msg-main {
		min-width: 0;
		flex: 1 1 auto;
	}
	.msg-head {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 6px;
		margin-bottom: 4px;
	}
	.msg-author {
		font-size: var(--db-fontsize-medium);
		font-weight: var(--db-fontweight-bold);
		color: var(--db-color-text);
	}
	.msg-sep {
		color: var(--db-color-text-tertiary, var(--db-color-text-secondary));
	}
	.msg-time,
	.msg-rel {
		font-size: var(--db-fontsize-small);
		color: var(--db-color-text-secondary);
	}
	.msg-body {
		font-size: var(--db-fontsize-medium);
		line-height: var(--db-lineHeight-large);
		color: var(--db-color-text);
		white-space: pre-wrap;
		word-break: break-word;
	}
	.msg-body.clamp {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.msg-toggle {
		display: inline-block;
		margin-top: 4px;
		font-size: var(--db-fontsize-small);
		color: var(--db-color-text-brand);
	}
</style>
