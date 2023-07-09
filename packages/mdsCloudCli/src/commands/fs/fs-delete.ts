#!/usr/bin/env node
// NOTE: the above is intentionally using node since that is the proper value after transpilation

import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { createCommand } from 'commander';
import { Options } from '../../types';
import { display, extendBaseCommand, stringifyForDisplay } from '../../utils';

const cmd = createCommand();
cmd
  .name('delete')
  .argument(
    '<containerOrFile>',
    'The ORID of the container or the container path that you wish to delete.',
  )
  .description(
    'Removes a container or a file. Ex "orid:1:mdsCloud:::1234:fs:test" to remove the container named "test" or "orid:1:mdsCloud:::1234:fs:test/Foo" to remove the file "Foo" from the container "test."',
  )
  .showHelpAfterError(true);

extendBaseCommand(cmd);

cmd.action(async (containerOrFile: string, options: Options) => {
  try {
    await MdsSdk.initialize(options.env);
    const client = await MdsSdk.getFileServiceClient();
    await client.deleteContainerOrPath(containerOrFile);

    display('Container or file removed successfully.');
  } catch (err) {
    display('An error occurred while removing the container or file.');
    display(stringifyForDisplay(err.message || err));
  }
});

cmd.parseAsync(process.argv);
