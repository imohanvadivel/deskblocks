<script lang="ts">
	/** Current numeric value. Non-finite values render as "—" with an empty track. */
	export let value: number;
	/** Scale maximum; values ≤ 0 fall back to 100. */
	export let max = 100;
	/** Optional label shown left of the value line. */
	export let label: string | undefined = undefined;
	/** Unit suffix appended to the value text (e.g. "%", "h") and echoed mid-scale. */
	export let unit: string | undefined = undefined;
	/** Fill color. The app sets this explicitly (no automatic thresholds). */
	export let tone: 'brand' | 'success' | 'warning' | 'danger' = 'brand';
	/** Show the "0 … max" scale line under the track. */
	export let showScale = false;
	export { className as class };
	let className = '';

	$: safeMax = max && max > 0 ? max : 100;
	$: pct = Math.max(0, Math.min(100, (Number(value) / safeMax) * 100));
	$: valueText = isFinite(Number(value))
		? `${Math.round(Number(value) * 100) / 100}${unit ?? ''}`
		: '—';
</script>

<div
	class="{className} meter"
	role="meter"
	aria-label={label}
	aria-valuemin={0}
	aria-valuemax={safeMax}
	aria-valuenow={isFinite(Number(value)) ? Number(value) : undefined}
	aria-valuetext={valueText}
>
	<div class="meter-top">
		{#if label}<span class="meter-label">{label}</span>{/if}
		<span class="meter-value">{valueText}</span>
	</div>
	<div class="meter-track">
		<div class="meter-fill fill-{tone}" style="width:{pct}%"></div>
	</div>
	{#if showScale}
		<div class="meter-scale">
			<span>0</span>
			{#if unit}<span class="meter-unit">{unit}</span>{/if}
			<span>{safeMax}</span>
		</div>
	{/if}
</div>

<style>
	.meter {
		font-family: var(--db-fontstack);
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.meter-top {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 12px;
	}
	.meter-label {
		font-size: var(--db-fontsize-medium);
		color: var(--db-color-text);
	}
	.meter-value {
		font-size: var(--db-fontsize-medium);
		font-weight: var(--db-fontweight-bold);
		color: var(--db-color-text);
	}
	.meter-track {
		height: 6px;
		border-radius: 5px;
		background: var(--db-color-bg-secondary);
		overflow: hidden;
	}
	.meter-fill {
		height: 100%;
		border-radius: 5px;
		background: var(--db-color-bg-brand);
		transition: width 0.3s ease;
	}
	.meter-fill.fill-success {
		background: var(--db-color-bg-success);
	}
	.meter-fill.fill-warning {
		background: var(--db-color-bg-warning);
	}
	.meter-fill.fill-danger {
		background: var(--db-color-bg-danger);
	}
	.meter-scale {
		display: flex;
		justify-content: space-between;
		font-size: var(--db-fontsize-small);
		color: var(--db-color-text-secondary);
	}
	.meter-unit {
		color: var(--db-color-text-secondary);
	}
</style>
