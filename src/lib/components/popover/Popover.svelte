<script lang="ts">
	import { computePosition, flip, shift, offset } from '@floating-ui/dom';
	import { afterUpdate, setContext, tick } from 'svelte';
	import { writable } from 'svelte/store';
	import type { PopoverContext, PopoverEvent, PopoverPlacement, PopoverState } from '$lib/types.js';

	export let onOpen: PopoverEvent = undefined;
	export let onClose: PopoverEvent = undefined;
	export let placement: PopoverPlacement = 'bottom';
	export let isOpen: boolean = false;

	let context: PopoverContext = {
		trigger: null,
		content: null
	};

	const popoverState: PopoverState = writable(isOpen);

	setContext('popover', context);
	setContext('popoverState', popoverState);

	function compute() {
		if (!context.trigger || !context.content) return;

		let trigger = context.trigger.childNodes[0] as HTMLElement;
		let content = context.content.childNodes[0] as HTMLElement;

		console.log(trigger, content);
		

		if (!trigger || !content) return;

		computePosition(trigger, content, {
			placement,
			middleware: [flip(), shift({ padding: 16 }), offset(8)]
		}).then(({ x, y }) => {
			Object.assign(content.style, {
				left: `${x}px`,
				top: `${y}px`,
				display: 'block'
			});
		});
	}

	popoverState.subscribe(async (state) => {
		if (state) {
			await tick();
			compute();
			if (onOpen) onOpen();
		} else {
			if (onClose) onClose();
		}
	});

	afterUpdate(() => {
		if (isOpen === $popoverState) return;
		$popoverState = isOpen;
	});
</script>

<div>
	<slot />
</div>

<style>
	div {
		position: relative;
	}
</style>
