#!/usr/bin/env node
// NOTE: the above is intentionally using node since that is the proper value after transpilation

import { createCommand } from 'commander';
import { union } from 'lodash';
import { EOL } from 'os';
import {
  display,
  listEnvs,
  setDefaultEnv,
  stringifyForDisplay,
} from '../../utils';

const cmd = createCommand();
cmd
  .name('set')
  .argument('<env>', 'The new default environment name')
  .description('Sets the default environment to execute commands against')
  .showHelpAfterError(true);

cmd.action(async (env: string) => {
  try {
    const envs = await listEnvs();
    const exists = union(envs, ['default']).indexOf(env) !== -1;

    if (exists) {
      await setDefaultEnv(env);
      display(`Default environment updated to "${env}" successfully.`);
    } else {
      display(
        `Could not find environment "${env}" configured on this system. Please verify the environment exists with the "list" command.`,
      );
    }
  } catch (err) {
    display(`Failed to update environment.${EOL}`);
    display(stringifyForDisplay(err));
  }
});

cmd.parseAsync(process.argv);
