import { readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

// Source directory
const sourceDir = join(__dirname, 'source');

// Create index file
async function createIndexFile(directoryPath: string) {
  try {
    const fileNames = await readdir(directoryPath);
    const indexFile = join(__dirname, 'index.ts');
    // Deprecated aliases kept for backward compatibility with pre-0.2.0 misspelled exports.
    const aliases = [
      `export { default as IconAnnoncement } from './source/Announcement.svg';`,
      `export { default as IconConfiguaration } from './source/Configuration.svg';`
    ];
    const data = fileNames
      .map((e) => `export { default as Icon${e.split('.')[0]} } from './source/${e}';`)
      .concat(aliases)
      .join('\n');

    await writeFile(indexFile, data + '\n');
  } catch (error) {
    console.error(error);
  }
}

createIndexFile(sourceDir);