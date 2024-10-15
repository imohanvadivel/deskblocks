<script lang="ts">
	import { afterUpdate, getContext, onMount } from 'svelte';
	import type { PopoverContext, PopoverState } from '$lib/types.js';

	let triggerEl: HTMLDivElement;
	let ctx = getContext('popover') as PopoverContext;
	let isOpen = getContext('popoverState') as PopoverState;

	onMount(() => (ctx.trigger = triggerEl));

  function handleClick(){
    $isOpen = true;
  }
</script>

<div
  bind:this={triggerEl}
  style="display: contents;"
  on:click={handleClick}
  on:keydown={(e) => e.key === 'Enter' && handleClick()}
  role="button"
  tabindex="0"
>
	<slot />
</div>
