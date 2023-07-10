import { Command, createOption } from 'commander';
import { getDefaultEnv } from './get-default-env';

export function extendBaseCommand(command: Command) {
  const opt = createOption(
    '--env <envName>',
    'The environment to utilize for this operation',
  )
    .default(getDefaultEnv())
    .env('MDS_ENV');
  command.addOption(opt);
}
