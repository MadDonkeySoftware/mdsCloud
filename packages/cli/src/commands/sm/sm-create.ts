#!/usr/bin/env node
// NOTE: the above is intentionally using node since that is the proper value after transpilation

import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { createCommand } from 'commander';
import { readFile } from 'fs/promises';
import { Options } from '../../types';
import { display, extendBaseCommand, stringifyForDisplay } from '../../utils';

const cmd = createCommand();
cmd
  .name('create')
  .argument('<file>', 'The state machine definition file')
  .description('Create a new state machine from the specified definition')
  .showHelpAfterError(true);

extendBaseCommand(cmd);

cmd.action(async (file: string, options: Options) => {
  await MdsSdk.initialize(options.env);
  const client = await MdsSdk.getStateMachineServiceClient();

  try {
    const fileBody = await readFile(file);
    const result = await client.createStateMachine(fileBody.toString());
    display(`State machine created successfully. ${result.orid}`);
  } catch (err) {
    display('An error occurred while creating the state machine');
    display(stringifyForDisplay(err.message || err));
  }
});

cmd.parseAsync(process.argv);
