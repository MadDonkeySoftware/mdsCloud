#!/usr/bin/env node
// NOTE: the above is intentionally using node since that is the proper value after transpilation

import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { ContainerPathContents } from '@maddonkeysoftware/mds-cloud-sdk-node/dist/types';
import { createCommand, createOption } from 'commander';
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
  .argument(
    '<oridPath>',
    'The ORID of the container, or container path, that you wish to display.',
  )
  .addOption(
    createOption('-m, --output-mode <mode>', 'Methodology to output results')
      .choices(['pretty', 'json'])
      .default('pretty'),
  )
  .description('Gets the details of the <oridPath> contents')
  .showHelpAfterError(true);

extendBaseCommand(cmd);

type Params = {
  mode: string;
};

cmd.action(async (oridPath: string, options: Options<Params>) => {
  try {
    await MdsSdk.initialize(options.env);
    const client = await MdsSdk.getFileServiceClient();
    const results = await client.listContainerContents(oridPath);

    if (results) {
      switch (options.mode) {
        case 'pretty':
          processResultsForTableDisplay(results);
          break;
        default:
          display(JSON.stringify(results, null, 2));
          break;
      }
    } else {
      display('Empty');
    }
  } catch (err) {
    display(
      'An error occurred while requesting the details of the container or path.',
    );
    display(stringifyForDisplay(err.message || err));
  }
});

function processResultsForTableDisplay(results: ContainerPathContents) {
  const headers = ['Type', 'Name', 'ORID'];
  const rows = [];
  results.directories.forEach((d) => {
    rows.push(['Directory', d.name, d.orid]);
  });
  results.files.forEach((f) => {
    rows.push(['File', f.name, f.orid]);
  });

  if (rows.length > 0) {
    displayTable(rows, headers);
  } else {
    display('Empty');
  }
}

cmd.parseAsync(process.argv);
