<script lang="ts">
	export let checked: boolean = false;
	export let disabled: boolean = false;
	export let value: string = '';
	export let required: boolean = false;
	export let size: 'small' | 'large' = 'small';
	export let id = 'db-' + crypto.randomUUID();
	export { className as class };
	let className = '';
</script>

<div class="switch size-{size} {className}" class:disabled class:checked>
	<input
		type="checkbox"
		bind:checked
		{value}
		{disabled}
		{id}
		{required}
		on:click
		on:mouseover
		on:mouseenter
		on:mouseleave
		on:change
		on:keyup
		on:focus
		on:blur
	/>
</div>

<style>
	input {
		opacity: 0;
		width: 100%;
		height: 100%;
		cursor: pointer;
	}

	input:disabled {
		cursor: not-allowed;
	}

	.switch {
		background-color: var(--db-color-bg-switch-inactive);
		position: relative;
		border-radius: 1rem;
	}

	.switch:hover {
		background-color: var(--db-color-bg-switch-inactive-hover);
	}

	.switch.checked {
		background-color: var(--db-color-bg-switch-active);
	}

	.switch.checked:hover {
		background-color: var(--db-color-bg-switch-active-hover);
	}

	.switch.disabled {
		background-color: var(--db-color-bg-switch-active-disabled);
	}

	.switch.checked.disabled {
		background-color: var(--db-color-bg-switch-inactive-disabled);
	}

	.switch::after {
		content: '';
		position: absolute;
		top: 0.125rem;
		left: 0.125rem;
		width: 0.5rem;
		height: 0.5rem;
		background-color: white;
		border-radius: 50%;
		transition: left 100ms ease-in;
		pointer-events: none;
	}

	.switch.checked::after {
		left: calc(100% - 0.625rem);
	}

	.size-small {
		width: var(--db-size-medium);
		height: calc(var(--db-size-xsmall) - 0.25rem);
		margin: 0.125rem 0;
	}

	.size-large {
		width: var(--db-size-large);
		height: calc(var(--db-size-medium) - 0.375rem);
		margin: 0.1875rem 0;
	}

	.switch.size-large::after {
		width: 0.875rem;
		height: 0.875rem;
		left: 0.125rem;
	}
	.switch.size-large.checked::after {
		left: calc(100% - 1rem);
	}
</style>
