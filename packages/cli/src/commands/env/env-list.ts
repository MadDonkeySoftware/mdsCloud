#!/usr/bin/env node
// NOTE: the above is intentionally using node since that is the proper value after transpilation

import { createCommand } from 'commander';
import { union } from 'lodash';
import { EOL } from 'os';
import { display, listEnvs } from '../../utils';

const cmd = createCommand();
cmd
  .name('list')
  .description('Lists all the available environments')
  .showHelpAfterError(true);

cmd.action(async () => {
  const envs = await listEnvs();
  display(union(envs, ['default']).sort().join(EOL));
});

cmd.parseAsync(process.argv);
