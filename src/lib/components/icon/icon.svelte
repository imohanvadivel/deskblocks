<script lang="ts">
	import { getContext } from 'svelte';
	export let icon: string | undefined = undefined;
	export let size: 'small' | 'medium' | number = 'small';
	export let color: string | undefined = undefined;
	export { className as class };
	let className = '';

	const sizes = {
		small: `1.5rem`,
		medium: `2rem`,
		large: `2.5rem`
	};

	$: iconSize = typeof size === 'number' ? `${size / 16}rem` : sizes[size];
	$: svgSize = `calc(${iconSize} - 0.5rem)`;
</script>

<div
	class="{className} icon"
	style="width: {iconSize}; height: {iconSize}; --svg-size: {svgSize}; --color: var({color});"
	role="img"
	aria-label="Icon"
>
	{@html icon}
</div>

<style>
	.icon {
		--icon-color: var(--color, var(--db-color-icon));
		display: inline-flex;
		align-items: center;
		justify-content: center;
		cursor: default;
		user-select: none;
		font-family: var(--db-fontstack);
		color: var(--icon-color);
		fill: var(--icon-color);
	}
	.icon :global(svg) {
		width: var(--svg-size);
		height: var(--svg-size);
	}
	.icon :global(*) {
		fill: inherit;
		color: inherit;
	}
</style>
