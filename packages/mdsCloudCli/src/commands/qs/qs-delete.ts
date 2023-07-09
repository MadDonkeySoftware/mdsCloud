#!/usr/bin/env node
// NOTE: the above is intentionally using node since that is the proper value after transpilation

import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { createCommand } from 'commander';
import { Options } from '../../types';
import { display, extendBaseCommand, stringifyForDisplay } from '../../utils';

const cmd = createCommand();
cmd
  .name('delete')
  .argument('<queueOrid>', 'The orid of the queue to be removed')
  .description('Removes a queue')
  .showHelpAfterError(true);

extendBaseCommand(cmd);

cmd.action(async (queueOrid: string, options: Options) => {
  await MdsSdk.initialize(options.env);
  const client = await MdsSdk.getQueueServiceClient();

  try {
    await client.deleteQueue(queueOrid);
    display('Queue removed successfully.');
  } catch (err) {
    display('An error occurred while removing the queue');
    display(stringifyForDisplay(err.message || err));
  }
});

cmd.parseAsync(process.argv);
