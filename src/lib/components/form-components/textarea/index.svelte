<script lang="ts">
	export let id: string | undefined = undefined;
	export let value: string | undefined = undefined;
	export let placeholder: string | undefined = undefined;
	export let resize: 'horizontal' | 'vertical' | 'none' | 'both' = 'none';
	export let minlength: number | undefined = undefined;
	export let maxlength: number | undefined = undefined;
	export let rows: number | undefined = 2;
	export let name: string | undefined = undefined;
	export let spellcheck: boolean = false;
	export let disabled: boolean = false;
	export let required: boolean = false;
	export let readonly: boolean = false;
	export { className as class };
	let className = '';

	let isFocused = false;
</script>

<textarea
	class="{className} textarea"
	class:active={isFocused}
	class:readonly
	class:disabled
	style="resize: {resize};"
	bind:value
	on:focus={() => (isFocused = true)}
	on:blur={() => (isFocused = false)}
	{id}
	{name}
	{placeholder}
	{required}
	{disabled}
	{readonly}
	{minlength}
	{maxlength}
	{rows}
	{spellcheck}
	on:click
	on:mouseover
	on:mouseenter
	on:mouseleave
	on:change
	on:input
	on:keydown
	on:keyup
	on:focus
	on:blur
	on:paste
/>

<style>
	textarea {
		width: 100%;
		outline: none;
		border: unset;
		border-bottom: 0.0625rem solid var(--db-color-border);
		background-color: var(--db-color-bg);
		color: var(--db-color-text);
		font-family: var(--db-fontstack);
		font-size: var(--db-fontsize-medium);
	}

	textarea:disabled {
		color: var(--db-color-text-disabled);
		cursor: not-allowed;
	}

	textarea:hover:not(.disabled):not(.readonly):not(.active) {
		border-color: var(--db-color-border-hover);
	}

	textarea.active:not(.readonly) {
		border-color: var(--db-color-border-brand-strong);
	}
</style>
