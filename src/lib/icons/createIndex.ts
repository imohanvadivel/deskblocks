import { readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

// Source directory
const sourceDir = join(__dirname, 'source');

// Create index file
async function createIndexFile(directoryPath: string) {
  try {
    const fileNames = await readdir(directoryPath);
    const indexFile = join(__dirname, 'index.ts');
    const data = fileNames.map((e) => `export { default as Icon${e.split('.')[0]} } from './source/${e}';`).join('\n');

    await writeFile(indexFile, data);
  } catch (error) {
    console.error(error);
  }
}

createIndexFile(sourceDir);