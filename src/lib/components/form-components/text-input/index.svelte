<script lang="ts">
	import { FormHelpMsg } from "../form-helper-text/index.js";

	export let id: string | undefined = undefined;
	export let value: string | undefined = undefined;
	export let placeholder: string | undefined = undefined;
	export let minlength: number | undefined = undefined;
	export let maxlength: number | undefined = undefined;
	export let pattern: string | undefined = undefined;
	export let name: string | undefined = undefined;
	export let spellcheck: boolean = false;
	export let disabled: boolean = false;
	export let invalid: boolean = false;
	export let required: boolean = false;
	export let readonly: boolean = false;
	export { className as class };
	let className = '';

	let isFocused = false;

	function handleValidity(event: Event) {
		invalid = !(event.target as HTMLInputElement).checkValidity();
	}
</script>

<div class="outer-cnt {className}">
	<div class="input-field" class:active={isFocused} class:invalid class:readonly class:disabled>
		{#if $$slots.left}
			<div class="left-slot">
				<slot name="left" />
			</div>
		{/if}

		<input
			type="text"
			bind:value
			on:focus={() => (isFocused = true)}
			on:blur={() => (isFocused = false)}
			on:change={handleValidity}
			{id}
			{name}
			{placeholder}
			{required}
			{disabled}
			{readonly}
			{minlength}
			{maxlength}
			{spellcheck}
			{pattern}
			on:change
			on:input
			on:click
			on:mouseover
			on:mouseenter
			on:mouseleave
			on:keydown
			on:keyup
			on:focus
			on:blur
			on:paste
		/>

		{#if $$slots.right}
			<div class="right-slot">
				<slot name="right" />
			</div>
		{/if}
	</div>

	{#if $$slots['help-msg']}
		<FormHelpMsg><slot name="help-msg" /></FormHelpMsg>
	{/if}
	{#if invalid && $$slots['error-msg']}
		<FormHelpMsg invalid><slot name="error-msg" /></FormHelpMsg>
	{/if}
</div>

<style>
	.input-field {
		display: flex;
		flex-direction: row;
		align-items: center;
		column-gap: 0.25rem;
		width: 100%;
		position: relative;
		border-bottom: 0.0625rem solid var(--db-color-border);
	}
	.input-field:hover:not(.disabled):not(.readonly) {
		border-color: var(--db-color-border-hover);
	}

	input {
		border: none;
		outline: none;
		width: 100%;
		height: 100%;
		background-color: var(--db-color-bg);
		color: var(--db-color-text);
		font-family: var(--db-fontstack);
		font-size: var(--db-fontsize-medium);
		padding: 0.5rem 0 0.25rem 0;
	}

	input:disabled {
		color: var(--db-color-text-disabled);
		cursor: not-allowed;
	}

	.input-field.active:not(.readonly):not(.invalid) {
		border-color: var(--db-color-border-brand-strong);
	}

	.input-field.invalid {
		border-color: var(--db-color-border-danger-strong);
	}
	.left-slot,
	.right-slot {
		margin-bottom: -0.5rem;
	}
	.outer-cnt {
		display: flex;
		flex-direction: column;
		width: 100%;
		row-gap: 0.5rem;
	}
</style>
