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
  .description('Get the list of available serverless functions')
  .showHelpAfterError(true);

extendBaseCommand(cmd);

cmd.action(async (orid: string, options: Options) => {
  await MdsSdk.initialize(options.env);
  const client = await MdsSdk.getServerlessFunctionsClient();

  try {
    const results = await client.listFunctions();
    const headers = ['Name', 'ORID'];
    const rows = results
      .sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      })
      .map((metadata) => [metadata.name, metadata.orid]);
    displayTable(rows, headers);
  } catch (err) {
    display(
      'An error occurred while requesting the list of serverless functions',
    );
    display(stringifyForDisplay(err.message || err));
  }
});

cmd.parseAsync(process.argv);
