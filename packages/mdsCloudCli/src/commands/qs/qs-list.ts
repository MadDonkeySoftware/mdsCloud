#!/usr/bin/env node
// NOTE: the above is intentionally using node since that is the proper value after transpilation

import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { createCommand } from 'commander';
import { Options } from '../../types';
import {
  display,
  displayTable,
  extendBaseCommand,
  stringifyForDisplay,
} from '../../utils';

const cmd = createCommand();
cmd
  .name('list')
  .description('Gets the list of available queues')
  .showHelpAfterError(true);

extendBaseCommand(cmd);

cmd.action(async (options: Options) => {
  await MdsSdk.initialize(options.env);
  const client = await MdsSdk.getQueueServiceClient();

  try {
    const results = await client.listQueues();
    const headers = ['Name', 'ORID'];
    const rows = results.map((metadata) => [metadata.name, metadata.orid]);
    displayTable(rows, headers);
  } catch (err) {
    display('An error occurred while requesting the list of queues.');
    display(stringifyForDisplay(err.message || err));
  }
});

cmd.parseAsync(process.argv);
