<script lang="ts">
	/**
	 * Chart — inline-SVG data visualization. 13 shapes:
	 * bar, column, stackedColumn, line, area, spline, pie, donut,
	 * gauge, funnel, heatmap, scorecard, sparkline.
	 *
	 * Takes PREPARED data. Grouping raw records by a category field,
	 * count/sum aggregation, relabeling blank categories and any other
	 * data shaping happen in the host app before the data reaches here.
	 */
	type ChartType =
		| 'bar'
		| 'column'
		| 'stackedColumn'
		| 'line'
		| 'area'
		| 'spline'
		| 'pie'
		| 'donut'
		| 'gauge'
		| 'funnel'
		| 'heatmap'
		| 'scorecard'
		| 'sparkline';

	/** One category/point of a single-series chart.
	 *  `color` accepts a tone name ('info' | 'brand' | 'success' | 'warning' |
	 *  'danger' | 'neutral'), a `--db-*` token, `var(--token)`, hex, rgb()/hsl()
	 *  or a CSS named color. Unresolvable values fall back to the palette —
	 *  never to black/currentColor. */
	type ChartDatum = { label: string; value: number; color?: string };

	/** One series of a multi-series chart (grouped/stacked column, grouped bar,
	 *  multi-line/area/spline, heatmap columns). Pair with `labels`. */
	type ChartSeries = { name?: string; color?: string; values: number[] };

	/** Chart shape to draw. */
	export let type: ChartType = 'column';
	/** Single-series data: one entry per category/point. Ignored when `series` is set. */
	export let data: ChartDatum[] = [];
	/** Category labels for multi-series charts (one per index of each series' `values`). */
	export let labels: string[] | undefined = undefined;
	/** Multi-series data. When set, `labels` provides the categories and `data` is ignored. */
	export let series: ChartSeries[] | undefined = undefined;
	/** Optional heading rendered above the chart. */
	export let title: string | undefined = undefined;
	/** Scale ceiling: the value axis/arc tops out at max(values, max). Gauges use it as the dial maximum. */
	export let max: number | undefined = undefined;
	/** Unit suffix appended to every rendered value (e.g. "%", "h"). */
	export let unit: string | undefined = undefined;
	/** Drawing height in px for column/stackedColumn/line/area/spline (default 200).
	 *  Other types size to their content. */
	export let height: number | undefined = undefined;
	/** Show the legend under multi-series charts (auto-hidden when < 2 named series). */
	export let showLegend = true;
	/** Text shown when there is no data to draw. */
	export let emptyMessage = 'No data to chart.';
	export { className as class };
	let className = '';

	// Categorical palette — hue-interleaved so adjacent series don't clash, and
	// built from --db-* tokens so it adapts to light/dark automatically.
	const PALETTE = [
		'var(--db-color-bg-brand)', // blue
		'var(--db-color-bg-warning)', // amber
		'var(--db-color-bg-success)', // green
		'var(--db-color-bg-danger)', // red
		'var(--db-color-text-brand)', // deep blue
		'var(--db-color-bg-info, var(--db-color-bg-brand))' // cyan/info
	];
	const C_TXT = 'var(--db-color-text)';
	const C_AXIS = 'var(--db-color-text-secondary)';
	const C_GRID = 'var(--db-color-border)';
	const C_TRACK = 'var(--db-color-bg-tertiary)';

	// Badge-style tones → chart-safe theme colors, so colors written the same
	// way as badge/chip tones ("info", "success", …) still paint slices.
	const TONE_COLORS: Record<string, string> = {
		info: 'var(--db-color-bg-info, var(--db-color-bg-brand))',
		brand: 'var(--db-color-bg-brand)',
		success: 'var(--db-color-bg-success)',
		warning: 'var(--db-color-bg-warning)',
		danger: 'var(--db-color-bg-danger)',
		neutral: 'var(--db-color-text-tertiary)'
	};

	const XML_ESC: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
	function escXml(s: unknown): string {
		return String(s ?? '').replace(/[&<>"]/g, (c) => XML_ESC[c]);
	}

	/**
	 * Resolves a supplied color to something guaranteed to paint. Anything
	 * unresolvable falls back to `fallback` (a palette entry) — NEVER to
	 * currentColor/black: an invalid value in `style="fill:…"` makes the whole
	 * declaration invalid and SVG fill's initial value is black.
	 */
	function safeColor(c: unknown, fallback: string): string {
		if (typeof c !== 'string') return fallback;
		const t = c.trim();
		const tone = TONE_COLORS[t.toLowerCase()];
		if (tone) return tone;
		if (/^--db[\w-]+$/.test(t)) return `var(${t}, ${fallback})`;
		const mv = t.match(/^var\(\s*(--[\w-]+)\s*\)$/);
		if (mv) return `var(${mv[1]}, ${fallback})`;
		if (/^#[0-9a-fA-F]{3,8}$/.test(t)) return t;
		if (/^(rgb|hsl)a?\([\d\s.,%/]+\)$/.test(t)) return t;
		if (/^[a-zA-Z]+$/.test(t) && typeof CSS !== 'undefined' && CSS.supports('color', t)) return t;
		return fallback;
	}

	function nnum(v: unknown): number {
		const n = Number(v);
		return isFinite(n) ? n : 0;
	}

	function fmtNum(v: number, u?: string): string {
		const r = Math.round(v * 100) / 100;
		return `${r}${u ?? ''}`;
	}

	function trunc(s: string, n = 9): string {
		return s.length > n ? s.slice(0, n - 1) + '…' : s;
	}

	/** Compacts a date-like axis label ("2026-01-15T09:…" → "Jan '26") so x-axis
	 *  ticks fit without truncation; leaves non-date labels (statuses etc.) as-is. */
	function axisLabel(lab: string): string {
		if (typeof lab === 'string' && /^\d{4}-\d{2}/.test(lab)) {
			const d = new Date(lab);
			if (!isNaN(d.getTime())) {
				const mo = d.toLocaleDateString(undefined, { month: 'short' });
				return `${mo} '${String(d.getFullYear()).slice(-2)}`;
			}
		}
		return lab;
	}

	function polar(cx: number, cy: number, r: number, ang: number): [number, number] {
		const a = ((ang - 90) * Math.PI) / 180;
		return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
	}

	function pieSlice(cx: number, cy: number, r: number, a0: number, a1: number): string {
		if (a1 - a0 >= 359.999) return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r} Z`;
		const [x0, y0] = polar(cx, cy, r, a0);
		const [x1, y1] = polar(cx, cy, r, a1);
		const large = a1 - a0 > 180 ? 1 : 0;
		return `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`;
	}

	// `fixed` renders at natural px width (overflows into the scroll container
	// for charts with many categories); otherwise scales responsively to 100%.
	function svgWrap(w: number, h: number, inner: string, fixed = false): string {
		const sizing = fixed
			? `width="${w}" style="display:block;width:${w}px;height:auto"`
			: `width="100%" style="display:block;height:auto;max-height:${h + 40}px"`;
		return `<svg viewBox="0 0 ${w} ${h}" ${sizing} preserveAspectRatio="xMidYMid meet" role="img">${inner}</svg>`;
	}

	function txt(
		x: number,
		y: number,
		s: string,
		anchor: string,
		color: string,
		size = 13,
		weight = 400
	): string {
		return `<text x="${x}" y="${y}" text-anchor="${anchor}" style="fill:${color};font-size:${size}px;font-weight:${weight};font-family:var(--db-fontstack, sans-serif)">${escXml(s)}</text>`;
	}

	type Ser = { name: string; color: string; values: number[] };

	function legendHtml(items: Ser[], legend: boolean): string {
		if (!legend || items.length < 2 || items.every((it) => !it.name)) return '';
		const chips = items
			.map(
				(it) =>
					`<span class="db-chart-leg"><span class="db-chart-swatch" style="background:${it.color}"></span>${escXml(it.name)}</span>`
			)
			.join('');
		return `<div class="db-chart-legend">${chips}</div>`;
	}

	function splinePath(pts: number[][]): string {
		if (pts.length < 2) return pts.map((p, k) => `${k ? 'L' : 'M'} ${p[0]} ${p[1]}`).join(' ');
		let d = `M ${pts[0][0]} ${pts[0][1]}`;
		for (let i = 0; i < pts.length - 1; i++) {
			const p0 = pts[i - 1] || pts[i],
				p1 = pts[i],
				p2 = pts[i + 1],
				p3 = pts[i + 2] || p2;
			const c1x = p1[0] + (p2[0] - p0[0]) / 6,
				c1y = p1[1] + (p2[1] - p0[1]) / 6;
			const c2x = p2[0] - (p3[0] - p1[0]) / 6,
				c2y = p2[1] - (p3[1] - p1[1]) / 6;
			d += ` C ${c1x} ${c1y} ${c2x} ${c2y} ${p2[0]} ${p2[1]}`;
		}
		return d;
	}

	function columnChart(
		lbs: string[],
		sers: Ser[],
		stacked: boolean,
		catColors: (string | undefined)[],
		maxCap: number | undefined,
		u: string | undefined,
		hOverride: number | undefined,
		legend: boolean
	): string {
		const n = lbs.length;
		const P = { l: 16, r: 12, t: 22, b: 28 };
		// Grow width with category count so bars/labels never cram; scroll when wide.
		const minSlot = 46,
			baseW = 340;
		const W = Math.max(baseW, n * minSlot + P.l + P.r);
		const fixed = W > baseW;
		const H = hOverride ?? 200;
		const pw = W - P.l - P.r,
			ph = H - P.t - P.b;
		const single = sers.length === 1;
		const maxV = Math.max(
			1,
			maxCap ?? 0,
			stacked
				? Math.max(...lbs.map((_, c) => sers.reduce((s, se) => s + se.values[c], 0)))
				: Math.max(...sers.flatMap((se) => se.values))
		);
		const slot = pw / Math.max(1, n);
		let o = `<line x1="${P.l}" y1="${P.t + ph}" x2="${W - P.r}" y2="${P.t + ph}" style="stroke:${C_GRID};stroke-width:1"/>`;
		lbs.forEach((lab, c) => {
			const cx = P.l + slot * (c + 0.5);
			if (stacked) {
				let acc = 0;
				const bw = Math.min(40, slot * 0.6);
				sers.forEach((se) => {
					const h = (se.values[c] / maxV) * ph;
					const y = P.t + ph - acc - h;
					o += `<rect x="${cx - bw / 2}" y="${y}" width="${bw}" height="${Math.max(0, h)}" rx="1" style="fill:${se.color}"/>`;
					acc += h;
				});
				const tot = sers.reduce((s, se) => s + se.values[c], 0);
				o += txt(cx, P.t + ph - acc - 6, fmtNum(tot, u), 'middle', C_TXT, 12, 600);
			} else {
				// Center the (single bar or grouped bars) on the slot centre so the
				// value label above lines up with the bar.
				const gap2 = 2;
				const bw = Math.max(6, Math.min(30, (slot * 0.72 - (sers.length - 1) * gap2) / sers.length));
				const groupW = sers.length * bw + (sers.length - 1) * gap2;
				sers.forEach((se, si) => {
					const h = (se.values[c] / maxV) * ph;
					const x = cx - groupW / 2 + si * (bw + gap2);
					const y = P.t + ph - h;
					const fill = single ? (catColors[c] ?? se.color) : se.color;
					o += `<rect x="${x}" y="${y}" width="${bw}" height="${Math.max(0, h)}" rx="1" style="fill:${fill}"/>`;
					if (single) o += txt(cx, y - 6, fmtNum(se.values[c], u), 'middle', C_TXT, 12, 600);
				});
			}
			o += txt(cx, P.t + ph + 16, trunc(axisLabel(lab), 10), 'middle', C_AXIS, 11);
		});
		return svgWrap(W, H, o, fixed) + legendHtml(sers, legend);
	}

	function barChart(
		lbs: string[],
		sers: Ser[],
		catColors: (string | undefined)[],
		maxCap: number | undefined,
		u: string | undefined,
		legend: boolean
	): string {
		const n = lbs.length,
			W = 340,
			P = { l: 92, r: 40, t: 8, b: 8 };
		const single = sers.length === 1;
		const rowH = 30,
			H = Math.max(90, rowH * n + P.t + P.b);
		const pw = W - P.l - P.r;
		const maxV = Math.max(1, maxCap ?? 0, Math.max(...sers.flatMap((se) => se.values)));
		let o = '';
		lbs.forEach((lab, c) => {
			const cy = P.t + rowH * (c + 0.5);
			const bh = Math.min(14, (rowH * 0.62) / sers.length);
			sers.forEach((se, si) => {
				const w = (se.values[c] / maxV) * pw;
				const y = cy - (bh * sers.length) / 2 + si * bh;
				const fill = single ? (catColors[c] ?? se.color) : se.color;
				o += `<rect x="${P.l}" y="${y}" width="${Math.max(0, w)}" height="${Math.max(0, bh - 1)}" rx="1" style="fill:${fill}"/>`;
			});
			o += txt(P.l - 8, cy + 4, trunc(lab, 14), 'end', C_AXIS, 12);
			if (single)
				o += txt(
					P.l + (sers[0].values[c] / maxV) * pw + 5,
					cy + 4,
					fmtNum(sers[0].values[c], u),
					'start',
					C_TXT,
					12,
					600
				);
		});
		return svgWrap(W, H, o) + legendHtml(sers, legend);
	}

	function lineChart(
		lbs: string[],
		sers: Ser[],
		kind: string,
		maxCap: number | undefined,
		hOverride: number | undefined,
		legend: boolean
	): string {
		const n = lbs.length,
			H = hOverride ?? 200,
			P = { l: 18, r: 14, t: 16, b: 28 };
		// Grow width with point count; scroll when wide so points don't bunch up.
		const baseW = 340,
			W = Math.max(baseW, n * 40 + P.l + P.r),
			fixed = W > baseW;
		const pw = W - P.l - P.r,
			ph = H - P.t - P.b;
		const maxV = Math.max(1, maxCap ?? 0, Math.max(...sers.flatMap((se) => se.values)));
		const xF = (c: number) => (n <= 1 ? P.l + pw / 2 : P.l + (pw * c) / (n - 1));
		const yF = (v: number) => P.t + ph - (v / maxV) * ph;
		let o = `<line x1="${P.l}" y1="${P.t + ph}" x2="${W - P.r}" y2="${P.t + ph}" style="stroke:${C_GRID};stroke-width:1"/>`;
		sers.forEach((se) => {
			const pts = se.values.map((v: number, c: number) => [xF(c), yF(v)]);
			const d =
				kind === 'spline'
					? splinePath(pts)
					: pts.map((p, k) => `${k ? 'L' : 'M'} ${p[0]} ${p[1]}`).join(' ');
			if (kind === 'area')
				o += `<path d="${d} L ${xF(n - 1)} ${P.t + ph} L ${xF(0)} ${P.t + ph} Z" style="fill:${se.color};fill-opacity:0.15"/>`;
			o += `<path d="${d}" fill="none" style="stroke:${se.color};stroke-width:2;stroke-linejoin:round;stroke-linecap:round"/>`;
			pts.forEach((p) => (o += `<circle cx="${p[0]}" cy="${p[1]}" r="2.5" style="fill:${se.color}"/>`));
		});
		// Thin x-labels when crowded so they don't overlap (unless scrolling wide).
		const step = fixed ? 1 : Math.ceil(n / 8);
		lbs.forEach((lab, c) => {
			if (c % step === 0)
				o += txt(xF(c), P.t + ph + 16, trunc(axisLabel(lab), 10), 'middle', C_AXIS, 11);
		});
		return svgWrap(W, H, o, fixed) + legendHtml(sers, legend);
	}

	function pieChart(
		lbs: string[],
		ser0: Ser,
		kind: string,
		catColors: (string | undefined)[],
		u: string | undefined
	): string {
		const W = 340,
			H = 210,
			cx = 108,
			cy = 100,
			r = 84,
			rInner = kind === 'donut' ? 50 : 0;
		const vals = ser0.values;
		const total = vals.reduce((s: number, v: number) => s + v, 0);
		const colOf = (idx: number) => catColors[idx] ?? PALETTE[idx % PALETTE.length];
		let o = '',
			a = 0;
		if (total <= 0) {
			o += `<circle cx="${cx}" cy="${cy}" r="${r}" style="fill:none;stroke:${C_TRACK};stroke-width:${kind === 'donut' ? r - rInner : 2}"/>`;
		} else {
			vals.forEach((v: number, idx: number) => {
				const sweep = (v / total) * 360;
				if (v > 0)
					o += `<path d="${pieSlice(cx, cy, r, a, a + sweep)}" style="fill:${colOf(idx)}"/>`;
				a += sweep;
			});
		}
		if (kind === 'donut') {
			o += `<circle cx="${cx}" cy="${cy}" r="${rInner}" style="fill:var(--db-color-bg)"/>`;
			o += txt(cx, cy + 2, fmtNum(total, u), 'middle', C_TXT, 24, 700);
			o += txt(cx, cy + 20, 'Total', 'middle', C_AXIS, 11);
		}
		const lx = 210;
		lbs.forEach((lab, idx) => {
			const ly = 34 + idx * 22;
			o += `<rect x="${lx}" y="${ly - 9}" width="10" height="10" rx="2" style="fill:${colOf(idx)}"/>`;
			o += txt(lx + 16, ly, `${trunc(lab, 12)}  ${fmtNum(vals[idx], u)}`, 'start', C_TXT, 12);
		});
		return svgWrap(W, H, o);
	}

	function gaugeChart(
		lbs: string[],
		ser0: Ser,
		catColors: (string | undefined)[],
		maxCap: number | undefined,
		u: string | undefined
	): string {
		const W = 300,
			H = 180,
			cx = 150,
			cy = 150,
			r = 110;
		const value = ser0.values.length ? ser0.values[0] : 0;
		const dialMax = Math.max(1, maxCap ?? Math.max(value, ...ser0.values, 1));
		const pct = Math.max(0, Math.min(1, value / dialMax));
		const track = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
		const col = catColors[0] ?? PALETTE[0];
		let o = `<path d="${track}" fill="none" style="stroke:${C_TRACK};stroke-width:16;stroke-linecap:round"/>`;
		o += `<path d="${track}" fill="none" pathLength="100" style="stroke:${col};stroke-width:16;stroke-linecap:round;stroke-dasharray:${(pct * 100).toFixed(2)} 100"/>`;
		o += txt(cx, cy - 18, fmtNum(value, u), 'middle', C_TXT, 26, 700);
		o += txt(cx - r, cy + 18, '0', 'middle', C_AXIS, 11);
		o += txt(cx + r, cy + 18, fmtNum(dialMax, u), 'middle', C_AXIS, 11);
		if (lbs[0]) o += txt(cx, cy + 4, trunc(lbs[0], 16), 'middle', C_AXIS, 12);
		return svgWrap(W, H, o);
	}

	function funnelChart(
		lbs: string[],
		ser0: Ser,
		catColors: (string | undefined)[],
		u: string | undefined
	): string {
		const vals = ser0.values,
			n = vals.length;
		const W = 340,
			rowH = 36,
			P = { t: 6, b: 6 },
			H = rowH * n + P.t + P.b;
		const maxV = Math.max(1, ...vals),
			midX = W / 2,
			maxW = W - 24;
		const wOf = (v: number) => (v / maxV) * maxW;
		let o = '';
		for (let c = 0; c < n; c++) {
			const yTop = P.t + c * rowH,
				yBot = yTop + rowH - 4;
			const wT = wOf(vals[c]),
				wB = wOf(vals[c + 1] ?? vals[c]);
			const col = catColors[c] ?? PALETTE[c % PALETTE.length];
			o += `<path d="M ${midX - wT / 2} ${yTop} L ${midX + wT / 2} ${yTop} L ${midX + wB / 2} ${yBot} L ${midX - wB / 2} ${yBot} Z" style="fill:${col};fill-opacity:0.9"/>`;
			o += txt(
				midX,
				yTop + 16,
				`${trunc(lbs[c], 16)}  ${fmtNum(vals[c], u)}`,
				'middle',
				'var(--db-color-text-onbrand, #fff)',
				12,
				600
			);
		}
		return svgWrap(W, H, o);
	}

	function heatmapChart(
		lbs: string[],
		sers: Ser[],
		maxCap: number | undefined,
		u: string | undefined
	): string {
		const cols = sers,
			nRows = lbs.length,
			nCols = cols.length;
		const W = 340,
			P = { l: 92, t: 24, r: 8, b: 8 },
			cellH = 26;
		const H = P.t + nRows * cellH + P.b;
		const cellW = (W - P.l - P.r) / Math.max(1, nCols);
		const maxV = Math.max(1, maxCap ?? 0, Math.max(...sers.flatMap((s) => s.values)));
		let o = '';
		cols.forEach(
			(s, ci) =>
				(o += txt(P.l + cellW * (ci + 0.5), P.t - 8, trunc(s.name || `S${ci + 1}`, 8), 'middle', C_AXIS, 11))
		);
		lbs.forEach((lab, ri) => {
			o += txt(P.l - 8, P.t + cellH * (ri + 0.5) + 4, trunc(lab, 14), 'end', C_AXIS, 12);
			cols.forEach((s, ci) => {
				const v = s.values[ri];
				const op = maxV > 0 ? 0.12 + 0.88 * (v / maxV) : 0;
				const x = P.l + cellW * ci,
					y = P.t + cellH * ri;
				o += `<rect x="${x + 1}" y="${y + 1}" width="${cellW - 2}" height="${cellH - 2}" rx="2" style="fill:${v > 0 ? 'var(--db-color-bg-brand)' : C_TRACK};fill-opacity:${v > 0 ? op.toFixed(2) : 1}"/>`;
				o += txt(x + cellW / 2, y + cellH / 2 + 4, fmtNum(v, u), 'middle', C_TXT, 11);
			});
		});
		return svgWrap(W, H, o);
	}

	function sparkSvg(values: number[], color: string, w = 150, h = 40): string {
		if (!values.length) return svgWrap(w, h, '');
		const P = 4,
			pw = w - P * 2,
			ph = h - P * 2;
		const hi = Math.max(...values),
			lo = Math.min(...values),
			span = hi - lo || 1;
		const xF = (c: number) => (values.length <= 1 ? P + pw / 2 : P + (pw * c) / (values.length - 1));
		const yF = (v: number) => P + ph - ((v - lo) / span) * ph;
		const pts = values.map((v, c) => [xF(c), yF(v)]);
		const d = pts.map((p, k) => `${k ? 'L' : 'M'} ${p[0]} ${p[1]}`).join(' ');
		const last = pts[pts.length - 1];
		return svgWrap(
			w,
			h,
			`<path d="${d} L ${last[0]} ${h - P} L ${P} ${h - P} Z" style="fill:${color};fill-opacity:0.12"/><path d="${d}" fill="none" style="stroke:${color};stroke-width:2;stroke-linecap:round;stroke-linejoin:round"/><circle cx="${last[0]}" cy="${last[1]}" r="2.5" style="fill:${color}"/>`
		);
	}

	function scorecardHtml(ser0: Ser, u: string | undefined): string {
		const vals = ser0.values;
		const value = vals.length ? vals[vals.length - 1] : 0;
		const first = vals.length ? vals[0] : 0;
		const delta = value - first;
		const pct = first !== 0 ? (delta / Math.abs(first)) * 100 : 0;
		const up = delta >= 0;
		const arrow = up ? '▲' : '▼';
		const col = up ? 'var(--db-color-text-success)' : 'var(--db-color-text-danger)';
		const trend =
			vals.length > 1
				? `<span class="db-chart-score-trend" style="color:${col}">${arrow} ${fmtNum(Math.abs(Math.round(pct * 10) / 10), '%')}</span>`
				: '';
		const spark =
			vals.length > 1
				? `<div class="db-chart-score-spark">${sparkSvg(vals, PALETTE[0], 150, 36)}</div>`
				: '';
		return `<div class="db-chart-score"><div class="db-chart-score-row"><span class="db-chart-score-num">${escXml(fmtNum(value, u))}</span>${trend}</div>${spark}</div>`;
	}

	// --- reactive assembly (all deps referenced directly here) --------------
	$: multi = Array.isArray(series) && series.length > 0;
	$: resolvedLabels = multi ? (labels ?? []) : data.map((d) => d.label);
	$: resolvedSeries = (multi
		? series!.map((s, si) => ({
				name: s.name || '',
				color: safeColor(s.color, PALETTE[si % PALETTE.length]),
				values: (s.values || []).map(nnum)
			}))
		: [{ name: '', color: PALETTE[0], values: data.map((d) => nnum(d.value)) }]) as Ser[];
	// Per-category color overrides (single-series only): datum.color resolved
	// through the tone/token/palette logic; undefined → palette by index.
	$: catColors = multi
		? []
		: data.map((d, i) => (d.color != null ? safeColor(d.color, PALETTE[i % PALETTE.length]) : undefined));
	$: empty = multi ? resolvedSeries.every((s) => !s.values.length) : data.length === 0;
	$: markup = empty
		? ''
		: type === 'pie' || type === 'donut'
			? pieChart(resolvedLabels, resolvedSeries[0], type, catColors, unit)
			: type === 'gauge'
				? gaugeChart(resolvedLabels, resolvedSeries[0], catColors, max, unit)
				: type === 'funnel'
					? funnelChart(resolvedLabels, resolvedSeries[0], catColors, unit)
					: type === 'heatmap'
						? heatmapChart(resolvedLabels, resolvedSeries, max, unit)
						: type === 'scorecard'
							? scorecardHtml(resolvedSeries[0], unit)
							: type === 'sparkline'
								? `<div class="db-chart-spark">${sparkSvg(resolvedSeries[0].values, PALETTE[0])}</div>`
								: type === 'line' || type === 'area' || type === 'spline'
									? lineChart(resolvedLabels, resolvedSeries, type, max, height, showLegend)
									: type === 'bar'
										? barChart(resolvedLabels, resolvedSeries, catColors, max, unit, showLegend)
										: columnChart(
												resolvedLabels,
												resolvedSeries,
												type === 'stackedColumn',
												catColors,
												max,
												unit,
												height,
												showLegend
											);
</script>

<div class="{className} db-chart" role="img" aria-label={title ?? `${type} chart`}>
	{#if title}
		<h3 class="db-chart-title">{title}</h3>
	{/if}
	{#if empty}
		<p class="db-chart-empty">{emptyMessage}</p>
	{:else}
		<div class="db-chart-scroll">{@html markup}</div>
	{/if}
</div>

<style>
	.db-chart {
		display: flex;
		flex-direction: column;
		gap: 10px;
		font-family: var(--db-fontstack);
	}
	.db-chart-title {
		margin: 0;
		font-size: var(--db-fontsize-large);
		font-weight: var(--db-fontweight-bold);
		color: var(--db-color-text);
	}
	.db-chart-empty {
		margin: 0;
		font-size: var(--db-fontsize-medium);
		color: var(--db-color-text-secondary);
		line-height: var(--db-lineHeight-large);
	}
	/* Wide charts (many categories) render at natural width and scroll here. */
	.db-chart-scroll {
		overflow-x: auto;
		overflow-y: hidden;
		max-width: 100%;
	}
	/* Injected-markup targets: scoped parent + :global — safe per selector rules. */
	.db-chart :global(svg) {
		height: auto;
		overflow: visible;
	}
	.db-chart :global(.db-chart-legend) {
		display: flex;
		flex-wrap: wrap;
		gap: 6px 16px;
		font-size: var(--db-fontsize-small);
		color: var(--db-color-text-secondary);
	}
	.db-chart :global(.db-chart-leg) {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}
	.db-chart :global(.db-chart-swatch) {
		width: 10px;
		height: 10px;
		border-radius: 2px;
		display: inline-block;
	}
	.db-chart :global(.db-chart-score) {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.db-chart :global(.db-chart-score-row) {
		display: flex;
		align-items: baseline;
		gap: 10px;
	}
	.db-chart :global(.db-chart-score-num) {
		font-size: var(--db-fontsize-xlarge, 24px);
		font-weight: var(--db-fontweight-bold, 700);
		color: var(--db-color-text);
		line-height: 1.1;
	}
	.db-chart :global(.db-chart-score-trend) {
		font-size: var(--db-fontsize-small);
		font-weight: var(--db-fontweight-medium, 600);
	}
	.db-chart :global(.db-chart-score-spark),
	.db-chart :global(.db-chart-spark) {
		max-width: 220px;
	}
</style>
