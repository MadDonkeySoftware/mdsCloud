#!/usr/bin/env node
// NOTE: the above is intentionally using node since that is the proper value after transpilation

import { createCommand } from 'commander';

const cmd = createCommand();
cmd
  .name('sf')
  .description('Interact with the MDS serverless function service')
  .executableDir('sf')
  .command('create', 'Creates a new serverless function')
  .command('delete', 'Removes the serverless function with the supplied id')
  .command('details', 'Get the details of the specified serverless function')
  .command(
    'invoke',
    'Invokes an execution of the specified serverless function',
  )
  .command('list', 'Gets the list of available serverless functions')
  .command('update', 'Updates the specified serverless function');

cmd.parse(process.argv);
