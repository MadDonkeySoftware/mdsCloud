#!/usr/bin/env node
// NOTE: the above is intentionally using node since that is the proper value after transpilation

import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { createCommand } from 'commander';
import { Options } from '../../types';
import { display, extendBaseCommand, stringifyForDisplay } from '../../utils';

const cmd = createCommand();
cmd
  .name('create')
  .argument('<name>', 'The name of the container to create')
  .description('Create a new container with the specified name')
  .showHelpAfterError(true);

extendBaseCommand(cmd);

cmd.action(async (name: string, options: Options) => {
  try {
    await MdsSdk.initialize(options.env);
    const client = await MdsSdk.getFileServiceClient();
    const result = await client.createContainer(name);

    display(`Container created successfully: ${result.orid}`);
  } catch (err) {
    display('An error occurred while creating the container.');
    display(stringifyForDisplay(err.message || err));
  }
});

cmd.parseAsync(process.argv);
