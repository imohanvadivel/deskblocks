<script lang="ts">
	/** Optional trend pill shown under the value. */
	type StatTrend = {
		/** 'up' | 'down' | 'flat' — picks the arrow and the pill tint. */
		direction: 'up' | 'down' | 'flat';
		/** Pre-formatted delta text, e.g. "+12%" or "3 fewer". */
		value: string;
	};

	/** Small caption above the value, e.g. "Open tickets". */
	export let label: string;
	/** Pre-formatted KPI value. Ignored when the `value` slot is used. */
	export let value: string | number | undefined = undefined;
	/** Muted helper line next to / after the trend, e.g. "vs last week". */
	export let sub: string | undefined = undefined;
	export let trend: StatTrend | undefined = undefined;
	export { className as class };
	let className = '';
</script>

<div class="{className} stat">
	<span class="stat-label">{label}</span>
	<span class="stat-value">
		{#if $$slots.value}<slot name="value" />{:else}{value}{/if}
	</span>
	{#if trend || sub}
		<div class="stat-meta">
			{#if trend}
				<span class="stat-trend trend-{trend.direction}">
					<span class="trend-arrow" aria-hidden="true"
						>{trend.direction === 'up' ? '▲' : trend.direction === 'down' ? '▼' : '→'}</span
					>
					{trend.value}
				</span>
			{/if}
			{#if sub}<span class="stat-sub">{sub}</span>{/if}
		</div>
	{/if}
</div>

<style>
	/* stat metric card */
	.stat {
		font-family: var(--db-fontstack);
		color: var(--db-color-text);
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 16px;
		border: 1px solid var(--db-color-border);
		border-radius: var(--db-border-radius-medium);
		/* Fill the parent row height so KPI cards side-by-side are equal-height
		   even when some have no sub-line (in an align-items:start grid). */
		align-self: stretch;
		height: 100%;
		box-sizing: border-box;
	}
	.stat-label {
		font-size: var(--db-fontsize-small);
		color: var(--db-color-text);
	}
	.stat-value {
		font-size: var(--db-fontsize-xlarge, 20px);
		font-weight: var(--db-fontweight-medium, 500);
		line-height: 1.2;
	}
	.stat-sub {
		font-size: var(--db-fontsize-small);
		color: var(--db-color-text-secondary);
	}
	.stat-meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
	}
	.stat-trend {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		font-size: var(--db-fontsize-small);
		padding: 1px 6px;
		border-radius: 1rem;
		background: var(--db-color-bg-chip);
		color: var(--db-color-text-secondary);
	}
	.stat-trend.trend-up {
		color: var(--db-color-text-success, var(--db-color-text));
		background: var(--db-color-bg-success-secondary, var(--db-color-bg-chip));
	}
	.stat-trend.trend-down {
		color: var(--db-color-text-danger, var(--db-color-text));
		background: var(--db-color-bg-danger-secondary, var(--db-color-bg-chip));
	}
	.trend-arrow {
		font-size: 9px;
	}
</style>
