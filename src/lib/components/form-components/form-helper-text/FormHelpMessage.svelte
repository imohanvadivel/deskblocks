<script lang="ts">
	import { Text } from '$lib/index.js';
	export let invalid = false;
	export let disabled = false;
</script>

<Text type={invalid ? 'danger' : 'secondary'} {disabled} size="small"><slot /></Text>
