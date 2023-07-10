#!/usr/bin/env node
// NOTE: the above is intentionally using node since that is the proper value after transpilation

import { createCommand } from 'commander';

const cmd = createCommand();
cmd
  .name('qs')
  .description('Interact with the MDS queue service')
  .executableDir('qs')
  .command('create', 'Creates a new queue')
  .command('delete', 'Removes a queue')
  .command('details', 'Get the details of the specified queue')
  .command('enqueueMessage', 'Adds a new message to the specified queue')
  .command('length', 'Gets the length of the specified queue')
  .command('list', 'Gets a list of available queues')
  .command('update', 'Updates metadata for the specified queue');

cmd.parse(process.argv);
