#!/usr/bin/env node
// NOTE: the above is intentionally using node since that is the proper value after transpilation

import { createCommand } from 'commander';

const cmd = createCommand();
cmd
  .name('ns')
  .description('Interact with the MDS notification service')
  .executableDir('ns')
  .command(
    'emit',
    'Emits a notification with the specified body to the specified topic',
  )
  .command(
    'watch',
    'Watches a list of topics for events and displays them to the console',
  );

cmd.parse(process.argv);
