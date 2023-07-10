#!/usr/bin/env node
// NOTE: the above is intentionally using node since that is the proper value after transpilation

import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { createCommand, createOption } from 'commander';
import prompts, { PromptObject } from 'prompts';
import { Options } from '../../types';
import { display, extendBaseCommand, stringifyForDisplay } from '../../utils';

const cmd = createCommand();
cmd
  .name('update')
  .addOption(
    createOption(
      '-p, --password',
      'Signals that a password update is requested',
    ),
  )
  .addOption(
    createOption(
      '-e, --email <email>',
      'The new email to associate with this user',
    ),
  )
  .addOption(
    createOption(
      '-n, --name <name>',
      'The new friendly name to associate with this user',
    ),
  )
  .description('Updates various aspects of your users information')
  .showHelpAfterError(true);

extendBaseCommand(cmd);

type Params = {
  password: boolean;
  email?: string;
  name?: string;
};

cmd.action(async (options: Options<Params>) => {
  await MdsSdk.initialize(options.env);
  const client = await MdsSdk.getIdentityServiceClient();
  const updatePayload: Record<string, unknown> = {};

  try {
    await client.getPublicSignature();
  } catch (err) {
    display(
      'An error occurred while attempting to verify contact with the identity service.',
    );
    display(stringifyForDisplay(err.message || err));
    return;
  }

  if (options.password) {
    const questions = [
      {
        name: 'oldPassword',
        message: 'Enter your current password',
        type: 'password',
      } as PromptObject,
      {
        name: 'password',
        message: 'Enter your desired password',
        type: 'password',
      } as PromptObject,
      {
        name: 'password2',
        message: 'Confirm your desired password',
        type: 'password',
      } as PromptObject,
    ];

    const answers = await prompts(questions);
    if (answers.password !== answers.password2) {
      display('Passwords did not match. Update aborted.');
      return;
    }

    updatePayload.newPassword = answers.password;
    updatePayload.oldPassword = answers.oldPassword;
  }

  if (options.email) {
    updatePayload.email = options.email;
  }

  if (options.name) {
    updatePayload.friendlyName = options.name;
  }

  try {
    if (Object.keys(updatePayload).length !== 0) {
      await client.updateUser(updatePayload);
      display('User updated successfully');
    } else {
      cmd.help();
    }
  } catch (err) {
    display('An error occurred while updating user information.');
    display(stringifyForDisplay(err.message || err));
  }
});

cmd.parseAsync(process.argv);
