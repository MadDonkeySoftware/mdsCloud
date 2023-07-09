#!/usr/bin/env node
// NOTE: the above is intentionally using node since that is the proper value after transpilation

import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { createCommand, createOption } from 'commander';
import { Options } from '../../types';
import { display, extendBaseCommand, stringifyForDisplay } from '../../utils';

const cmd = createCommand();
cmd
  .name('update')
  .argument('<queueOrid>')
  .description('Updates metadata for the specified queue')
  .addOption(
    createOption(
      '--resource <resource>',
      'Resource to be invoked upon message being enqueued. Use the string "null" to remove the current value.',
    ),
  )
  .addOption(
    createOption(
      '--dlq <dlq>',
      'ORID of the queue to place messages in if resource invoke fails. Use the string "null" to remove the current value.',
    ),
  )
  .showHelpAfterError(true);

extendBaseCommand(cmd);

type Params = {
  resource?: string;
  dlq?: string;
};

cmd.action(async (queueOrid: string, options: Options<Params>) => {
  await MdsSdk.initialize(options.env);
  const client = await MdsSdk.getQueueServiceClient();

  try {
    await client.updateQueue(queueOrid, options);
    display('Queue updated successfully.');
  } catch (err) {
    display('An error occurred while updating the queue.');
    display(stringifyForDisplay(err.message || err));
  }
});

cmd.parseAsync(process.argv);
