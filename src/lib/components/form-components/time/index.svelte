<script lang="ts">
	import { FormHelpMsg } from "../form-helper-text/index.js";

	export let id: string | undefined = undefined;
	export let value: string | undefined = undefined;
	export let min: string | undefined = undefined;
	export let max: string | undefined = undefined;
	export let step: string | undefined = undefined;
	export let readonly: boolean = false;
	export let name: string | undefined = undefined;
	export let disabled: boolean = false;
	export let invalid: boolean = false;
	export let required: boolean = false;
	export { className as class };
	let className = '';

	let isFocused = false;

	function handleValidity(event: Event) {
		invalid = !(event.target as HTMLInputElement).checkValidity();
	}
</script>

<div class="outer-cnt {className}">
	<div
		class="time-input"
		class:active={isFocused}
		class:invalid
		class:readonly
		class:disabled
	>
		{#if $$slots['left-icon']}
			<div class="left-slot">
				<slot name="left-icon" />
			</div>
		{/if}

		<input
			type="time"
			bind:value
			on:focus={() => (isFocused = true)}
			on:blur={() => (isFocused = false)}
			on:change={handleValidity}
			{id}
			{name}
			{required}
			{disabled}
			{readonly}
			{min}
			{max}
			{step}
		/>
	</div>

	{#if $$slots['help-msg']}
		<FormHelpMsg><slot name="help-msg" /></FormHelpMsg>
	{/if}
	{#if invalid && $$slots['error-msg']}
		<FormHelpMsg invalid><slot name="error-msg" /></FormHelpMsg>
	{/if}
</div>

<style>
	.time-input {
		display: flex;
		flex-direction: row;
		align-items: center;
		column-gap: 0.25rem;
		width: 100%;
		position: relative;
		border-bottom: 0.0625rem solid var(--db-color-border);
	}

	.time-input:hover:not(.disabled):not(.readonly) {
		border-color: var(--db-color-border-hover);
	}

	.time-input.active:not(.readonly):not(.invalid) {
		border-color: var(--db-color-border-brand-strong);
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
		padding: 0.5rem 0 0.125rem 0;
	}

	input:disabled {
		color: var(--db-color-text-disabled);
		cursor: not-allowed;
	}

	.time-input.invalid {
		border-color: var(--db-color-border-danger-strong);
	}

	.left-slot {
		margin-bottom: -0.5rem;
	}

	.outer-cnt {
		display: flex;
		flex-direction: column;
		width: 100%;
		row-gap: 0.5rem;
	}
</style>
