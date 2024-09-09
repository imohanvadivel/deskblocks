<script lang="ts">
	import { onMount } from 'svelte';

	export let src: string | undefined = undefined;
	export let name: string | undefined = undefined;
	export let size: 'small' | 'medium' | 'large' | number = 'medium';
	export { className as class };
	let className = '';

	const sizes = {
		small: '1.5rem',
		medium: '2rem',
		large: '2.5rem'
	};
	$: imgSize = typeof size === 'number' ? `${size / 16}rem` : sizes[size];

	function getInitial(name: string | undefined) {
		if (!name) return '';

		let initialAry = name.split(' ');
		let initial: string;

		if (initialAry.length > 1) {
			initial = initialAry[0].charAt(0) + initialAry[1].charAt(0);
		} else {
			initial = initialAry[0].substring(0, 2);
		}

		return initial.toUpperCase();
	}

	let isImgLoaded = false;
	$: initial = getInitial(name);

	/* on:error doesn't emit from svelte, as a workaround svelte action has been used
	 * https://github.com/sveltejs/kit/issues/8271 */

	onMount(() => {
		const img = new Image();
		img.src = src || '';
		img.onload = () => {
			isImgLoaded = true;
		};
	});
</script>

{#key [isImgLoaded, src]}
	<div
		class="avatar {className}"
		style="width: {imgSize}; height: {imgSize}; --img-size: {imgSize};"
		class:img-loaded={isImgLoaded}
		class:img-not-loaded={!isImgLoaded}
	>
		{#if isImgLoaded}
			<img {src} alt={name} />
		{:else if initial}
			<span>{initial}</span>
		{:else}
			<svg fill="var(--db-color-icon-disabled)" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
				<path
					fill-rule="evenodd"
					d="M8 9a3 3 0 100-6 3 3 0 000 6zm-7 8.5a7 7 0 1114 0H3z"
					clip-rule="evenodd"
				></path>
			</svg>
		{/if}
	</div>
{/key}

<style>
	.avatar {
		border-radius: 50%;
		border: 1px solid var(--db-color-border);
		background-color: var(--db-color-bg);
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		position: relative;
	}
	span {
		font-family: var(--db-fontstack);
		font-weight: var(--font-weight-regular);
		font-size: calc(var(--img-size) / 2.8);
		color: var(--db-color-text);
		user-select: none;
		letter-spacing: 0.05em;
	}
	.avatar img {
		object-fit: cover;
		width: 100%;
		height: 100%;
	}
	svg {
		width: 100%;
		height: 100%;
	}
</style>
