<script lang="ts">
	import { createEventDispatcher, setContext } from 'svelte';
	import { writable } from 'svelte/store';

	export let background: boolean = false;
	export { className as class };
	let className = '';

	const ctx = writable<HTMLElement>();
	setContext('ctx', ctx);

	const dispatch = createEventDispatcher();

	function init(node: HTMLElement) {
		const destroy = ctx.subscribe((x) => {
			if (x) node.replaceChildren(x);
			dispatch('change', { detail: node });
		});

		return { destroy };
	}
</script>

<ul class={className} class:background>
	<slot />
</ul>

<div use:init />

<style>
	ul {
		display: flex;
		list-style: none;
		width: 100%;
		border-bottom: 1px solid var(--db-color-border);
		column-gap: 1.5rem;
		padding: 0 1rem;
		height: 3rem;
	}

	ul.background {
		background-color: var(--db-color-bg-secondary);
	}

	div {
		display: contents;
	}
</style>
