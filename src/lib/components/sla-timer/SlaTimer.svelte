<script lang="ts">
	import { onMount } from 'svelte';

	/** Deadline as an ISO date string or epoch milliseconds. Empty/invalid renders "—". */
	export let deadline: string | number | null | undefined = undefined;
	/**
	 * "text" → humanised duration ("2d 4h left" / "Overdue by 35m").
	 * "clock" → live HH:MM:SS countdown (prefixed "-" once overdue), ticking every second.
	 */
	export let display: 'text' | 'clock' = 'text';
	export let label = 'Due in';
	export { className as class };
	let className = '';

	let nowMs = Date.now();
	onMount(() => {
		const t = setInterval(() => (nowMs = Date.now()), 1000);
		return () => clearInterval(t);
	});

	function humanizeMs(ms: number): string {
		const mins = Math.floor(ms / 60000);
		if (mins < 1) return 'under a minute';
		const d = Math.floor(mins / 1440),
			h = Math.floor((mins % 1440) / 60),
			m = mins % 60;
		if (d >= 1) return h ? `${d}d ${h}h` : `${d}d`;
		if (h >= 1) return m ? `${h}h ${m}m` : `${h}h`;
		return `${m}m`;
	}
	function clockMs(ms: number): string {
		const total = Math.floor(ms / 1000);
		const d = Math.floor(total / 86400);
		const h = Math.floor((total % 86400) / 3600);
		const m = Math.floor((total % 3600) / 60);
		const s = total % 60;
		const pad = (x: number) => String(x).padStart(2, '0');
		return (d > 0 ? `${d}d ` : '') + `${pad(h)}:${pad(m)}:${pad(s)}`;
	}
	function slaInfo(
		raw: string | number | null | undefined,
		disp: 'text' | 'clock',
		now: number
	): { text: string; overdue: boolean } {
		if (raw == null || raw === '' || raw === 0 || raw === '0') return { text: '—', overdue: false };
		const t = typeof raw === 'number' ? raw : Date.parse(raw);
		if (!isFinite(t) || t <= 0) return { text: '—', overdue: false };
		const diff = t - now;
		const overdue = diff < 0;
		if (disp === 'clock') {
			const c = clockMs(Math.abs(diff));
			return { text: overdue ? `-${c}` : c, overdue };
		}
		const dur = humanizeMs(Math.abs(diff));
		return overdue ? { text: `Overdue by ${dur}`, overdue } : { text: `${dur} left`, overdue };
	}

	$: sla = slaInfo(deadline, display, nowMs);
</script>

<div class="{className} sla" role="timer" aria-label="{label}: {sla.text}">
	<span class="sla-label">{label}</span>
	<span class="sla-value" class:overdue={sla.overdue}>{sla.text}</span>
</div>

<style>
	.sla {
		display: flex;
		flex-direction: column;
		gap: 8px;
		font-family: var(--db-fontstack);
	}
	.sla-label {
		font-size: var(--db-fontsize-small);
		color: var(--db-color-text-secondary);
	}
	.sla-value {
		font-size: var(--db-fontsize-medium);
		font-weight: var(--db-fontweight-medium);
		color: var(--db-color-text-secondary);
	}
	.sla-value.overdue {
		color: var(--db-color-text-danger);
		font-weight: var(--db-fontweight-bold);
	}
</style>
