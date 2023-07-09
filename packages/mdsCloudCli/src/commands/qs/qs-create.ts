#!/usr/bin/env node
// NOTE: the above is intentionally using node since that is the proper value after transpilation

import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { createCommand, createOption } from 'commander';
import { Options } from '../../types';
import { display, extendBaseCommand, stringifyForDisplay } from '../../utils';

const cmd = createCommand();
cmd
  .name('create')
  .argument('<queueName>', 'The name of the new queue')
  .addOption(
    createOption(
      '--resource <resource>',
      'Resource to be invoked upon message being enqueued',
    ),
  )
  .addOption(
    createOption(
      '--dlq <dlqOrid>',
      'ORID of the queue to place messages in if resource invoke fails',
    ),
  )
  .description('Create a new queue')
  .showHelpAfterError(true);

extendBaseCommand(cmd);

type Params = {
  resource?: string;
  dlq?: string;
};

cmd.action(async (queueName: string, options: Options<Params>) => {
  await MdsSdk.initialize(options.env);
  const client = await MdsSdk.getQueueServiceClient();

  try {
    const result = await client.createQueue(queueName, options);
    display(`Queue created successfully. ${result.orid}`);
  } catch (err) {
    display('An error occurred while creating the queue');
    display(stringifyForDisplay(err.message || err));
  }
});

cmd.parseAsync(process.argv);
