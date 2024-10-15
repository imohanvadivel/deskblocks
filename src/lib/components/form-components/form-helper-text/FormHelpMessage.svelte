<script lang="ts">
	export let invalid = false;
	export let disabled = false;
</script>

<span class:invalid class:disabled class="msg-cnt">
	<slot />
</span>

<style>
	.msg-cnt {
		font-family: var(--db-fontstack);
		font-size: var(--db-fontsize-small);
		font-weight: var(--db-fontweight-regular);
		line-height: var(--db-lineHeight);
		letter-spacing: var(--db-letterSpacing-small);
		color: var(--db-color-text-secondary);
	}

	.invalid {
		color: var(--db-color-text-danger);
	}

	.disabled {
		color: var(--db-color-text-disabled);
	}
</style>
