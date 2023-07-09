#!/usr/bin/env node
// NOTE: the above is intentionally using node since that is the proper value after transpilation

import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { createCommand } from 'commander';
import { Options } from '../../types';
import { display, extendBaseCommand, stringifyForDisplay } from '../../utils';

const cmd = createCommand();
cmd
  .name('list')
  .argument(
    '<oridPath>',
    'The ORID of the container, or container path, that you wish to upload to.',
  )
  .argument('<localFilePath>', 'The path of the file that you wish to upload.')
  .description('Uploads a file to the specified container path')
  .showHelpAfterError(true);

extendBaseCommand(cmd);

cmd.action(
  async (oridPath: string, localFilePath: string, options: Options) => {
    try {
      await MdsSdk.initialize(options.env);
      const client = await MdsSdk.getFileServiceClient();
      const results = await client.uploadFile(oridPath, localFilePath);

      display(`File uploaded successfully: ${results.orid}`);
    } catch (err) {
      display(
        'An error occurred while uploading the file to the container path.',
      );
      display(stringifyForDisplay(err.message || err));
    }
  },
);

cmd.parseAsync(process.argv);
