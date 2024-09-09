<script lang="ts">
	import { afterUpdate, getContext, onMount } from 'svelte';
	import type { PopoverContext, PopoverState } from '$lib/types.js';

	let contentEl: HTMLDivElement;

	let ctx = getContext('popover') as PopoverContext;
	let isOpen = getContext('popoverState') as PopoverState;

	onMount(() => {
		ctx.content = contentEl;

		console.log(ctx.content);
	});
</script>

<div bind:this={contentEl} style="display: contents;">
	<slot />
</div>

<style>
	div :global(:first-child) {
		position: absolute;
		left: 0;
		right: 0;
		display: none;
	}
</style>
