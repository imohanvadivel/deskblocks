import { readdir, rename } from 'node:fs/promises';
import { join } from 'node:path';

// Source directory
const sourceDir = join(__dirname, 'source');

// Rename all icons in the directory
async function renameIcons(directoryPath: string) {
	// Generate new file name
	function getNewFileName(fileName: string) {
		let name = fileName.split(' ');
		name = name.map((word) => {
			// if (i === 0) return word;
			return word.charAt(0).toUpperCase() + word.slice(1);
		});
		return name.join('');
	}

	// Rename files
	async function renameFile(oldName: string, newName: string) {
		await rename(join(sourceDir, oldName), join(sourceDir, newName));
		console.log(`Renamed ${oldName} to ${newName}`);
	}

	try {
		const fileNames = await readdir(directoryPath);
		const newFileNames = fileNames.map((e) => getNewFileName(e));

		for (let i = 0; i < fileNames.length; i++) {
			await renameFile(fileNames[i], newFileNames[i]);
		}
	} catch (error) {
		console.error(error);
	}
}

renameIcons(sourceDir);
