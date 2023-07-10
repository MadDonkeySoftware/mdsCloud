#!/usr/bin/env node
// NOTE: the above is intentionally using node since that is the proper value after transpilation

import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { createCommand } from 'commander';
import { Options } from '../../types';
import { display, extendBaseCommand, stringifyForDisplay } from '../../utils';

const cmd = createCommand();
cmd
  .name('details')
  .argument('<queueOrid>', 'The orid of the queue')
  .description('Get the details of a queue')
  .showHelpAfterError(true);

extendBaseCommand(cmd);

cmd.action(async (queueOrid: string, options: Options) => {
  await MdsSdk.initialize(options.env);
  const client = await MdsSdk.getQueueServiceClient();

  try {
    const details = await client.getQueueDetails(queueOrid);
    display(JSON.stringify(details, null, 2));
  } catch (err) {
    display('An error occurred while requesting the queue metadata');
    display(stringifyForDisplay(err.message || err));
  }
});

cmd.parseAsync(process.argv);
