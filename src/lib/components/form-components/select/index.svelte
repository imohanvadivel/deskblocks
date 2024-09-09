<script lang="ts">
	export let value: string | number | undefined = undefined;
	export let placeholder: string | undefined = undefined;
	export let disabled: boolean = false;
	export let invalid: boolean = false;
	export let required: boolean = false;
	export let id: string | undefined = undefined;

	export { className as class };
	let className = '';

	let isFocused = false;
</script>

<div class="{className} select-cnt" class:disabled class:active={isFocused} class:invalid>
	{#if $$slots.left}
		<div class="left-slot">
			<slot name="left" />
		</div>
	{/if}

	<div class="wrapper">
		<select
			bind:value
			{id}
			{required}
			{disabled}
			on:focus={() => (isFocused = true)}
			on:blur={() => (isFocused = false)}
			{placeholder}
			class:left-icon={$$slots.left}
			class:right-icon={$$slots.right}
			on:change
			on:input
			on:focus
			on:blur
		>
			{#if placeholder}
				<option disabled selected> {placeholder} </option>
			{/if}
			<slot />
		</select>
	</div>
	{#if $$slots.right}
		<div class="right-slot">
			<slot name="right" />
		</div>
	{/if}
</div>

<style>
	select {
		border: none;
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		color: var(--db-color-text);
		font-family: var(--db-fontstack);
		font-size: var(--db-fontsize-medium);
		padding: 0.5rem 0 0.25rem 0;
		background-color: var(--db-color-bg);
		outline: none;
	}
	.wrapper {
		position: relative;
		width: 100%;
		height: calc(2rem - 1px);
	}

	select option:disabled {
		color: var(--db-color-text-disabled);
	}

	.select-cnt {
		display: flex;
		flex-direction: row;
		align-items: center;
		column-gap: 0.25rem;
		width: 100%;
		height: 2rem;
		position: relative;
		border-bottom: 0.0625rem solid var(--db-color-border);
	}
	.select-cnt:hover:not(.disabled) {
		border-color: var(--db-color-border-hover);
	}

	select:disabled {
		color: var(--db-color-text-disabled);
		cursor: not-allowed;
	}

	.select-cnt.invalid {
		border-color: var(--db-color-border-danger-strong);
	}

	.select-cnt.active:not(.invalid) {
		border-color: var(--db-color-border-brand-strong);
	}

	.left-slot,
	.right-slot {
		margin-bottom: -0.5rem;
	}
</style>
