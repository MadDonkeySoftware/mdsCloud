#!/usr/bin/env node
// NOTE: the above is intentionally using node since that is the proper value after transpilation

import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { createCommand } from 'commander';
import { Options } from '../../types';
import { display, extendBaseCommand, stringifyForDisplay } from '../../utils';

const cmd = createCommand();
cmd
  .name('emit')
  .argument(
    '<topics...>',
    'The orid(s) of the topic(s) to watch for messages. Space delimited.',
  )
  .description(
    'Watches a list of topics for events and displays them to the console',
  )
  .showHelpAfterError(true);

extendBaseCommand(cmd);

cmd.action(async (topics: string[], options: Options) => {
  await MdsSdk.initialize(options.env);
  const client = await MdsSdk.getNotificationServiceClient();
  try {
    display(`Watching for events on topics: ${topics.join(', ')}`);
    topics.forEach((topic) => {
      client.on(topic, (data) => {
        display(stringifyForDisplay(data));
      });
    });
  } catch (err) {
    display('An error occurred while watching for messages');
    display(stringifyForDisplay(err.message || err));
    client.close();
  }

  process.on('SIGINT', () => {
    client.close();
    process.exit();
  });
});

cmd.parseAsync(process.argv);
