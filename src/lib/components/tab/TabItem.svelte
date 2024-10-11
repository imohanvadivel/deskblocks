<script lang="ts">
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let open = false;
	export let title: string;
	export { className as class };
	let className = '';

	const ctx = getContext<Writable<HTMLElement>>('ctx');

	function init(node: HTMLElement) {
		ctx.set(node);

		const destroy = ctx.subscribe((x) => {
			if (x !== node) open = false;
		});

		return { destroy };
	}
</script>

<li class:open class={className}>
	<button
		type="button"
		on:click={() => (open = true)}
		on:click
		on:focus
		on:blur
		on:mouseover
		on:mouseleave
		on:mouseenter
	>
		{title}</button
	>

	{#if open}
		<div use:init>
			<slot />
		</div>
	{/if}
</li>

<style>
	li {
		display: flex;
		align-items: center;
    margin-bottom: -0.0625rem;
	}

	button {
		border: none;
		outline: none;
		background-color: transparent;
		color: var(--db-color-text-tertiary);
		font-family: var(--db-fontstack); 
		font-weight: var(--db-fontweight-medium);
		font-size: var(--db-fontsize-small);
		text-transform: uppercase;
		letter-spacing: 0.06em;
    height: calc(100% - 0.125rem);
    margin-top: 0.125rem;
		border-bottom: 2px solid transparent;
	}

	button:hover {
		color: var(--db-color-text);
	}

	.open button {
		color: var(--db-color-text);
		border-bottom: 2px solid var(--db-color-text);
	}

	div {
		display: contents;
		font-size: var(--db-fontsize-medium);
	}
</style>
