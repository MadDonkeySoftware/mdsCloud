#!/usr/bin/env node
// NOTE: the above is intentionally using node since that is the proper value after transpilation

import { createCommand } from 'commander';

const cmd = createCommand();
cmd
  .name('env')
  .description('Inspect or adjust mds CLI environments.')
  .executableDir('env')
  .command('list', 'List all available environments')
  .command('print', 'Prints the currently configured default environment')
  .command('set', 'Sets the default environment');

cmd.parse(process.argv);
