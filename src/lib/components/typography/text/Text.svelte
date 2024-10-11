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
	export let disabled: boolean = false;
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
	class="{className} text .type-{type} db-fontweight-{weight}"
	style="text-align: {align}; text-decoration: {decoration}; font-size: {fontSize}"
	class:customSize={iscustomSize}
	class:italics
	class:disabled
>
	<slot />
</svelte:element>

<style>
	.text {
		font-family: var(--db-fontstack);
		text-underline-position: from-font;
	}
	.disabled,
	.disabled.type-primary,
	.disabled.type-secondary,
	.disabled.type-tertiary {
		color: var(--db-color-text-disabled);
	}

	.disabled.type-brand {
		color: var(--db-color-text-brand-disabled);
	}
	.disabled.type-info {
		color: var(--db-color-text-info-disabled);
	}
	.disabled.type-success {
		color: var(--db-color-text-success-disabled);
	}
	.disabled.type-warning {
		color: var(--db-color-text-warning-disabled);
	}
	.disabled.type-danger {
		color: var(--db-color-text-danger-disabled);
	}
</style>
