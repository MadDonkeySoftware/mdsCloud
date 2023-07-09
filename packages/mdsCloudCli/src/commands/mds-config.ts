#!/usr/bin/env node
// NOTE: the above is intentionally using node since that is the proper value after transpilation

import { createCommand } from 'commander';

const cmd = createCommand();
cmd
  .name('config')
  .description('Configures your system for various MDS services.')
  .executableDir('config')
  .command('inspect', 'Inspects a config detail')
  .command('wizard', 'Collects and writes all config details')
  .command('write', 'Writes a config detail');

cmd.parse(process.argv);
