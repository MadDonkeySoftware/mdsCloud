#!/usr/bin/env node
// NOTE: the above is intentionally using node since that is the proper value after transpilation

import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { createCommand } from 'commander';
import { Options } from '../../types';
import { display, extendBaseCommand, stringifyForDisplay } from '../../utils';

const cmd = createCommand();
cmd
  .name('execution')
  .argument('<orid>', 'The ORID of the state machine execution to inspect')
  .description('Gets details for the specified state machine execution')
  .showHelpAfterError(true);

extendBaseCommand(cmd);

cmd.action(async (orid: string, options: Options) => {
  await MdsSdk.initialize(options.env);
  const client = await MdsSdk.getStateMachineServiceClient();

  try {
    const result = await client.getDetailsForExecution(orid);
    const { operations } = result;
    const orderedOperations = operations.sort((a, b) => {
      return new Date(a.created).valueOf() - new Date(b.created).valueOf();
    });

    display(
      stringifyForDisplay({
        ...result,
        operations: orderedOperations,
      }),
    );
  } catch (err) {
    display(
      'An error occurred while requesting details of the state machine execution',
    );
    display(stringifyForDisplay(err.message || err));
  }
});

cmd.parseAsync(process.argv);
