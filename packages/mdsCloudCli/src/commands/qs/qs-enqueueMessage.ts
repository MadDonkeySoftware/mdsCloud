#!/usr/bin/env node
// NOTE: the above is intentionally using node since that is the proper value after transpilation

import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { createCommand } from 'commander';
import { Options } from '../../types';
import { display, extendBaseCommand, stringifyForDisplay } from '../../utils';

const cmd = createCommand();
cmd
  .name('enqueueMessage')
  .argument('<queueOrid>', 'The orid of the queue')
  .argument('<message>', 'The message to enqueue')
  .description('Enqueue a message into the specified queue')
  .showHelpAfterError(true);

extendBaseCommand(cmd);

cmd.action(async (queueOrid: string, message: string, options: Options) => {
  await MdsSdk.initialize(options.env);
  const client = await MdsSdk.getQueueServiceClient();

  try {
    await client.enqueueMessage(queueOrid, message);
    display('Message enqueued successfully.');
  } catch (err) {
    display('An error occurred while enqueueing the message');
    display(stringifyForDisplay(err.message || err));
  }
});

cmd.parseAsync(process.argv);
