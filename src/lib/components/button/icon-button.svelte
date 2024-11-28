<script lang="ts">
	import Button from './button.svelte';
	type Variant = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger' | 'danger-secondary';
	export let variant: Variant = 'primary';
	export let disabled = false;
	export let href: string | undefined = undefined;
	export let tabindex: number | undefined = 0;
	export let popovertarget: string | undefined = undefined;
	export { className as class };
	let className = '';
</script>

<div>
	<Button
		on:click
		on:focus
		on:blur
		on:mouseover
		on:mouseenter
		on:mouseleave
		{variant}
		{disabled}
		{href}
		{tabindex}
		{popovertarget}
		class="{className} icon-button"
	>
		<slot />
	</Button>
</div>

<style>
	div :global(.icon-button) {
		padding: 0;
		--icon-button-dimension: calc(var(--db-size-large) - var(--db-size-xxxsmall));
		height: var(--icon-button-dimension);
		width: var(--icon-button-dimension);
		cursor: pointer;
	}

	div :global(.icon) {
		pointer-events: none;
	}
</style>
