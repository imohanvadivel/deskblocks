function stripName(name: string) {
	const fileName = name.split('/').pop();
	return fileName?.replace('.css', '').trim();
}

const lightRepeatingProperty: string[] = [
	`--db-color-bg-switch-active`,
	`--db-color-bg-switch-active-hover`,
	`--db-color-bg-switch-active-disabled`,
	`--db-color-bg-switch-inactive`,
	`--db-color-bg-switch-inactive-hover`,
	`--db-color-bg-switch-inactive-disabled`,

	`--db-color-bg-info`,
	`--db-color-bg-info-hover`,
	`--db-color-bg-info-pressed`,
	`--db-color-bg-info-secondary`,
	`--db-color-bg-info-disabled`,

	`--db-color-bg-success`,
	`--db-color-bg-success-hover`,
	`--db-color-bg-success-pressed`,
	`--db-color-bg-success-secondary`,
	`--db-color-bg-success-disabled`,

	`--db-color-bg-warning`,
	`--db-color-bg-warning-hover`,
	`--db-color-bg-warning-pressed`,
	`--db-color-bg-warning-secondary`,
	`--db-color-bg-warning-disabled`,

	`--db-color-bg-danger`,
	`--db-color-bg-danger-hover`,
	`--db-color-bg-danger-pressed`,
	`--db-color-bg-danger-secondary`,
	`--db-color-bg-danger-disabled`,

	`--db-color-icon-info`,
	`--db-color-icon-info-hover`,
	`--db-color-icon-info-pressed`,
	`--db-color-icon-info-disabled`,
	`--db-color-icon-oninfo`,

	`--db-color-icon-success`,
	`--db-color-icon-success-hover`,
	`--db-color-icon-success-pressed`,
	`--db-color-icon-success-disabled`,
	`--db-color-icon-onsuccess`,

	`--db-color-icon-danger`,
	`--db-color-icon-danger-hover`,
	`--db-color-icon-danger-pressed`,
	`--db-color-icon-danger-disabled`,
	`--db-color-icon-ondanger`,

	`--db-color-icon-warning`,
	`--db-color-icon-warning-hover`,
	`--db-color-icon-warning-pressed`,
	`--db-color-icon-warning-disabled`,
	`--db-color-icon-onwarning`,

	`--db-color-border-info`,
	`--db-color-border-info-hover`,
	`--db-color-border-info-light`,
	`--db-color-border-info-strong`,
	`--db-color-border-info-disabled`,

	`--db-color-border-success`,
	`--db-color-border-success-hover`,
	`--db-color-border-success-light`,
	`--db-color-border-success-strong`,
	`--db-color-border-success-disabled`,

	`--db-color-border-warning`,
	`--db-color-border-warning-hover`,
	`--db-color-border-warning-light`,
	`--db-color-border-warning-strong`,
	`--db-color-border-warning-disabled`,

	`--db-color-border-danger`,
	`--db-color-border-danger-hover`,
	`--db-color-border-danger-light`,
	`--db-color-border-danger-strong`,
	`--db-color-border-danger-disabled`,

	`--db-color-text-info`,
	`--db-color-text-info-hover`,
	`--db-color-text-info-pressed`,
	`--db-color-text-info-secondary`,
	`--db-color-text-info-disabled`,
	`--db-color-text-oninfo`,

	`--db-color-text-success`,
	`--db-color-text-success-hover`,
	`--db-color-text-success-pressed`,
	`--db-color-text-success-secondary`,
	`--db-color-text-success-disabled`,
	`--db-color-text-onsuccess`,

	`--db-color-text-danger`,
	`--db-color-text-danger-hover`,
	`--db-color-text-danger-pressed`,
	`--db-color-text-danger-secondary`,
	`--db-color-text-danger-disabled`,
	`--db-color-text-ondanger`,

	`--db-color-text-warning`,
	`--db-color-text-warning-hover`,
	`--db-color-text-warning-pressed`,
	`--db-color-text-warning-secondary`,
	`--db-color-text-warning-disabled`,
	`--db-color-text-onwarning`
];

const darkRepeatingProperty: string[] = [
	`--db-color-bg`,
	`--db-color-bg-hover`,
	`--db-color-bg-pressed`,
	`--db-color-bg-secondary`,
	`--db-color-bg-secondary-hover`,
	`--db-color-bg-tertiary`,
	`--db-color-bg-tertiary-hover`,
	`--db-color-bg-inverse`,
	`--db-color-bg-disabled`,
	`--db-color-bg-selected`,
	`--db-color-bg-selected-hover`,
	`--db-color-bg-selected-pressed`,

	`--db-color-bg-switch-active`,
	`--db-color-bg-switch-active-hover`,
	`--db-color-bg-switch-active-disabled`,
	`--db-color-bg-switch-inactive`,
	`--db-color-bg-switch-inactive-hover`,
	`--db-color-bg-switch-inactive-disabled`,

	`--db-color-bg-chip`,
	`--db-color-bg-chip-hover`,
	`--db-color-bg-chip-disabled`,

	`--db-color-bg-info`,
	`--db-color-bg-info-hover`,
	`--db-color-bg-info-pressed`,
	`--db-color-bg-info-secondary`,
	`--db-color-bg-info-disabled`,

	`--db-color-bg-success`,
	`--db-color-bg-success-hover`,
	`--db-color-bg-success-pressed`,
	`--db-color-bg-success-secondary`,
	`--db-color-bg-success-disabled`,

	`--db-color-bg-warning`,
	`--db-color-bg-warning-hover`,
	`--db-color-bg-warning-pressed`,
	`--db-color-bg-warning-secondary`,
	`--db-color-bg-warning-disabled`,

	`--db-color-bg-danger`,
	`--db-color-bg-danger-hover`,
	`--db-color-bg-danger-pressed`,
	`--db-color-bg-danger-secondary`,
	`--db-color-bg-danger-disabled`,

	`--db-color-icon`,
	`--db-color-icon-hover`,
	`--db-color-icon-pressed`,
	`--db-color-icon-secondary`,
	`--db-color-icon-secondary-hover`,
	`--db-color-icon-tertiary`,
	`--db-color-icon-tertiary-hover`,
	`--db-color-icon-oninverse`,
	`--db-color-icon-disabled`,

	`--db-color-icon-info`,
	`--db-color-icon-info-hover`,
	`--db-color-icon-info-pressed`,
	`--db-color-icon-info-disabled`,
	`--db-color-icon-oninfo`,

	`--db-color-icon-success`,
	`--db-color-icon-success-hover`,
	`--db-color-icon-success-pressed`,
	`--db-color-icon-success-disabled`,
	`--db-color-icon-onsuccess`,

	`--db-color-icon-danger`,
	`--db-color-icon-danger-hover`,
	`--db-color-icon-danger-pressed`,
	`--db-color-icon-danger-disabled`,
	`--db-color-icon-ondanger`,

	`--db-color-icon-warning`,
	`--db-color-icon-warning-hover`,
	`--db-color-icon-warning-pressed`,
	`--db-color-icon-warning-disabled`,
	`--db-color-icon-onwarning`,

	`--db-color-border`,
	`--db-color-border-hover`,
	`--db-color-border-light`,
	`--db-color-border-strong`,
	`--db-color-border-disabled`,
	`--db-color-border-oninverse`,

	`--db-color-border-info`,
	`--db-color-border-info-hover`,
	`--db-color-border-info-light`,
	`--db-color-border-info-strong`,
	`--db-color-border-info-disabled`,

	`--db-color-border-success`,
	`--db-color-border-success-hover`,
	`--db-color-border-success-light`,
	`--db-color-border-success-strong`,
	`--db-color-border-success-disabled`,

	`--db-color-border-warning`,
	`--db-color-border-warning-hover`,
	`--db-color-border-warning-light`,
	`--db-color-border-warning-strong`,
	`--db-color-border-warning-disabled`,

	`--db-color-border-danger`,
	`--db-color-border-danger-hover`,
	`--db-color-border-danger-light`,
	`--db-color-border-danger-strong`,
	`--db-color-border-danger-disabled`,

	`--db-color-text`,
	`--db-color-text-secondary`,
	`--db-color-text-tertiary`,
	`--db-color-text-disabled`,
	`--db-color-text-placeholder`,
	`--db-color-text-oninverse`,

	`--db-color-text-info`,
	`--db-color-text-info-hover`,
	`--db-color-text-info-pressed`,
	`--db-color-text-info-secondary`,
	`--db-color-text-info-disabled`,
	`--db-color-text-oninfo`,

	`--db-color-text-success`,
	`--db-color-text-success-hover`,
	`--db-color-text-success-pressed`,
	`--db-color-text-success-secondary`,
	`--db-color-text-success-disabled`,
	`--db-color-text-onsuccess`,

	`--db-color-text-danger`,
	`--db-color-text-danger-hover`,
	`--db-color-text-danger-pressed`,
	`--db-color-text-danger-secondary`,
	`--db-color-text-danger-disabled`,
	`--db-color-text-ondanger`,

	`--db-color-text-warning`,
	`--db-color-text-warning-hover`,
	`--db-color-text-warning-pressed`,
	`--db-color-text-warning-secondary`,
	`--db-color-text-warning-disabled`,
	`--db-color-text-onwarning`
];

async function processCSS(filesPaths: string[], theme: 'light' | 'dark', outputFileName: string) {
	let processedCSS = ``;

	processedCSS += `:root.appearance-${theme}{`;
	// if (theme === 'dark') {
	// 	processedCSS += `:root.appearance-${theme}{`;
	// } else {
	// 	processedCSS += `:root{`;
	// }

	const repeatingProperty = theme === 'light' ? lightRepeatingProperty : darkRepeatingProperty;

	let nonRepeatingProp = ``;
	let index = 0;

	for (const filePath of filesPaths) {
		const file = Bun.file(filePath);
		let fileName = stripName(file.name as string) as string;
		fileName = fileName.toLocaleLowerCase();
		const cssContent = await file.text();
		const lines = cssContent.split('\n').map((line) => line.trim());
		const variables = lines.filter((line) => line.startsWith('--'));

		const data: { [key: string]: string } = {};
		let localCSS: string;

		localCSS = `:root.appearance-${theme}.theme-${fileName}{`;
		// if (theme === 'dark') {
		// 	localCSS = `:root.appearance-${theme}.theme-${fileName}{`;
		// } else {
		// 	localCSS = `:root.theme-${fileName}{`;
		// }

		variables.forEach((variable) => {
			let [key, value] = variable.split(':');
			key = key.trim();
			value = value.trim();
			data[key] = value;

			if (!repeatingProperty.includes(key)) {
				localCSS += `${key}:${value}`;
			} else if (index === 0) {
				processedCSS += `${key}:${value}`;
			}
		});

		localCSS += `}`;
		nonRepeatingProp += localCSS;
		index++;
	}

	processedCSS += `}`;
	processedCSS += nonRepeatingProp;
	await Bun.write(outputFileName, processedCSS);
}

const lightThemeFiles = [
	'src/theme-generator/lightTheme/Yellow.css',
	'src/theme-generator/lightTheme/Red.css',
	'src/theme-generator/lightTheme/Green.css',
	'src/theme-generator/lightTheme/Blue.css',
	'src/theme-generator/lightTheme/Orange.css'
];

const darkThemeFiles = [
	'src/theme-generator/darkTheme/Yellow.css',
	'src/theme-generator/darkTheme/Red.css',
	'src/theme-generator/darkTheme/Green.css',
	'src/theme-generator/darkTheme/Blue.css',
	'src/theme-generator/darkTheme/Orange.css'
];

processCSS(lightThemeFiles, 'light', 'src/lib/styles/color/lightTheme.css');
processCSS(darkThemeFiles, 'dark', 'src/lib/styles/color/darkTheme.css');
