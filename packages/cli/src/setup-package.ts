import fs from 'fs';

/*
https://newbedev.com/how-to-npm-publish-specific-folder-but-as-package-root

DO NOT DELETE THIS FILE
This file is used by build system to build a clean npm package with the compiled js files in the root of the package.
It will not be included in the npm package.
*/

interface PackageJson {
  version: string;
  scripts: Record<string, string>;
  devDependencies: Record<string, string>;
  main: string;
  types: string;
  bin: string | object;
}

function main() {
  const source = fs
    .readFileSync(__dirname + '/../package.json')
    .toString('utf-8');
  const sourceObj = JSON.parse(source) as PackageJson;
  sourceObj.scripts = {};
  sourceObj.devDependencies = {};

  if (sourceObj.main.startsWith('dist/')) {
    sourceObj.main = sourceObj.main.slice(5);
  }
  if (sourceObj.types?.startsWith('dist/')) {
    sourceObj.types = sourceObj.types.slice(5);
  }

  if (sourceObj.bin) {
    if (
      typeof sourceObj.bin === 'string' &&
      sourceObj.bin.startsWith('dist/')
    ) {
      sourceObj.bin = sourceObj.bin.slice(5);
    } else if (typeof sourceObj.bin === 'object') {
      const sets: [string, string][] = Object.entries(sourceObj.bin);
      sourceObj.bin = {};
      sets.forEach(([key, val]) => {
        sourceObj.bin[key] = val.startsWith('dist/') ? val.slice(5) : val;
        fs.chmodSync(`${process.cwd()}/dist/${sourceObj.bin[key]}`, 0o755);
      });
    } else {
      throw new Error('Unsure how to transform bin attribute.');
    }
  }

  let outFile = `${__dirname}/package.json`;
  console.log(`Writing ${outFile}...`);
  fs.writeFileSync(
    outFile,
    Buffer.from(JSON.stringify(sourceObj, null, 2), 'utf-8'),
  );
  // fs.writeFileSync(__dirname + "/version.txt", Buffer.from(sourceObj.version, "utf-8") );

  outFile = `${__dirname}/.npmignore`;
  fs.copyFileSync(__dirname + '/../.npmignore', outFile);
  console.log(`Copying file to ${outFile}...`);
}

main();
