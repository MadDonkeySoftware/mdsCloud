#!/usr/bin/env node
// NOTE: the above is intentionally using node since that is the proper value after transpilation

import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { createCommand, createOption } from 'commander';
import { Options } from '../../types';
import { display, extendBaseCommand, stringifyForDisplay } from '../../utils';

const cmd = createCommand();
cmd
  .name('invoke')
  .argument('<orid>', 'The ORID of the function to invoke')
  .addOption(
    createOption(
      '--runAsync',
      'Flag to run the function asynchronously, omit to run while waiting for a result.',
    ),
  )
  .addOption(
    createOption('--input <input>', 'Input to be passed to the function'),
  )
  .addOption(
    createOption(
      '--inputType <inputType>',
      'Input type to be supplied to the function. Use object for JSON object formatting',
    )
      .choices(['string', 'object'])
      .default('string'),
  )
  .description('Gets details for the specified serverless function')
  .showHelpAfterError(true);

extendBaseCommand(cmd);

type Params = {
  runAsync: boolean;
  input?: string;
  inputType: string;
};

cmd.action(async (orid: string, options: Options<Params>) => {
  await MdsSdk.initialize(options.env);
  const client = await MdsSdk.getServerlessFunctionsClient();

  try {
    const input: unknown =
      options.inputType === 'object'
        ? JSON.parse(options.input)
        : options.input;
    const result = await client.invokeFunction(orid, input, options.runAsync);
    if (options.runAsync) {
      display('Function invoked successfully');
    } else {
      display(stringifyForDisplay(result));
    }
  } catch (err) {
    display('An error occurred while invoking the serverless function');
    display(stringifyForDisplay(err.message || err));
  }
});

cmd.parseAsync(process.argv);
