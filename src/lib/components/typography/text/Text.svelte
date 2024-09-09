<script lang="ts">
	export let type:
		| 'primary'
		| 'secondary'
		| 'tertiary'
		| 'brand'
		| 'info'
		| 'success'
		| 'warning'
		| 'danger'
		| 'oninverse' = 'primary';
	export let size: 'small' | 'medium' | 'large' | 'xlarge' | number | string = 'medium';
	export let weight: 'regular' | 'medium' | 'bold' = 'regular';
	export let align: 'left' | 'center' | 'right' | 'justify' = 'left';
	export let tag:
		| 'p'
		| 'span'
		| 'small'
		| 'strong'
		| 'em'
		| 'h1'
		| 'h2'
		| 'h3'
		| 'h4'
		| 'h5'
		| 'h6' = 'span';
	export let decoration: 'underline' | 'line-through' | 'none' = 'none';
	export let italics: boolean = false;
	export { className as class };
	let className = '';

	let iscustomSize = false;
	let fontSize = '';

	const fontSizeMap = {
		small: '0.75rem',
		medium: '0.875rem',
		large: '1rem',
		xlarge: '1.5rem'
	};

	// @ts-ignore
	if (!['small', 'medium', 'large', 'xlarge'].includes(size)) {
		iscustomSize = true;
		fontSize = `${+size / 16}rem`;
	} else {
		// @ts-ignore
		fontSize = fontSizeMap[size];
	}
</script>

<svelte:element
	this={tag}
	class="{className} text db-color-text-{type} db-fontweight-{weight}"
	style="text-align: {align}; text-decoration: {decoration}; font-size: {fontSize}"
	class:customSize={iscustomSize}
	class:italics
>
	<slot />
</svelte:element>

<style>
	.text {
		font-family: var(--db-fontstack);
		text-underline-position: from-font;
	}
</style>
