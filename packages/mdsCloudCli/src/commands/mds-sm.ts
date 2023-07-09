#!/usr/bin/env node
// NOTE: the above is intentionally using node since that is the proper value after transpilation

import { createCommand } from 'commander';

const cmd = createCommand();
cmd
  .name('sm')
  .description('Interact with the MDS state machine service')
  .executableDir('sm')
  .command('create', 'Creates a new state machine')
  .command('delete', 'Removes the state machine with the supplied id')
  .command('details', 'Get the details of the specified state machine')
  .command('execution', 'Gets the details of the specified execution')
  .command('invoke', 'Invokes an execution of the specified state machine')
  .command('list', 'Gets the list of available state machines')
  .command('update', 'Updates the specified state machine');

cmd.parse(process.argv);
