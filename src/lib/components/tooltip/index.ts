import { computePosition, offset, shift, flip } from '@floating-ui/dom';
import type { TooltipOption } from '$lib/types.js';

export function tooltip(node: HTMLElement, options: TooltipOption) {
	let placement = options.placement || 'bottom';
	let offsetSpace = options.offset || 8;
	let trigger = options.trigger || 'hover';
	let delay = options.delay || 200;
	let content = options.content;
	let tooltipEl: HTMLElement;
	let tooltipContent: HTMLElement;
	// let tooltipArrow: HTMLElement;

	tooltipEl = document.querySelector('#dlib-tooltip') as HTMLElement;

	// Check if tooltip already exists, if not create one
	if (!tooltipEl) {
		tooltipEl = document.createElement('div');
		tooltipEl.id = 'dlib-tooltip';
		tooltipContent = document.createElement('div');
		tooltipContent.id = 'tooltip-content';
		tooltipEl.appendChild(tooltipContent);
		document.body.appendChild(tooltipEl);

		// Styles
		tooltipEl.style.display = 'contents';
		tooltipEl.style.zIndex = '1000';
		tooltipContent.style.display = 'none';
		tooltipContent.style.position = 'absolute';
		tooltipContent.style.padding = '0.25rem 0.5rem';
		tooltipContent.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
		tooltipContent.style.color = 'white';
		tooltipContent.style.borderRadius = '0.3rem';
		tooltipContent.style.maxWidth = '20rem';
		tooltipContent.style.fontSize = '14px';
		tooltipEl = document.querySelector('#dlib-tooltip') as HTMLElement;
	}

	tooltipContent = tooltipEl.querySelector('#tooltip-content') as HTMLElement;
	// tooltipArrow = tooltipEl.querySelector("#tooltip-arrow") as HTMLElement;
	compute();
	// }

	// Computes the position of the tooltip
	function compute() {
		if (!node || !tooltipContent) return;

		computePosition(node, tooltipContent, {
			placement,
			middleware: [offset(offsetSpace), shift({ padding: 16 }), flip()]
		}).then(({ x, y }) => {
			// Handle the content position
			Object.assign(tooltipContent.style, {
				top: `${y}px`,
				left: `${x}px`
			});

			/* TODO: Handle the arrow position  */

			// const { x: arrowX, y: arrowY } = middlewareData.arrow;

			// const staticSide = {
			//     top: "bottom",
			//     bottom: "top",
			//     left: "right",
			//     right: "left",
			// }[placement.split("-")[0]];

			// Object.assign(tooltipArrow.style, {
			//     left: arrowX !== null ? `${arrowX}px` : "",
			//     top: arrowY !== null ? `${arrowY}px` : "",
			//     right: "",
			//     bottom: "",
			// });
		});
	}

	// Add event listener based on trigger
	function addListener() {
		if (trigger === 'hover') {
			handleHover();
		} else {
			handleClick();
		}

		// Handles hover trigger
		function handleHover() {
			node.addEventListener('mouseenter', showTooltip);
			node.addEventListener('mouseleave', hideTooltip);
			node.addEventListener('focus', showTooltip);
			node.addEventListener('blur', hideTooltip);
		}

		// Handles click trigger
		function handleClick() {
			node.addEventListener('click', showTooltip);
			node.addEventListener('blur', hideTooltip);
		}
	}

	// Removes event listener based on trigger
	function removeListener() {
		if (trigger === 'hover') {
			node.removeEventListener('mouseenter', showTooltip);
			node.removeEventListener('mouseleave', hideTooltip);
			node.removeEventListener('focus', showTooltip);
			node.removeEventListener('blur', hideTooltip);
		} else {
			node.removeEventListener('click', showTooltip);
			node.removeEventListener('blur', hideTooltip);
		}
	}

	// Show the tooltip
	function showTooltip() {
		setTimeout(() => {
			tooltipContent.innerHTML = content; // updating the content
			compute(); // recompute the position
			if (tooltipContent) tooltipContent.style.display = 'block';
		}, delay);
	}

	// Hide the tooltip
	function hideTooltip() {
		if (tooltipContent) tooltipContent.style.display = 'none';
	}

	addListener();

	return {
		update(newOptions: TooltipOption) {
			hideTooltip();
			if (newOptions.placement) placement = newOptions.placement;
			if (newOptions.offset) offsetSpace = newOptions.offset;
			if (newOptions.trigger) trigger = newOptions.trigger;
			if (newOptions.delay) delay = newOptions.delay;
			if (newOptions.content) content = newOptions.content;
			compute();
		},

		destroy() {
			hideTooltip();
			removeListener();
		}
	};
}
