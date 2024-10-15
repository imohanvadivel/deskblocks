<script lang="ts">
	import { createEventDispatcher, tick } from 'svelte';
	import { Chip, FormHelpMsg, Icon } from '../../../index.js';
	import { IconClose, IconArrowFillDown } from '../../../icons/index.js';
	import Wiggle from './Wiggle.svelte';

	// single CSS string or an object with keys 'option' and 'selected', each a string,
	// which only apply to the dropdown list and list of selected options, respectively
	type OptionStyle = string | { option: string; selected: string };

	type OptionObject = {
		label: string | number; // user-displayed text
		value?: unknown; // associated value, can be anything incl. objects (defaults to label if undefined)
		disabled?: boolean; // make this option unselectable
		preselected?: boolean; // make this option selected on page load (before any user interaction)
		[key: string]: unknown; // allow any other keys users might want
	};

	type SelectOption = string | number | OptionObject;

	type DispatchEvents<T = SelectOption> = {
		add: { option: T };
		create: { option: T };
		remove: { option: T };
		removeAll: { options: T[] };
		change: {
			option?: T;
			options?: T[];
			type: 'add' | 'remove' | 'removeAll';
		};
		open: { event: Event };
		close: { event: Event };
	};

	type MultiSelectEvents = {
		[key in keyof DispatchEvents]: CustomEvent<DispatchEvents[key]>;
	} & {
		blur: FocusEvent;
		click: MouseEvent;
		focus: FocusEvent;
		keydown: KeyboardEvent;
		keyup: KeyboardEvent;
		mouseenter: MouseEvent;
		mouseleave: MouseEvent;
		touchcancel: TouchEvent;
		touchend: TouchEvent;
		touchmove: TouchEvent;
		touchstart: TouchEvent;
	};

	let defaultDisabledTitle: string = `This option is disabled`;
	let disabledInputTitle: string = `This input is disabled`;
	let duplicateOptionMsg: string = `This option is already selected`;
	let removeAllTitle: string = `Remove all`;
	let noMatchingOptionsMsg: string = `No matching options`;
	let maxSelectMsg: ((current: number, max: number) => string) | null = (
		current: number,
		max: number
	) => (max > 1 ? `${current}/${max}` : ``);

	let maxSelectMsgClass: string = ``;

	let closeDropdownOnSelect: boolean | 'desktop' = `desktop`;
	let highlightMatches: boolean = true;
	let outerDiv: HTMLDivElement | null = null;
	let autocomplete: string = `off`;
	let autoScroll: boolean = true;
	let breakpoint: number = 800;

	export let createOptionMsg: string | null = `Create this option...`;
	export let activeIndex: number | null = null;
	export let activeOption: SelectOption | null = null;
	export let allowUserOptions: boolean | 'append' = false;
	export let allowEmpty: boolean = false;
	export let disabled: boolean = false;
	export let duplicates: boolean = false; // whether to allow duplicate options
	// takes two options and returns true if they are equal
	// case-insensitive equality comparison after string coercion and looks only at the `label` key of object options by default
	export let key: (opt: SelectOption) => unknown = (opt) => `${get_label(opt)}`.toLowerCase();
	export let filterFunc = (opt: SelectOption, searchText: string): boolean => {
		if (!searchText) return true;
		return `${get_label(opt)}`.toLowerCase().includes(searchText.toLowerCase());
	};
	export let form_input: HTMLInputElement | null = null;
	export let id: string | null = null;
	export let input: HTMLInputElement | null = null;
	export let invalid: boolean = false;
	export let matchingOptions: SelectOption[] = [];
	export let maxOptions: number | undefined = undefined;
	export let maxSelect: number | null = 1; // null means there is no upper limit for selected.length

	export let name: string | null = null;
	export let open: boolean = false;
	export let options: SelectOption[];
	export let parseLabelsAsHtml: boolean = false; // should not be combined with allowUserOptions!
	export let pattern: string | null = null;
	export let placeholder: string | null = null;
	export let minSelect: number | null = null; // null means there is no lower limit for selected.length
	export let required: boolean = false;
	export let resetFilterOnAdd: boolean = true;
	export let searchText: string = ``;
	export let selected: SelectOption[] =
		options
			?.filter((opt) => opt instanceof Object && opt?.preselected)
			.slice(0, maxSelect ?? undefined) ?? []; // don't allow more than maxSelect preselected options
	export let sortSelected: boolean | ((op1: SelectOption, op2: SelectOption) => number) = false;

	export let value: SelectOption | SelectOption[] | null = null;

	export { className as class };
	let className = '';

	const selected_to_value = (selected: SelectOption[]) => {
		value = maxSelect === 1 ? (selected[0] ?? null) : selected;
	};
	const value_to_selected = (value: SelectOption | SelectOption[] | null) => {
		if (maxSelect === 1) selected = value ? [value as SelectOption] : [];
		else selected = (value as SelectOption[]) ?? [];
	};

	// if maxSelect=1, value is the single item in selected (or null if selected is empty)
	$: selected_to_value(selected);
	$: value_to_selected(value);

	let wiggle = false; // controls wiggle animation when user tries to exceed maxSelect

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Events = MultiSelectEvents; // for type-safe event listening on this component

	// get the label key from an option object or the option itself if it's a string or number
	function get_label(opt: SelectOption) {
		if (opt instanceof Object) {
			if (opt.label === undefined) {
				console.error(
					`MultiSelect option ${JSON.stringify(opt)} is an object but has no label key`
				);
			}
			return opt.label;
		}
		return `${opt}`;
	}

	// this function is used extract CSS strings from a {selected, option} style object to be used in the style attribute of the option
	// if the style is a string, it will be returned as is
	function get_style(
		option: { style?: OptionStyle; [key: string]: unknown } | string | number,
		key: 'selected' | 'option' | null = null
	) {
		let css_str = ``;
		if (![`selected`, `option`, null].includes(key)) {
			console.error(`MultiSelect: Invalid key=${key} for get_style`);
		}
		if (typeof option == `object` && option.style) {
			if (typeof option.style == `string`) {
				css_str = option.style;
			}
			if (typeof option.style == `object`) {
				if (key && key in option.style) return option.style[key] ?? ``;
				else {
					console.error(`Invalid style object for option=${JSON.stringify(option)}`);
				}
			}
		}
		// ensure css_str ends with a semicolon
		if (css_str.trim() && !css_str.trim().endsWith(`;`)) css_str += `;`;
		return css_str;
	}

	if (!(options?.length > 0)) {
		if (allowUserOptions || disabled || allowEmpty) {
			options = []; // initializing as array avoids errors when component mounts
		} else {
			// error on empty options if user is not allowed to create custom options and loading is false
			// and component is not disabled and allowEmpty is false
			console.error(`MultiSelect received no options`);
		}
	}
	if (maxSelect !== null && maxSelect < 1) {
		console.error(`MultiSelect's maxSelect must be null or positive integer, got ${maxSelect}`);
	}
	if (!Array.isArray(selected)) {
		console.error(`MultiSelect's selected prop should always be an array, got ${selected}`);
	}
	if (maxSelect && typeof required === `number` && required > maxSelect) {
		console.error(
			`MultiSelect maxSelect=${maxSelect} < required=${required}, makes it impossible for users to submit a valid form`
		);
	}
	if (parseLabelsAsHtml && allowUserOptions) {
		console.warn(
			`Don't combine parseLabelsAsHtml and allowUserOptions. It's susceptible to XSS attacks!`
		);
	}
	if (allowUserOptions && !createOptionMsg && createOptionMsg !== null) {
		console.error(
			`MultiSelect has allowUserOptions=${allowUserOptions} but createOptionMsg=${createOptionMsg} is falsy. ` +
				`This prevents the "Add option" <span> from showing up, resulting in a confusing user experience.`
		);
	}
	if (maxOptions && (typeof maxOptions != `number` || maxOptions < 0 || maxOptions % 1 != 0)) {
		console.error(
			`MultiSelect's maxOptions must be undefined or a positive integer, got ${maxOptions}`
		);
	}

	const dispatch = createEventDispatcher<DispatchEvents<SelectOption>>();
	let option_msg_is_active: boolean = false; // controls active state of <li>{createOptionMsg}</li>
	let window_width: number;

	// options matching the current search text
	$: matchingOptions = options.filter(
		(opt) =>
			filterFunc(opt, searchText) &&
			// remove already selected options from dropdown list unless duplicate selections are allowed
			(!selected.map(key).includes(key(opt)) || duplicates)
	);

	// raise if matchingOptions[activeIndex] does not yield a value
	if (activeIndex !== null && !matchingOptions[activeIndex]) {
		throw `Run time error, activeIndex=${activeIndex} is out of bounds, matchingOptions.length=${matchingOptions.length}`;
	}
	// update activeOption when activeIndex changes
	$: activeOption = matchingOptions[activeIndex ?? -1] ?? null;

	// add an option to selected list
	function add(option: SelectOption, event: Event) {
		if (maxSelect && maxSelect > 1 && selected.length >= maxSelect) wiggle = true;
		if (!isNaN(Number(option)) && typeof selected.map(get_label)[0] === `number`) {
			option = Number(option) as SelectOption; // convert to number if possible
		}
		const is_duplicate = selected.map(key).includes(key(option));

		if (
			(maxSelect === null || maxSelect === 1 || selected.length < maxSelect) &&
			(duplicates || !is_duplicate)
		) {
			if (
				!options.some((opt) => key(opt) === key(option)) && // first check if we find option in the options list
				// this has the side-effect of not allowing the user to add the same
				// custom option twice in append mode
				[true, 'append'].includes(allowUserOptions) &&
				searchText.length > 0
			) {
				// user entered text but no options match, so if allowUserOptions = true | 'append', we create
				// a new option from the user-entered text
				if (typeof options[0] === `object`) {
					// if 1st option is an object, we create new option as object to keep type homogeneity
					option = { label: searchText } as SelectOption;
				} else {
					if ([`number`, `undefined`].includes(typeof options[0]) && !isNaN(Number(searchText))) {
						// create new option as number if it parses to a number and 1st option is also number or missing
						option = Number(searchText) as SelectOption;
					} else {
						option = searchText as unknown as SelectOption; // else create custom option as string
					}
					dispatch(`create`, { option });
				}
				if (allowUserOptions === `append`) options = [...options, option];
			}

			if (resetFilterOnAdd) searchText = ``; // reset search string on selection
			if ([``, undefined, null].includes(option as string)) {
				console.error(`MultiSelect: encountered falsy option ${option}`);
				return;
			}
			if (maxSelect === 1) {
				// for maxSelect = 1 we always replace current option with new one
				selected = [option];
			} else {
				selected = [...selected, option];
				if (sortSelected === true) {
					selected = selected.sort((op1: SelectOption, op2: SelectOption) => {
						const [label1, label2] = [get_label(op1), get_label(op2)];
						// coerce to string if labels are numbers
						return `${label1}`.localeCompare(`${label2}`);
					});
				} else if (typeof sortSelected === `function`) {
					selected = selected.sort(sortSelected);
				}
			}

			const reached_max_select = selected.length === maxSelect;

			const dropdown_should_close =
				closeDropdownOnSelect === true ||
				(closeDropdownOnSelect === `desktop` && window_width < breakpoint);

			if (reached_max_select || dropdown_should_close) {
				close_dropdown(event);
			} else if (!dropdown_should_close) {
				input?.focus();
			}
			dispatch(`add`, { option });
			dispatch(`change`, { option, type: `add` });

			invalid = false; // reset error status whenever new items are selected
			form_input?.setCustomValidity(``);
		}
	}

	// remove an option from selected list
	function remove(to_remove: SelectOption) {
		if (selected.length === 0) return;

		const idx = selected.findIndex((opt) => key(opt) === key(to_remove));

		let [option] = selected.splice(idx, 1); // remove option from selected list

		if (option === undefined && allowUserOptions) {
			// if option with label could not be found but allowUserOptions is truthy,
			// assume it was created by user and create corresponding option object
			// on the fly for use as event payload
			const other_ops_type = typeof options[0];
			option = (other_ops_type ? { label: to_remove } : to_remove) as SelectOption;
		}
		if (option === undefined) {
			return console.error(
				`Multiselect can't remove selected option ${JSON.stringify(to_remove)}, not found in selected list`
			);
		}

		selected = [...selected]; // trigger Svelte rerender

		invalid = false; // reset error status whenever items are removed
		form_input?.setCustomValidity(``);
		dispatch(`remove`, { option });
		dispatch(`change`, { option, type: `remove` });
	}

	function open_dropdown(event: Event) {
		if (disabled) return;
		open = true;
		if (!(event instanceof FocusEvent)) {
			// avoid double-focussing input when event that opened dropdown was already input FocusEvent
			input?.focus();
		}
		dispatch(`open`, { event });
	}

	function close_dropdown(event: Event) {
		open = false;
		input?.blur();
		activeIndex = null;
		dispatch(`close`, { event });
	}

	// handle all keyboard events this component receives
	async function handle_keydown(event: KeyboardEvent) {
		// on escape or tab out of input: close options dropdown and reset search text
		if (event.key === `Escape` || event.key === `Tab`) {
			close_dropdown(event);
			searchText = ``;
		}
		// on enter key: toggle active option and reset search text
		else if (event.key === `Enter`) {
			event.preventDefault(); // prevent enter key from triggering form submission

			if (activeOption) {
				selected.includes(activeOption) ? remove(activeOption) : add(activeOption, event);
				searchText = ``;
			} else if (allowUserOptions && searchText.length > 0) {
				// user entered text but no options match, so if allowUserOptions is truthy, we create new option
				add(searchText, event);
			}
			// no active option and no search text means the options dropdown is closed
			// in which case enter means open it
			else open_dropdown(event);
		}
		// on up/down arrow keys: update active option
		else if ([`ArrowDown`, `ArrowUp`].includes(event.key)) {
			// if no option is active yet, but there are matching options, make first one active
			if (activeIndex === null && matchingOptions.length > 0) {
				activeIndex = 0;
				return;
			} else if (allowUserOptions && !matchingOptions.length && searchText.length > 0) {
				// if allowUserOptions is truthy and user entered text but no options match, we make
				// <li>{addUserMsg}</li> active on keydown (or toggle it if already active)
				option_msg_is_active = !option_msg_is_active;
				return;
			} else if (activeIndex === null) {
				// if no option is active and no options are matching, do nothing
				return;
			}
			event.preventDefault();
			// if none of the above special cases apply, we make next/prev option
			// active with wrap around at both ends
			const increment = event.key === `ArrowUp` ? -1 : 1;

			activeIndex = (activeIndex + increment) % matchingOptions.length;
			// in JS % behaves like remainder operator, not real modulo, so negative numbers stay negative
			// need to do manual wrap around at 0
			if (activeIndex < 0) activeIndex = matchingOptions.length - 1;

			if (autoScroll) {
				await tick();
				const li = document.querySelector(`ul.options > li.active`);
				if (li) (li as any).scrollIntoViewIfNeeded?.();
			}
		}
		// on backspace key: remove last selected option
		else if (event.key === `Backspace` && selected.length > 0 && !searchText) {
			remove(selected.at(-1) as SelectOption);
		}
		// make first matching option active on any keypress (if none of the above special cases match)
		else if (matchingOptions.length > 0) {
			activeIndex = 0;
		}
	}

	function remove_all() {
		dispatch(`removeAll`, { options: selected });
		dispatch(`change`, { options: selected, type: `removeAll` });
		selected = [];
		searchText = ``;
	}

	$: is_selected = (label: string | number) => selected.map(get_label).includes(label);

	const if_enter_or_space = (handler: () => void) => (event: KeyboardEvent) => {
		if ([`Enter`, `Space`].includes(event.code)) {
			event.preventDefault();
			handler();
		}
	};

	function on_click_outside(event: MouseEvent | TouchEvent) {
		if (outerDiv && !outerDiv.contains(event.target as Node)) {
			close_dropdown(event);
		}
	}

	let ul_options: HTMLUListElement;

	// highlight text matching user-entered search text in available options
	function highlight_matching_options(event: Event) {
		if (!highlightMatches || typeof CSS == `undefined` || !CSS.highlights) return; // abort if CSS highlight API not supported

		// clear previous ranges from HighlightRegistry
		CSS.highlights.clear();

		// get input's search query
		const query = (event?.target as HTMLInputElement)?.value.trim().toLowerCase();
		if (!query) return;

		const tree_walker = document.createTreeWalker(ul_options, NodeFilter.SHOW_TEXT, {
			acceptNode: (node) => {
				// don't highlight text in the "no matching options" message
				if (node?.textContent === noMatchingOptionsMsg) return NodeFilter.FILTER_REJECT;
				return NodeFilter.FILTER_ACCEPT;
			}
		});
		const text_nodes: Node[] = [];
		let current_node = tree_walker.nextNode();
		while (current_node) {
			text_nodes.push(current_node);
			current_node = tree_walker.nextNode();
		}

		// iterate over all text nodes and find matches
		const ranges = text_nodes.map((el) => {
			const text = el.textContent?.toLowerCase();
			const indices = [];
			let start_pos = 0;
			while (text && start_pos < text.length) {
				const index = text.indexOf(query, start_pos);
				if (index === -1) break;
				indices.push(index);
				start_pos = index + query.length;
			}

			// create range object for each str found in the text node
			return indices.map((index) => {
				const range = new Range();
				range.setStart(el, index);
				range.setEnd(el, index + query.length);
				return range;
			});
		});

		// create Highlight object from ranges and add to registry
		CSS.highlights.set(`sms-search-matches`, new Highlight(...ranges.flat()));
	}

	$: required, form_input?.setCustomValidity(``);
</script>

<svelte:window
	on:click={on_click_outside}
	on:touchstart={on_click_outside}
	bind:innerWidth={window_width}
/>

<div
	bind:this={outerDiv}
	on:mouseup|stopPropagation={open_dropdown}
	title={disabled ? disabledInputTitle : null}
	data-id={id}
	role="searchbox"
	tabindex="-1"
	class="outer-cnt"
>
	<div
		class:disabled
		class:single={maxSelect === 1}
		class:open
		class:invalid
		class="select {className}"
	>
		<input
			{name}
			{required}
			value={selected.length >= Number(required) ? JSON.stringify(selected) : null}
			tabindex="-1"
			aria-hidden="true"
			aria-label="ignore this, used only to prevent form submission if select is required but empty"
			class="form-control"
			bind:this={form_input}
			on:invalid={() => {
				invalid = true;
				let msg;
				if (maxSelect && maxSelect > 1 && Number(required) > 1) {
					msg = `Please select between ${required} and ${maxSelect} options`;
				} else if (Number(required) > 1) {
					msg = `Please select at least ${required} options`;
				} else {
					msg = `Please select an option`;
				}
				form_input?.setCustomValidity(msg);
			}}
		/>
		{#if $$slots['left-icon']}
			<div class="left-slot">
				<slot name="left-icon" />
			</div>
		{/if}
		<ul class="selected" aria-label="selected options">
			{#each selected as option, idx (duplicates ? [key(option), idx] : key(option))}
				<Chip
					dismissible={!disabled && (minSelect === null || selected.length > minSelect)}
					on:dismiss={() => remove(option)}
					{disabled}
				>
					{get_label(option)}
				</Chip>
			{/each}
			<input
				bind:this={input}
				bind:value={searchText}
				on:mouseup|self|stopPropagation={open_dropdown}
				on:keydown|stopPropagation={handle_keydown}
				on:focus
				on:focus={open_dropdown}
				on:input={highlight_matching_options}
				{id}
				{disabled}
				{autocomplete}
				{pattern}
				placeholder={selected.length == 0 ? placeholder : null}
				aria-invalid={invalid ? `true` : null}
				on:blur
				on:change
				on:click
				on:keydown
				on:keyup
				on:mousedown
				on:mouseenter
				on:mouseleave
				on:touchcancel
				on:touchend
				on:touchmove
				on:touchstart
			/>
		</ul>

		{#if selected.length > 0}
			{#if maxSelect && (maxSelect > 1 || maxSelectMsg)}
				<Wiggle bind:wiggle angle={20}>
					<span class="max-select-msg {maxSelectMsgClass}">
						{maxSelectMsg?.(selected.length, maxSelect)}
					</span>
				</Wiggle>
			{/if}
			{#if maxSelect !== 1 && selected.length > 1}
				<button
					type="button"
					class="remove remove-all"
					title={removeAllTitle}
					on:mouseup|stopPropagation={remove_all}
					on:keydown={if_enter_or_space(remove_all)}
				>
					<Icon icon={IconClose} />
				</button>
			{:else}
				<Icon
					icon={IconArrowFillDown}
					size={30}
					color={disabled ? '--db-color-icon-disabled' : '--db-color-icon-secondary'}
				/>
			{/if}
		{:else}
			<Icon
				icon={IconArrowFillDown}
				size={30}
				color={disabled ? '--db-color-icon-disabled' : '--db-color-icon-secondary'}
			/>
		{/if}

		<!-- only render options dropdown if options or searchText is not empty (needed to avoid briefly flashing empty dropdown) -->
		{#if (searchText && noMatchingOptionsMsg) || options?.length > 0}
			<ul
				class:hidden={!open}
				class="options"
				role="listbox"
				aria-multiselectable={maxSelect === null || maxSelect > 1}
				aria-expanded={open}
				aria-disabled={disabled ? `true` : null}
				bind:this={ul_options}
			>
				{#each matchingOptions.slice(0, Math.max(0, maxOptions ?? 0) || Infinity) as option, idx}
					{@const {
						label,
						disabled = null,
						title = null,
						selectedTitle = null,
						disabledTitle = defaultDisabledTitle
					} = option instanceof Object ? option : { label: option }}
					{@const active = activeIndex === idx}
					<li
						on:mousedown|stopPropagation
						on:mouseup|stopPropagation={(event) => {
							if (!disabled) add(option, event);
						}}
						class:selected={is_selected(label)}
						class:active
						class:disabled
						on:mouseover={() => {
							if (!disabled) activeIndex = idx;
						}}
						on:focus={() => {
							if (!disabled) activeIndex = idx;
						}}
						on:mouseout={() => (activeIndex = null)}
						on:blur={() => (activeIndex = null)}
						role="option"
						aria-selected="false"
						style={get_style(option, `option`)}
					>
						{#if parseLabelsAsHtml}
							{@html get_label(option)}
						{:else}
							{get_label(option)}
						{/if}
					</li>
				{/each}
				{#if searchText}
					{@const text_input_is_duplicate = selected.map(get_label).includes(searchText)}
					{@const is_dupe = !duplicates && text_input_is_duplicate && `dupe`}
					{@const can_create = Boolean(allowUserOptions && createOptionMsg) && `create`}
					{@const no_match =
						Boolean(matchingOptions?.length == 0 && noMatchingOptionsMsg) && `no-match`}
					{@const msgType = is_dupe || can_create || no_match}
					{#if msgType}
						{@const msg = {
							dupe: duplicateOptionMsg,
							create: createOptionMsg,
							'no-match': noMatchingOptionsMsg
						}[msgType]}
						<li
							on:mousedown|stopPropagation
							on:mouseup|stopPropagation={(event) => {
								if (allowUserOptions) add(searchText, event);
							}}
							title={createOptionMsg}
							class:active={option_msg_is_active}
							on:mouseover={() => (option_msg_is_active = true)}
							on:focus={() => (option_msg_is_active = true)}
							on:mouseout={() => (option_msg_is_active = false)}
							on:blur={() => (option_msg_is_active = false)}
							role="option"
							aria-selected="false"
							class="user-msg"
							style:cursor={{
								dupe: `not-allowed`,
								create: `pointer`,
								'no-match': `default`
							}[msgType]}
						></li>
					{/if}
				{/if}
			</ul>
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
	:where(div.select) {
		position: relative;
		align-items: center;
		display: flex;
		cursor: text;
		box-sizing: border-box;
		border-bottom: 0.0625rem solid var(--db-color-border);
		background: var(--db-color-bg);
		width: 100%;
		padding: 0 0.25rem;
		color: var(--db-color-text);
		font-size: var(--db-fontsize-medium);
		min-height: 1.875rem;
	}
	:where(div.select.open) {
		/* increase z-index when open to ensure the dropdown of one <MultiSelect />
	displays above that of another slightly below it on the page */
		z-index: 4;
	}
	:where(div.select:focus-within:not(.disabled)) {
		border-bottom: 0.0625rem solid var(--db-color-border-brand-strong);
	}
	:where(div.select:hover:not(.open)) {
		border-bottom: 0.0625rem solid var(--db-color-border-hover);
	}
	:where(div.select.invalid) {
		border-bottom: 0.0625rem solid var(--db-color-border-danger-strong);
	}
	:where(div.select.disabled:hover:not(.open)) {
		border-bottom: 0.0625rem solid var(--db-color-border-disabled);
	}
	:where(div.select.disabled) {
		cursor: not-allowed;
	}

	:where(div.select > ul.selected) {
		display: flex;
		flex: 1;
		padding: 0;
		margin: 0;
		flex-wrap: wrap;
		gap: 0.5rem;
		padding-bottom: 0.25rem;
	}
	:where(div.select button) {
		border-radius: 50%;
		display: flex;
		transition: 0.2s;
		color: inherit;
		background: transparent;
		border: none;
		cursor: pointer;
		outline: none;
		padding: 0;
		margin: 0 0 0 3pt; /* CSS reset */
	}
	:where(div.select button.remove-all) {
		margin: 0 3pt;
	}
	:where(ul.selected > li button:hover, button.remove-all:hover, button:focus) {
		color: var(--db-color-icon-interactive-hover);
		background: var(--db-color-bg-hover);
	}

	:where(div.select input) {
		margin: auto 0; /* CSS reset */
		padding: 0; /* CSS reset */
	}
	:where(div.select > ul.selected > input) {
		border: none;
		outline: none;
		background: none;
		flex: 1;
		min-width: 2em;
		color: var(--db-color-text);
		font-size: inherit;
		cursor: inherit;
		border-radius: 0;
	}
	/* don't wrap ::placeholder rules in :where() as it seems to be overpowered by browser defaults i.t.o. specificity */
	div.select > ul.selected > input::placeholder {
		padding-left: 5pt;
		color: var(--db-color-text-placeholder);
		font-size: var(--db-fontsize-medium);
	}
	:where(div.select > input.form-control) {
		width: 2em;
		position: absolute;
		background: transparent;
		border: none;
		outline: none;
		z-index: -1;
		opacity: 0;
		pointer-events: none;
	}

	:where(div.select > ul.options) {
		list-style: none;
		top: calc(100% + 0.125rem);
		left: 0;
		width: 100%;
		position: absolute;
		overflow: auto;
		transition: all 0.3s reverse;
		box-sizing: border-box;
		background: var(--db-color-bg);
		max-height: 50vh;
		overscroll-behavior: none;
		box-shadow: 0 3px 30px rgba(0, 0, 0, 0.13);
		border-radius: 0 0 0.25rem 0.25rem;
		padding: 0.25rem 0;
	}
	:global(.appearance-dark div.select > ul.options) {
		box-shadow: 0 3px 30px rgba(0, 0, 0, 0.5);
	}
	:where(div.select > ul.options.hidden) {
		visibility: hidden;
		opacity: 0;
		transform: translateY(50px);
	}
	:where(div.select > ul.options > li) {
		padding: 0 1rem;
		font-size: var(--db-fontsize-medium);
		height: 2rem;
		display: flex;
		align-items: center;
		cursor: pointer;
		user-select: none;
		scroll-margin: 6.25rem;
	}
	:where(div.select > ul.options .user-msg) {
		/* block needed so vertical padding applies to span */
		display: block;
		padding: 3pt 2ex;
	}
	:where(div.select > ul.options > li.selected) {
		background: var(--db-color-bg-selected);
		color: var(--db-color-text-selected);
	}
	:where(div.select > ul.options > li.active) {
		background: var(--db-color-bg-hover);
	}
	:where(div.select > ul.options > li.disabled) {
		cursor: not-allowed;
		background: var(--db-color-bg-disabled);
		color: var(--db-color-text-disabled);
	}

	:where(span.max-select-msg) {
		padding: 0 3pt;
	}
	::highlight(sms-search-matches) {
		color: var(--db-color-text-brand);
	}
	:where(div.outer-cnt) {
		row-gap: 0.5rem;
		width: 100%;
	}

	:where(div.select > .left-slot) {
		margin-bottom: -0.5rem;
	}
</style>
