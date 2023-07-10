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
  .name('length')
  .argument('<queues...>', 'The orid of the queues to check')
  .description('Get the length of the various queues')
  .showHelpAfterError(true);

extendBaseCommand(cmd);

cmd.action(async (queueOrids: string[], options: Options) => {
  await MdsSdk.initialize(options.env);
  const client = await MdsSdk.getQueueServiceClient();

  try {
    // Get the details from the various queues
    const results = await Promise.all(
      queueOrids.map(async (queueOrid) => {
        try {
          const result = await client.getQueueLength(queueOrid);
          return {
            orid: queueOrid,
            size: result.size,
          };
        } catch (err) {
          return {
            orid: queueOrid,
            size: err.message,
          };
        }
      }),
    );

    if (results.length > 1) {
      const headers = ['Queue', 'Size'];
      const rows = results.map((metadata) => [metadata.orid, metadata.size]);
      displayTable(rows, headers);
    } else {
      display(`${results[0].size}`);
    }
  } catch (err) {
    display('An error occurred while requesting the queue length(s).');
    display(stringifyForDisplay(err.message || err));
  }
});

cmd.parseAsync(process.argv);
