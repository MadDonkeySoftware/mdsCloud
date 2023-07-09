#!/usr/bin/env node
// NOTE: the above is intentionally using node since that is the proper value after transpilation

import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { createCommand } from 'commander';
import { Options } from '../../types';
import { display, extendBaseCommand, stringifyForDisplay } from '../../utils';

const cmd = createCommand();
cmd
  .name('token')
  .description('Retrieves the identity token for the user and environment')
  .showHelpAfterError(true);

extendBaseCommand(cmd);

cmd.action(async (options: Options) => {
  try {
    await MdsSdk.initialize(options.env);
    const client = await MdsSdk.getIdentityServiceClient();
    const token = await client.authenticate({
      accountId: null,
      password: null,
      userId: null,
    });
    display(token);
  } catch (err) {
    display('An error occurred while obtaining the token.');
    display(stringifyForDisplay(err.message || err));
  }
});

cmd.parseAsync(process.argv);
