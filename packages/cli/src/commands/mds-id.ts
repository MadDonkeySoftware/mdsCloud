#!/usr/bin/env node
// NOTE: the above is intentionally using node since that is the proper value after transpilation

import { createCommand } from 'commander';

const cmd = createCommand();
cmd
  .name('id')
  .description('Interact with the MDS identity service')
  .executableDir('id')
  .command(
    'register',
    'Runs a wizard for new account creation and CLI configuration.',
  )
  // TODO: Move token command to under "dev" command
  .command(
    'token',
    'Retrieves the identity token for the user and environment',
    { hidden: !process.env.MDS_CLI_SHOW_HIDDEN },
  )
  .command('update', 'Updates various aspects of the users information');

cmd.parse(process.argv);
