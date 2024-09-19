<script lang="ts">
	import { FormLabel } from '../index.js';
	import { getContext, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	export let group: string | number | undefined = undefined;
	export let disabled: boolean = false;
	export let value: string = '';
	export let name = '';
	export let id = 'db-' + crypto.randomUUID();

	type RadioGroupStore = Writable<{ name: string; group: string | number | undefined; disabled: boolean }>;
	const groupStore = getContext('radio-group') as RadioGroupStore;

	onMount(() => {
		if (!name && groupStore && $groupStore.name) name = $groupStore.name;
		if (groupStore && $groupStore.disabled) disabled = true;
	});
</script>

<div class="radio" class:disabled>
	<div class="icon">
		{#if groupStore && $groupStore.group}
			<input type="radio" bind:group={$groupStore.group} {name} {value} {disabled} {id} on:change />
		{:else}
			<input type="radio" bind:group {name} {value} {disabled} {id} on:change />
		{/if}

		<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle id="base" cx="8" cy="8" r="7.5" stroke="var(--db-color-icon-tertiary)" />
			<circle
				style="transform-origin: 50% 50%; transition: scale 200ms ease-out;"
				id="dot"
				cx="8"
				cy="8"
				r="4"
				fill="var(--db-color-icon-tertiary)"
			/>
		</svg>
	</div>

	{#if $$slots.default}
		<FormLabel {disabled} for={id}>
			<slot />
		</FormLabel>
	{/if}
</div>

<style>
	.radio {
		display: flex;
		align-items: center;
		height: var(--db-size-medium);
		cursor: pointer;
	}

	.icon {
		cursor: pointer;
		position: relative;
		width: var(--db-size-xsmall);
		height: var(--db-size-xsmall);
		margin-inline-end: var(--db-size-xxsmall);
	}

	input {
		position: absolute;
		opacity: 0;
		width: 100%;
		height: 100%;
	}

	svg {
		transform-origin: 50% 50%;
	}

	input:checked + svg #base {
		stroke: var(--db-color-icon-brand);
	}

	input:checked + svg #dot {
		fill: var(--db-color-icon-brand);
		scale: 1;
	}

	input:not(:checked) + svg #dot {
		scale: 0;
	}

	.disabled #base {
		stroke: var(--db-color-icon-disabled);
	}
	
	.disabled #dot {
		fill: var(--db-color-icon-disabled);
	}

	.disabled input:checked + svg #base {
		stroke: var(--db-color-icon-brand-disabled);
	}

	.disabled input:checked + svg #dot {
		fill: var(--db-color-icon-brand-disabled);
	}
</style>
