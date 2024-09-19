<script lang="ts">
	import { setContext } from 'svelte';

	type Variant = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger' | 'danger-secondary';
	export let variant: Variant = 'primary';
	export let disabled = false;
	export let href: string | undefined = undefined;
	export let tabindex: number | undefined = 0;
	export let popovertarget: string | undefined = undefined;
	export { className as class };
	let className = '';
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	class="{className} {variant} button"
	{disabled}
	{href}
	target={href ? '_blank' : ''}
	rel={href ? 'noopener noreferrer' : ''}
	{tabindex}
	{popovertarget}
	role="button"
	on:mousedown|preventDefault
	on:click
	on:focus
	on:blur
	on:mouseover
	on:mouseenter
	on:mouseleave
>
	{#if $$slots['left-icon']}
		<div class="left-icon"><slot name="left-icon" /></div>
	{/if}

	<slot />

	{#if $$slots['right-icon']}
		<div class="right-icon"><slot name="right-icon" /></div>
	{/if}
</svelte:element>

<style>
	.button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: calc(var(--db-size-large) - var(--db-size-xxxsmall));
		border-radius: var(--db-border-radius-medium);
		user-select: none;
		outline: none;
		text-decoration: none;
		flex-shrink: 0;
		padding: 0 var(--db-size-xsmall);
		border: none;
		margin: 0.125rem 0;
		cursor: pointer;
		outline-offset: 0.125rem;

		font-family: var(--db-fontstack);
		font-size: var(--db-fontsize-small);
		letter-spacing: var(--db-letterSpacing-small);
		line-height: var(--db-lineHeight);
	}
	.button:hover {
		cursor: pointer;
	}
	.button:disabled {
		cursor: default;
	}

	.left-icon :global(> *) {
		margin-left: calc(-1 * var(--db-size-xxsmall));
		margin-right: var(--db-size-xxxsmall);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.right-icon :global(> *) {
		margin-right: calc(-1 * var(--db-size-xxsmall));
		margin-left: var(--db-size-xxxsmall);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* primary */

	.primary {
		background-color: var(--db-color-bg-brand);
		color: var(--db-color-text-onbrand);
		--icon-color: var(--db-color-icon-onbrand);
	}
	.primary:hover {
		background-color: var(--db-color-bg-brand-hover);
	}
	.primary:focus {
		outline: var(--focus-ring-width) solid var(--db-color-border-focus);
	}
	.primary:disabled {
		background-color: var(--db-color-bg-brand-disabled);
	}
	.primary :global(.icon) {
		color: var(--db-color-icon-onbrand);
	}
	.primary :global(.icon svg path) {
		fill: var(--db-color-icon-onbrand);
	}

	/* secondary */

	.secondary {
		background-color: transparent;
		color: var(--db-color-text-brand);
		border: 0.0625rem solid var(--db-color-border-brand-strong);
		height: calc(var(--db-size-large) - var(--db-size-xxxsmall));
		--icon-color: var(--db-color-icon-brand);
	}
	.secondary:hover {
		color: var(--db-color-text-brand-hover);
		border: 0.0625rem solid var(--db-color-border-brand-strong-hover);
		--icon-color: var(--db-color-icon-brand-hover);
	}
	.secondary:focus {
		outline: var(--focus-ring-width) solid var(--db-color-border-focus);
	}
	.secondary:disabled {
		color: var(--db-color-text-brand-disabled);
		border: 0.0625rem solid var(--db-color-border-brand-disabled);
	}
	.secondary :global(.icon) {
		color: var(--db-color-icon-brand);
	}
	.secondary :global(.icon svg path) {
		fill: var(--db-color-icon-brand);
	}

	/* tertiary */

	.tertiary {
		background-color: transparent;
		color: var(--db-color-text);
		border: 0.0625rem solid var(--db-color-border);
		height: calc(var(--db-size-large) - var(--db-size-xxxsmall));
		--icon-color: var(--db-color-icon);
	}
	.tertiary:hover {
		border: 0.0625rem solid var(--db-color-border-hover);
	}
	.tertiary:focus {
		outline: var(--focus-ring-width) solid var(--db-color-border-focus);
	}
	.tertiary:disabled {
		color: var(--db-color-text-disabled);
		border: 0.0625rem solid var(--db-color-border-disabled);
	}
	.tertiary :global(.icon) {
		color: var(--db-color-icon);
	}
	.tertiary :global(.icon svg path) {
		fill: var(--db-color-icon);
	}

	/* danger */

	.danger {
		background-color: var(--db-color-bg-danger);
		color: var(--db-color-text-ondanger);
		--icon-color: var(--db-color-icon-ondanger);
	}
	.danger:hover {
		background-color: var(--db-color-bg-danger-hover);
	}
	.danger:focus {
		outline: var(--focus-ring-width) solid var(--db-color-border-focus);
	}
	.danger:disabled {
		background-color: var(--db-color-bg-danger-disabled);
	}
	.danger :global(.icon) {
		color: var(--db-color-icon-ondanger);
	}
	.danger :global(.icon svg path) {
		fill: var(--db-color-icon-ondanger);
	}

	/* danger-secondary */
	.danger-secondary {
		background-color: transparent;
		color: var(--db-color-text-danger);
		border: 0.0625rem solid var(--db-color-border-danger);
		--icon-color: var(--db-color-icon-danger);
	}
	.danger-secondary:hover {
		color: var(--db-color-text-danger-hover);
		border: 0.0625rem solid var(--db-color-border-danger-strong-hover);
		--icon-color: var(--db-color-icon-danger-hover);
	}
	.danger-secondary:focus {
		outline: var(--focus-ring-width) solid var(--db-color-border-focus);
	}
	.danger-secondary:disabled {
		color: var(--db-color-text-danger-disabled);
		border: 0.0625rem solid var(--db-color-border-danger-disabled);
	}
	.danger-secondary :global(.icon) {
		color: var(--db-color-icon-danger);
	}
	.danger-secondary :global(.icon svg path) {
		fill: var(--db-color-icon-danger);
	}

	/* ghost */
	.ghost {
		background-color: transparent;
		color: var(--db-color-text-brand);
		border: 0.0625rem solid transparent;
		--icon-color: var(--db-color-icon);
	}
	.ghost:hover {
		background-color: var(--db-color-bg-secondary);
		color: var(--db-color-text-brand-hover);
	}
	.ghost:focus {
		outline: var(--focus-ring-width) solid var(--db-color-border-focus);
	}
	.ghost:disabled {
		color: var(--db-color-text-brand-disabled);
		background: transparent;
	}
	.ghost :global(.icon) {
		color: var(--db-color-icon);
	}
	.ghost :global(.icon svg path) {
		fill: var(--db-color-icon);
	}
</style>
