<script lang="ts">
	export let size: 'small' | 'medium' | 'large' | number = 'small';
	export let onbrand = false;
	export { className as class };
	let className = '';

	const sizes = {
		small: `1.5rem`,
		medium: `2rem`,
		large: `2.5rem`
	};

	$: iconSize = typeof size === 'number' ? `${size / 16}rem` : sizes[size];
	$: svgSize = `calc(${iconSize} - 0.5rem)`;

	let brandColor = `var(--db-color-border-brand-strong)`;
	let baseColor = `var(--db-color-border-secondary)`;

	if (onbrand) {
		brandColor = `var(--db-color-static-white)`;
		baseColor = `var(--db-color-static-white)`;
	}
</script>

{#key svgSize}
	<div class={className} style="width: {iconSize}; height: {iconSize};">
		<svg
			class:onbrand
			style="width: {svgSize}; height: {svgSize};"
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				class="base-path"
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M8 2.5C4.96243 2.5 2.5 4.96243 2.5 8C2.5 11.0376 4.96243 13.5 8 13.5C11.0376 13.5 13.5 11.0376 13.5 8C13.5 4.96243 11.0376 2.5 8 2.5ZM1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8Z"
				fill={baseColor}
			/>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M7.5 2C7.5 1.72386 7.72386 1.5 8 1.5C8.85359 1.5 9.69883 1.66813 10.4874 1.99478C11.2761 2.32144 11.9926 2.80023 12.5962 3.40381C13.1998 4.00739 13.6786 4.72394 14.0052 5.51256C14.3319 6.30117 14.5 7.14641 14.5 8C14.5 8.27614 14.2761 8.5 14 8.5C13.7239 8.5 13.5 8.27614 13.5 8C13.5 7.27773 13.3577 6.56253 13.0813 5.89524C12.8049 5.22795 12.3998 4.62164 11.8891 4.11091C11.3784 3.60019 10.772 3.19506 10.1048 2.91866C9.43747 2.64226 8.72227 2.5 8 2.5C7.72386 2.5 7.5 2.27614 7.5 2Z"
				fill={brandColor}
			/>
		</svg>
	</div>
{/key}

<style>
	@keyframes spin {
		100% {
			transform: rotate(360deg);
		}
	}

	svg {
		display: inline-block;
		animation: spin 1s linear infinite;
	}

	svg.onbrand .base-path {
		opacity: 0.3;
	}
</style>
