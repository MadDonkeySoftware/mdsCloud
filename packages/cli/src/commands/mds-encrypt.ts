#!/usr/bin/env node
// NOTE: the above is intentionally using node since that is the proper value after transpilation

import { EOL } from 'os';
import { createCommand, createOption } from 'commander';
import { readFile, writeFile, unlink as deleteFile } from 'fs/promises';
import { AES, enc, lib } from 'crypto-js';
import { Options } from '../types';
import { display, extendBaseCommand } from '../utils';
import { fileExists } from '../utils/file-exists';

type EncryptionFunc = (
  data: string,
  password: lib.WordArray,
  initVector: lib.WordArray,
) => Promise<string | Record<string, unknown>>;

const ENCRYPTION_MAP: Record<string, EncryptionFunc> = {
  complete: completeEncryption,
  ini: iniEncryption,
};

async function completeEncryption(
  inData: string,
  pwd: lib.WordArray,
  iv: lib.WordArray,
): Promise<string> {
  return AES.encrypt(inData, pwd, { iv }).toString();
}

async function iniEncryption(
  inData: string,
  pwd: lib.WordArray,
  iv: lib.WordArray,
): Promise<Record<string, unknown>> {
  const inLines = inData.split(EOL);
  const outObj: Record<string, string> = {};

  for (let i = 0; i < inLines.length; i += 1) {
    const line = inLines[i];
    console.log(`Processing line: ${line}`);
    const firstEqual = line.indexOf('=');
    if (firstEqual !== -1) {
      const key = line.substring(0, firstEqual);
      const val = line.substring(firstEqual + 1);
      outObj[key] = AES.encrypt(val, pwd, { iv }).toString();
    } else {
      outObj[line] = '';
      // TODO: How to handle blank lines, comments, etc.
    }
  }

  return outObj;
}

const cmd = createCommand();
cmd
  .name('encrypt')
  .argument('<file>', 'The file to encrypt')
  .description('Encrypts the target file')
  .addOption(
    createOption(
      '--password <password>',
      'The password to use when encrypting the file. This takes precedent over the MDS_CLI_CRYPTO_PWD environment variable.',
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
      'If enabled, the file being encrypted will be replace',
    ).default(false),
  )
  .addOption(
    createOption(
      '--format <format>',
      `What file format the input is in. Determines how the file is decrypted.
      complete - encrypts the file as a single secure string. No processing is performed.
      ini - encrypts the file so ini keys are readable. Everything after the first equal is encrypted.`,
    )
      .choices(['complete', 'ini'])
      .default('complete'),
  )
  .showHelpAfterError(true);

extendBaseCommand(cmd);

type Params = {
  password?: string;
  outFile?: string;
  inPlace: boolean;
  format: string;
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

  const fileData = (await readFile(file)).toString();
  const method = ENCRYPTION_MAP[options.format];
  if (!method) {
    display(
      `It appears the encryption method (${options.format}) is not supported. Please verify the encryption method and the MDS CLI version.`,
    );
    return;
  }

  const pwdUtf = enc.Utf8.parse(pwd);
  const iv = enc.Base64.parse(pwd);
  const data = await method(fileData, pwdUtf, iv);

  const outData = JSON.stringify(
    {
      agent: 'mds cli',
      mode: options.format,
      data,
    },
    null,
    2,
  );

  if (options.inPlace) {
    await deleteFile(file);
    await writeFile(file, outData, { encoding: 'utf-8' });
    return;
  }

  if (await fileExists(options.outFile)) {
    await deleteFile(options.outFile);
  }
  await writeFile(options.outFile, outData, { encoding: 'utf-8' });
  display('File encryption complete');
});

cmd.parseAsync(process.argv);
