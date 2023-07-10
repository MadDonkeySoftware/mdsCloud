#!/usr/bin/env node
// NOTE: the above is intentionally using node since that is the proper value after transpilation

import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { createCommand, createOption } from 'commander';
import { Options } from '../../types';
import { display, extendBaseCommand, stringifyForDisplay } from '../../utils';

const cmd = createCommand();
cmd
  .name('update')
  .argument('<orid>', 'The ORID of the function to update')
  .addOption(
    createOption(
      '--runtime <runtime>',
      'The runtime to use for the function',
    ).makeOptionMandatory(true),
  )
  .addOption(
    createOption(
      '--entryPoint <entryPoint>',
      'The path to the source file and method to invoke. Use "foo/bar:method" format.',
    ).makeOptionMandatory(true),
  )
  .addOption(
    createOption(
      '--source <source>',
      'Path to an archive (zip) or folder that will be uploaded to the function.',
    ).makeOptionMandatory(true),
  )
  .addOption(
    createOption(
      '--context <context>',
      'A string containing whatever context data this function should run with',
    ),
  )
  .description('Gets details for the specified serverless function')
  .showHelpAfterError(true);

extendBaseCommand(cmd);

type Params = {
  runtime: string;
  entryPoint: string;
  source: string;
  context?: string;
};

cmd.action(async (orid: string, options: Options<Params>) => {
  await MdsSdk.initialize(options.env);
  const client = await MdsSdk.getServerlessFunctionsClient();

  try {
    const result = await client.updateFunctionCode(
      orid,
      options.runtime,
      options.entryPoint,
      options.source,
      options.context,
    );

    display('Function updated successfully');
    display(stringifyForDisplay(result));
  } catch (err) {
    display('An error occurred while updating the serverless function');
    display(stringifyForDisplay(err.message || err));
  }
});

cmd.parseAsync(process.argv);
