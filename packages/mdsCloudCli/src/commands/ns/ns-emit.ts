#!/usr/bin/env node
// NOTE: the above is intentionally using node since that is the proper value after transpilation

import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { createCommand, createOption } from 'commander';
import { Options } from '../../types';
import { display, extendBaseCommand, stringifyForDisplay } from '../../utils';

const cmd = createCommand();
cmd
  .name('emit')
  .argument('<topic>', 'The orid of the topic to publish a message to')
  .argument('[data]', 'The optional message payload')
  .addOption(
    createOption(
      '-df, --data-format <format>',
      'Switches if the data should be emitted as an object or a string',
    )
      .choices(['text', 'json'])
      .default('text'),
  )
  .description('Emits a notification with the specified body')
  .showHelpAfterError(true);

extendBaseCommand(cmd);

type Params = {
  dataFormat: string;
};

cmd.action(async (topic: string, data: string, options: Options<Params>) => {
  await MdsSdk.initialize(options.env);
  const client = await MdsSdk.getNotificationServiceClient();
  try {
    const formattedData =
      options.dataFormat === 'json' ? JSON.parse(data || '{}') : data;
    await client.emit(topic, formattedData);
    display('Message emit successfully');
  } catch (err) {
    display('An error occurred while emitting your message');
    display(stringifyForDisplay(err.message || err));
  } finally {
    client.close();
  }
});

cmd.parseAsync(process.argv);
