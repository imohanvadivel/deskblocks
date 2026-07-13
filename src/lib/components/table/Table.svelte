<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Chip } from '../chip/index.js';

	type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

	/**
	 * Column definition.
	 * - `key`: property looked up on each row object.
	 * - `badge`: render the cell as a Chip; the cell value may be a plain string
	 *   (neutral tone) or a `{ text, tone }` object for per-cell tone.
	 * - `sortable`: per-column override of the table-level `sortable` prop.
	 */
	type TableColumn = {
		key: string;
		label: string;
		align?: 'left' | 'center' | 'right';
		width?: string;
		badge?: boolean;
		sortable?: boolean;
	};

	/**
	 * A row is a plain object keyed by column `key`. Cell values are strings or
	 * numbers (pre-formatted by the caller — dates, currency etc. stay app-side);
	 * badge columns additionally accept `{ text: string, tone?: Tone }`.
	 */
	type TableRow = Record<string, string | number | null | undefined | { text: string; tone?: Tone }>;

	export let columns: TableColumn[] = [];
	export let rows: TableRow[] = [];
	/** Enables click-to-sort on all column headers (per-column `sortable` overrides). */
	export let sortable = false;
	/** Rows show a pointer cursor + hover background; pair with `on:rowClick`. */
	export let clickableRows = false;
	export { className as class };
	let className = '';

	const dispatch = createEventDispatcher<{ rowClick: { row: TableRow; index: number } }>();

	let sort: { key: string; dir: 1 | -1 } | null = null;

	function canSort(c: TableColumn): boolean {
		return c.sortable ?? sortable;
	}
	function toggleSort(c: TableColumn) {
		if (!canSort(c)) return;
		sort =
			sort && sort.key === c.key
				? { key: c.key, dir: sort.dir === 1 ? -1 : 1 }
				: { key: c.key, dir: 1 };
	}
	function cellRaw(row: TableRow, key: string): string | number | null | undefined {
		const v = row?.[key];
		return v && typeof v === 'object' ? v.text : v;
	}
	function cellText(row: TableRow, c: TableColumn): string {
		const v = cellRaw(row, c.key);
		return v == null || v === '' ? '—' : String(v);
	}
	function cellTone(row: TableRow, c: TableColumn): Tone {
		const v = row?.[c.key];
		return (v && typeof v === 'object' && v.tone) || 'neutral';
	}
	function sortRows(list: TableRow[], st: { key: string; dir: 1 | -1 } | null): TableRow[] {
		if (!st) return list;
		const arr = [...list];
		arr.sort((a, b) => {
			const av = cellRaw(a, st.key);
			const bv = cellRaw(b, st.key);
			const an = Number(av);
			const bn = Number(bv);
			const numeric = isFinite(an) && isFinite(bn) && av !== '' && bv !== '' && av != null && bv != null;
			const cmp = numeric ? an - bn : String(av ?? '').localeCompare(String(bv ?? ''));
			return cmp * st.dir;
		});
		return arr;
	}
	function thStyle(c: TableColumn): string {
		return (c.align ? `text-align:${c.align};` : '') + (c.width ? `width:${c.width};` : '');
	}

	$: sorted = sortRows(rows, sort);
</script>

<div class="{className} table-wrap">
	<table class="tbl">
		<thead>
			<tr>
				{#each columns as c}
					<th
						class="th"
						class:sortable={canSort(c)}
						style={thStyle(c)}
						tabindex={canSort(c) ? 0 : undefined}
						aria-sort={canSort(c) && sort?.key === c.key
							? sort.dir === 1
								? 'ascending'
								: 'descending'
							: undefined}
						on:click={() => toggleSort(c)}
						on:keydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								toggleSort(c);
							}
						}}
					>
						{c.label}{#if canSort(c) && sort?.key === c.key}<span class="sort-ind">{sort.dir === 1 ? '▲' : '▼'}</span>{/if}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each sorted as row, ri}
				<tr
					class="row"
					class:rowlink={clickableRows}
					on:click={() => dispatch('rowClick', { row, index: ri })}
				>
					{#each columns as c}
						<td class="td" style={c.align ? `text-align:${c.align};` : ''}>
							{#if c.badge && cellText(row, c) !== '—'}
								<Chip tone={cellTone(row, c)}>{cellText(row, c)}</Chip>
							{:else}
								{cellText(row, c)}
							{/if}
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.table-wrap {
		overflow-x: auto;
		font-family: var(--db-fontstack);
	}
	.tbl {
		width: 100%;
		border-collapse: collapse;
		font-size: var(--db-fontsize-medium);
	}
	.th {
		text-align: left;
		font-weight: var(--db-fontweight-medium);
		font-size: var(--db-fontsize-small);
		color: var(--db-color-text-secondary);
		padding: 8px 10px;
		border-bottom: 1px solid var(--db-color-border);
		white-space: nowrap;
	}
	.th.sortable {
		cursor: pointer;
		user-select: none;
	}
	.th.sortable:hover {
		color: var(--db-color-text);
	}
	.sort-ind {
		margin-left: 4px;
		font-size: 9px;
	}
	.td {
		padding: 8px 10px;
		border-bottom: 1px solid var(--db-color-border);
		color: var(--db-color-text);
		/* Align every cell's first line on a shared text baseline. */
		vertical-align: baseline;
	}
	.row.rowlink {
		cursor: pointer;
	}
	.row.rowlink:hover {
		background: var(--db-color-bg-secondary);
	}
	/* Badge chips size to their content, not the cell/column. */
	.td :global(.chip) {
		width: fit-content;
	}
</style>
