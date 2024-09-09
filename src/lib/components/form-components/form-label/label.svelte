<script lang="ts">
	export let required: boolean = false;
	export let disabled: boolean = false;

	export { _for as for };
	let _for = '';

	export { className as class };
	let className = '';
</script>

<label for={_for} class="{className} label" class:disabled aria-required={required ? true : false}>
	<slot />
	{#if required}
		<span class="required">*</span>
	{/if}
</label>

<style>
	label {
		font-family: var(--db-fontstack);
		font-size: var(--db-fontsize-medium);
		user-select: none;
		color: var(--db-color-text);
	}
	.disabled {
		color: var(--db-color-text-disabled);
	}
	.required {
		color: var(--db-color-text-danger);
	}
	.disabled .required {
		color: var(--db-color-text-danger-disabled);
	}
</style>
