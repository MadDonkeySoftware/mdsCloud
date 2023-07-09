#!/usr/bin/env node
// NOTE: the above is intentionally using node since that is the proper value after transpilation

import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { createCommand } from 'commander';
import { readFile } from 'fs/promises';
import { Options } from '../../types';
import { display, extendBaseCommand, stringifyForDisplay } from '../../utils';

const cmd = createCommand();
cmd
  .name('update')
  .argument('<orid>', 'The ORID of the state machine to update')
  .argument('<file>', 'The state machine definition file')
  .description(
    'Updates the specified state machine with the provided definition',
  )
  .showHelpAfterError(true);

extendBaseCommand(cmd);

cmd.action(async (orid: string, file: string, options: Options) => {
  await MdsSdk.initialize(options.env);
  const client = await MdsSdk.getStateMachineServiceClient();

  try {
    const fileBody = await readFile(file);
    await client.updateStateMachine(orid, fileBody.toString());

    display('State machine updated successfully.');
  } catch (err) {
    display('An error occurred while updating the state machine');
    display(stringifyForDisplay(err.message || err));
  }
});

cmd.parseAsync(process.argv);
