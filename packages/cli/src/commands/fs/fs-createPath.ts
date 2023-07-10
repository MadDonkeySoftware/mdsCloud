#!/usr/bin/env node
// NOTE: the above is intentionally using node since that is the proper value after transpilation

import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { createCommand } from 'commander';
import { Options } from '../../types';
import { display, extendBaseCommand, stringifyForDisplay } from '../../utils';

const cmd = createCommand();
cmd
  .name('createPath')
  .argument(
    '<container>',
    'The orid of the container in which to create the path',
  )
  .argument(
    '<path>',
    'The path segment to create inside of the specified container',
  )
  .description('Creates a subdirectory inside of the specified container')
  .showHelpAfterError(true);

extendBaseCommand(cmd);

cmd.action(async (name: string, path: string, options: Options) => {
  try {
    await MdsSdk.initialize(options.env);
    const client = await MdsSdk.getFileServiceClient();
    const result = await client.createContainerPath(name, path);

    display(`Container path created successfully: ${result.orid}`);
  } catch (err) {
    display('An error occurred while creating the container path.');
    display(stringifyForDisplay(err.message || err));
  }
});

cmd.parseAsync(process.argv);
