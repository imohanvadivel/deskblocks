<script lang="ts">
	import { FormLabel } from '$lib/index.js';
	import type { Writable } from 'svelte/store';
	import { draw } from 'svelte/transition';
	import { quadInOut } from 'svelte/easing';
	import { getContext, onMount } from 'svelte';
	export let checked: boolean = false;
	export let disabled: boolean = false;
	export let required: boolean = false;
	export let value: string = '';
	export let name: string = '';
	export let id = 'db-' + crypto.randomUUID();
	export { className as class };
	let className = '';

	type CheckboxGroupStore = Writable<{
		group: string[];
		name: string | undefined;
	}>;
	const groupStore = getContext('checkbox-group') as CheckboxGroupStore;

	onMount(() => {
		if ($groupStore) checked = $groupStore.group.includes(value);
		if (groupStore && $groupStore.name) name = $groupStore.name;
	});
</script>

<div class="checkbox {className}" class:disabled class:checked class:unchecked={!checked}>
	<div class="icon">
		<input
			type="checkbox"
			bind:checked
			{value}
			{name}
			{disabled}
			{id}
			{required}
			on:change
			on:click
			on:mouseover
			on:mouseenter
			on:mouseleave
			on:focus
			on:blur
		/>

		<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				id="base"
				d="M15.5 9V14.5C15.5 15.6046 14.6046 16.5 13.5 16.5H2.5C1.39543 16.5 0.5 15.6046 0.5 14.5V3.5C0.5 2.39543 1.39543 1.5 2.5 1.5H11"
				stroke="var(--db-color-icon-tertiary)"
			/>

			{#if !checked}
				<path
					transition:draw={{ duration: 200, easing: quadInOut }}
					id="top-offset"
					d="M11 1.5H13.5C14.6046 1.5 15.5 2.39543 15.5 3.5V9"
					stroke="var(--db-color-icon-tertiary)"
				/>
			{/if}

			{#if checked}
				<path
					transition:draw={{ duration: 200, easing: quadInOut }}
					id="tick"
					d="M4 7L8 11.5L17.5 1.5"
					stroke="var(--db-color-icon-tertiary)"
				/>
			{/if}
		</svg>
	</div>

	{#if $$slots.default}
		<FormLabel {disabled} for={id}>
			<slot />
		</FormLabel>
	{/if}
</div>

<style>
	.checkbox {
		display: flex;
		align-items: center;
		height: var(--db-size-medium);
		cursor: pointer;
	}

	.icon {
		cursor: pointer;
		position: relative;
		margin-inline-end: var(--db-size-xxsmall);
		width: var(--db-size-xsmall);
		height: var(--db-size-xsmall);
		display: flex;
		align-items: center;
	}

	input {
		position: absolute;
		opacity: 0;
		width: 100%;
		height: 100%;
		cursor: pointer;
	}

	svg {
		--checkbox-dimension: calc(var(--db-size-xsmall) + 0.125rem);
		width: var(--checkbox-dimension);
		height: var(--checkbox-dimension);
		pointer-events: none;
	}

	.checked path {
		stroke: var(--db-color-icon-brand);
	}

	.disabled path {
		stroke: var(--db-color-icon-disabled);
	}

	.checked.disabled path {
		stroke: var(--db-color-icon-brand-disabled);
	}
</style>
