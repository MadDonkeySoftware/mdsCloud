#!/usr/bin/env node
// NOTE: the above is intentionally using node since that is the proper value after transpilation

import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { ContainerListItem } from '@maddonkeysoftware/mds-cloud-sdk-node/dist/types';
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
  .name('containers')
  .description('Gets the list of available containers')
  .showHelpAfterError(true);

extendBaseCommand(cmd);

cmd.action(async (options: Options) => {
  try {
    await MdsSdk.initialize(options.env);
    const client = await MdsSdk.getFileServiceClient();
    const containers = await client.listContainers();

    const containerSorter = (a: ContainerListItem, b: ContainerListItem) => {
      if (a.name.toUpperCase() > b.name.toUpperCase()) return 1;
      if (a.name.toUpperCase() < b.name.toUpperCase()) return -1;
      return 0;
    };

    containers.sort(containerSorter);

    if (containers.length > 0) {
      const headers = ['Name', 'ORID'];
      const rows = [];
      containers.forEach((container) => {
        rows.push([container.name, container.orid]);
      });

      displayTable(rows, headers);
    } else {
      display('No containers found.');
    }
  } catch (err) {
    display('An error occurred while requesting the list of containers.');
    display(stringifyForDisplay(err.message || err));
  }
});

cmd.parseAsync(process.argv);
