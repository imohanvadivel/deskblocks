import type { Writable } from 'svelte/store';

export type PopoverEvent = (() => void) | undefined;
export type PopoverPlacement =
	| 'top'
	| 'right'
	| 'bottom'
	| 'left'
	| 'top-start'
	| 'right-start'
	| 'bottom-start'
	| 'left-start'
	| 'top-end'
	| 'right-end'
	| 'bottom-end'
	| 'left-end';

export type PopoverContext = {
	trigger: HTMLElement | null;
	content: HTMLElement | null;
	// arrow: HTMLElement | null;
};

export type PopoverState = Writable<boolean>;

export type TooltipOption = {
	content: string;
	placement?: PopoverPlacement;
	trigger?: 'hover' | 'click';
	delay?: number;
	offset?: number;
};

export type SelectOptionType<T> = {
	label: string | number;
	value: T;
};
