<script lang="ts">
	/**
	 * One grid entry. `value` is a pre-formatted display string (dates, currency,
	 * entity names etc. are formatted by the caller). Empty values (`undefined`,
	 * `null`, `''` or an explicit `'—'`) render as a muted em dash.
	 * Values are always rendered as plain text — never as badges/chips — so the
	 * grid stays a quiet, read-only summary.
	 */
	type PropertyItem = { label: string; value?: string | number | null };

	export let items: PropertyItem[] = [];
	/** 1 = single column (default); 2 = up to two ≤260px columns, collapsing to one when narrow. */
	export let columns: 1 | 2 = 1;
	export { className as class };
	let className = '';

	function text(v: string | number | null | undefined): string {
		return v == null || v === '' ? '—' : String(v);
	}
</script>

<div class="{className} pgrid" class:cols2={columns === 2}>
	{#each items as item}
		<div class="pg-row">
			<span class="pg-label">{item.label}</span>
			<span class="pg-value" class:empty={text(item.value) === '—'}>{text(item.value)}</span>
		</div>
	{/each}
</div>

<style>
	.pgrid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 16px 24px;
		font-family: var(--db-fontstack);
	}
	/* Two ≤260px columns max; below ~464px the row collapses to a single column. */
	.pgrid.cols2 {
		max-width: 544px;
		grid-template-columns: repeat(auto-fill, minmax(min(220px, 100%), 1fr));
	}
	.pg-row {
		display: flex;
		flex-direction: column;
		gap: 5px;
		min-height: 40px;
		justify-content: center;
	}
	.pg-label {
		font-size: var(--db-fontsize-small);
		color: var(--db-color-text-secondary);
	}
	.pg-value {
		font-size: var(--db-fontsize-medium);
		color: var(--db-color-text);
		word-break: break-word;
	}
	/* Empty "—" values read as muted, so they don't compete with real data. */
	.pg-value.empty {
		color: var(--db-color-text-tertiary);
	}
</style>
