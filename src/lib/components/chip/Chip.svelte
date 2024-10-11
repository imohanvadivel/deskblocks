<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let disabled = false;
	export let dismissible = false;
	export { className as class };
	let className = '';

	function handleDismiss() {
		const dispatch = createEventDispatcher();
		dispatch('dismiss');
	}
</script>

<div class="{className} chip" class:has-icon={$$slots.icon} class:disabled>
	<!-- Left Icon -->
	{#if $$slots.icon}
		<span class="icon-cnt"> <slot name="icon" /> </span>
	{/if}

	<slot />

	<!-- Dismissible part -->
	{#if dismissible}
		<button class="close" on:click={handleDismiss}>
			<span aria-hidden="true">&times;</span>
		</button>
	{/if}
</div>

<style>
	.chip {
		font-family: var(--db-fontstack);
		font-size: var(--db-fontsize-medium);
		color: var(--db-color-text);
		background-color: var(--db-color-bg-chip);
		height: var(--db-size-medium);
		display: flex;
		align-items: center;
		padding: 0 var(--db-size-xxsmall);
		border-radius: 1rem;
		user-select: none;
		position: relative;
		overflow: hidden;
		--icon-size: calc(var(--db-size-medium) - 0.125rem);
	}
	.chip:hover {
		background-color: var(--db-color-bg-chip-hover);
	}

	.chip.disabled,
	.chip.disabled:hover {
		background-color: var(--db-color-chip-disabled);
		color: var(--db-color-text-disabled);
		cursor: not-allowed;
	}
	.chip.disabled :global(.icon-cnt .icon) {
		color: var(--db-color-text-disabled);
		fill: var(--db-color-icon-disabled);
	}

	.close {
		background-color: var(--db-color-bg-danger);
		color: var(--db-color-text-ondanger);
		border: none;
		outline: none;
		cursor: pointer;
		position: absolute;
		right: 0;
		height: 100%;
		z-index: 1;
		padding: 0 var(--db-size-xxsmall);
		display: none;
	}

	.close:hover {
		background-color: var(--db-color-bg-danger-hover);
	}

	.close span {
		font-size: var(--db-fontsize-large);
	}

	.chip:hover .close {
		display: block;
	}

	.icon-cnt {
		border: 1px solid var(--db-color-border);
		border-radius: 50%;
		margin-right: var(--db-size-xxxsmall);
		width: var(--icon-size);
		height: var(--icon-size);
		display: flex;
		align-items: center;
	}
	.has-icon {
		padding-left: 0.0625rem;
	}
</style>
