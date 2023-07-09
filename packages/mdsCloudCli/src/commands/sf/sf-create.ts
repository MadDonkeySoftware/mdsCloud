#!/usr/bin/env node
// NOTE: the above is intentionally using node since that is the proper value after transpilation

import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { createCommand } from 'commander';
import { Options } from '../../types';
import { display, extendBaseCommand, stringifyForDisplay } from '../../utils';

const cmd = createCommand();
cmd
  .name('create')
  .argument('<name>', 'The name of the new serverless function')
  .description('Create a new function with the provided name')
  .showHelpAfterError(true);

extendBaseCommand(cmd);

cmd.action(async (name: string, options: Options) => {
  await MdsSdk.initialize(options.env);
  const client = await MdsSdk.getServerlessFunctionsClient();

  try {
    const result = await client.createFunction(name);
    display(`Serverless function created successfully. ${result.orid}`);
  } catch (err) {
    display('An error occurred while creating the serverless function');
    display(stringifyForDisplay(err.message || err));
  }
});

cmd.parseAsync(process.argv);
