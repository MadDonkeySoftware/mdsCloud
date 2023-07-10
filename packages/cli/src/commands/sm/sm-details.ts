#!/usr/bin/env node
// NOTE: the above is intentionally using node since that is the proper value after transpilation

import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { createCommand } from 'commander';
import { Options } from '../../types';
import { display, extendBaseCommand, stringifyForDisplay } from '../../utils';

const cmd = createCommand();
cmd
  .name('details')
  .argument('<orid>', 'The ORID of the state machine to inspect')
  .description('Gets details for the specified state machine')
  .showHelpAfterError(true);

extendBaseCommand(cmd);

cmd.action(async (orid: string, options: Options) => {
  await MdsSdk.initialize(options.env);
  const client = await MdsSdk.getStateMachineServiceClient();

  try {
    const result = await client.getStateMachine(orid);
    display(JSON.stringify(result, null, 2));
  } catch (err) {
    display('An error occurred while requesting details of the state machine');
    display(stringifyForDisplay(err.message || err));
  }
});

cmd.parseAsync(process.argv);
