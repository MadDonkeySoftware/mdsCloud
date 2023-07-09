#!/usr/bin/env node
// NOTE: the above is intentionally using node since that is the proper value after transpilation

import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { createCommand } from 'commander';
import { RegisterUser } from '../../lib/register-user';
import { Options } from '../../types';
import { display, extendBaseCommand, stringifyForDisplay } from '../../utils';

const cmd = createCommand();
cmd
  .name('register')
  .description('Runs a wizard for new account creation and CLI configuration.')
  .showHelpAfterError(true);

extendBaseCommand(cmd);

cmd.action(async (options: Options) => {
  try {
    await MdsSdk.initialize(options.env);
    const client = await MdsSdk.getIdentityServiceClient();
    await client.getPublicSignature();
  } catch (err) {
    display(
      'An error occurred while attempting to verify contact with the identity service.',
    );
    display(stringifyForDisplay(err.message || err));
    return;
  }

  try {
    const results = await RegisterUser();
    display(
      `Registration successful! Your account Id is: ${results.accountId}`,
    );
  } catch (err) {
    display('An error occurred while registering.');
    display(stringifyForDisplay(err.message || err));
  }
});

cmd.parseAsync(process.argv);
