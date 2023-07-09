#!/usr/bin/env node
// NOTE: the above is intentionally using node since that is the proper value after transpilation

import { createCommand } from 'commander';

const cmd = createCommand();
cmd
  .name('fs')
  .description('Interact with the MDS file service')
  .executableDir('fs')
  .command('containers', 'Get the list of available containers')
  .command('create', 'Create a new container')
  .command('createPath', 'Creates a new path inside of a container')
  .command('delete', 'Removes a container or a file.')
  .command('download', 'Download a file from the specified container path')
  .command('list', 'Gets details of container or container path contents')
  .command('upload', 'Uploads a file to the specified container and path');

cmd.parse(process.argv);
