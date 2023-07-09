#!/usr/bin/env node
// NOTE: the above is intentionally using node since that is the proper value after transpilation

import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { createCommand } from 'commander';
import { sep } from 'path';
import { Options } from '../../types';
import { display, extendBaseCommand, stringifyForDisplay } from '../../utils';

const cmd = createCommand();
cmd
  .name('download')
  .argument(
    '<oridPath>',
    'The ORID of the container file that you wish to retrieve.',
  )
  .argument(
    '[destination]',
    'The location to save the file to after download completes. Defaults to the current working directory',
  )
  .description('Downloads a file from the specified container path')
  .showHelpAfterError(true);

extendBaseCommand(cmd);

cmd.action(
  async (
    oridPath: string,
    destination: string | undefined,
    options: Options,
  ) => {
    try {
      let outDir = process.cwd();
      if (destination) {
        if (destination.startsWith('.')) {
          if (!destination.startsWith('..')) {
            outDir = destination.replace('.', process.cwd());
          } else {
            outDir = `${process.cwd()}${sep}${destination}`;
          }
        }
      }

      await MdsSdk.initialize(options.env);
      const client = await MdsSdk.getFileServiceClient();
      await client.downloadFile(oridPath, outDir);

      display('File downloaded successfully');
    } catch (err) {
      display('An error occurred while downloading the file.');
      display(stringifyForDisplay(err.message || err));
    }
  },
);

cmd.parseAsync(process.argv);
