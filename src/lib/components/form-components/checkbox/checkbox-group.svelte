<script lang="ts">
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	export let name: string | undefined = undefined;
	export let group: string[] | undefined = undefined;
	export let inline = false;
	export let rowGap: string | undefined = undefined;
	export let columnGap: string | undefined = undefined;
	export { className as class };
	let className = '';

	if (group) {
		setContext('checkbox-group', writable({ group, name }));
	}

	function onChange({ target }: Event) {
		const { value, checked } = target as HTMLInputElement;
		if (checked) {
			group = [...group!, value];
		} else {
			group = group!.filter((v) => v !== value);
		}
	}
</script>

<fieldset
	class={className}
	class:inline
	on:change={onChange}
	on:change
	on:mouseover
	on:mouseenter
	on:mouseleave
	on:focus
	on:blur
	style:--checkbox-row-gap={rowGap || '0.25rem'}
	style:--checkbox-column-gap={columnGap || '1rem'}
>
	<slot />
</fieldset>

<style>
	fieldset {
		border: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		row-gap: var(--checkbox-row-gap, 0.25rem);
	}

	.inline {
		flex-direction: row;
		column-gap: var(--checkbox-column-gap, 1rem);
	}
</style>
