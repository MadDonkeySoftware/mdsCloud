#!/usr/bin/env node
// NOTE: the above is intentionally using node since that is the proper value after transpilation

import { EOL } from 'os';
import { createCommand, createOption } from 'commander';
import { readFile, writeFile, unlink as deleteFile } from 'fs/promises';
import { AES, enc, lib } from 'crypto-js';
import { Options } from '../types';
import { display, extendBaseCommand } from '../utils';
import { fileExists } from '../utils/file-exists';

type DecryptionFunc = (
  data: string,
  password: lib.WordArray,
  initVector: lib.WordArray,
) => Promise<string>;

const DECRYPTION_MAP: Record<string, DecryptionFunc> = {
  complete: completeDecryption,
  ini: iniDecryption,
};

async function completeDecryption(
  inData: string,
  pwd: lib.WordArray,
  iv: lib.WordArray,
): Promise<string> {
  return AES.decrypt(inData, pwd, { iv }).toString(enc.Utf8);
}

async function iniDecryption(
  inData: string,
  pwd: lib.WordArray,
  iv: lib.WordArray,
): Promise<string> {
  const outLines = [];
  const keys = Object.keys(inData);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const val = inData[key];
    if (val) {
      outLines.push(
        `${key}=${AES.decrypt(val, pwd, { iv }).toString(enc.Utf8)}`,
      );
    } else {
      outLines.push(`${key}`);
    }
  }

  // TODO: This should probably match the files EOL, not the system.
  return outLines.join(EOL);
}

const cmd = createCommand();
cmd
  .name('decrypt')
  .argument('<file>', 'The file to decrypt')
  .description('Decrypts the target file')
  .addOption(
    createOption(
      '--password',
      'The password to use when decrypting the file. This takes precedent over the MDS_CLI_CRYPTO_PWD environment variable.',
    ),
  )
  .addOption(
    createOption(
      '--outFile <outFile>',
      'The name of the output file if the "inPlace" switch is not used.',
    ),
  )
  .addOption(
    createOption(
      '--inPlace',
      'If enabled, the file being decrypted will be replace',
    ),
  )
  .showHelpAfterError(true);

extendBaseCommand(cmd);

type Params = {
  password: string;
  outFile: string;
  inPlace: boolean;
};

cmd.action(async (file: string, options: Options<Params>) => {
  display('WARNING: Encryption/Decryption is experimental.');
  const pwd = options.password || process.env.MDS_CLI_CRYPTO_PWD;

  if (!pwd) {
    display(
      'Password is required. Use password flag or MDS_CLI_CRYPTO_PWD environment variable',
    );
    return;
  }

  if (!options.inPlace && !options.outFile) {
    display(
      'Must use inPlace flag or provide a outFile name. Cannot perform action.',
    );
    return;
  }

  const fileData = JSON.parse((await readFile(file)).toString());
  const method = DECRYPTION_MAP[fileData.mode];
  if (!method) {
    display(
      `It appears the decryption method (${fileData.mode}) is not supported. Please verify the decryption method and the MDS CLI version.`,
    );
    return;
  }

  const pwdUtf = enc.Utf8.parse(pwd);
  const iv = enc.Base64.parse(pwd);
  const data = await method(fileData.data, pwdUtf, iv);

  if (options.inPlace) {
    await deleteFile(file);
    await writeFile(file, data, { encoding: 'utf-8' });
    return;
  }

  if (await fileExists(options.outFile)) {
    await deleteFile(options.outFile);
  }
  await writeFile(options.outFile, data, { encoding: 'utf-8' });
  display('File decryption complete');
});

cmd.parseAsync(process.argv);
