#!/usr/bin/env node
// NOTE: the above is intentionally using node since that is the proper value after transpilation

import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { createCommand } from 'commander';
import { Options } from '../../types';
import { display, extendBaseCommand, stringifyForDisplay } from '../../utils';

const cmd = createCommand();
cmd
  .name('delete')
  .argument('<orid>', 'The ORID of the state machine to remove')
  .description('Removes the state machine for the provided ORID')
  .showHelpAfterError(true);

extendBaseCommand(cmd);

cmd.action(async (orid: string, options: Options) => {
  await MdsSdk.initialize(options.env);
  const client = await MdsSdk.getStateMachineServiceClient();

  try {
    const result = await client.deleteStateMachine(orid);
    display(`State machine removed successfully. ${result.orid}`);
  } catch (err) {
    display('An error occurred while removing the state machine');
    display(stringifyForDisplay(err.message || err));
  }
});

cmd.parseAsync(process.argv);
