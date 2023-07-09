import { merge } from 'lodash';
import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import prompts from 'prompts';

interface RegistrationAnswers {
  friendlyName: string;
  userId: string;
  email: string;
  password: string;
  password2: string;
  accountName: string;
}

async function collectInfo(): Promise<RegistrationAnswers> {
  const questions = [
    {
      name: 'friendlyName',
      message: 'What should I call you',
      type: 'text',
    },
    {
      name: 'userId',
      message: 'Enter your desired user name',
      type: 'text',
    },
    {
      name: 'email',
      message: 'Enter your account recovery email address',
      type: 'text',
    },
    {
      name: 'password',
      message: 'Enter your desired password',
      type: 'password',
    },
    {
      name: 'password2',
      message: 'Confirm your desired password',
      type: 'password',
    },
    {
      name: 'accountName',
      message: 'Enter a friendly name for your account',
      type: 'text',
    },
  ] as prompts.PromptObject[];

  const answers = await prompts(questions);
  return answers as RegistrationAnswers;
}

function validateData(answers: RegistrationAnswers): RegistrationAnswers {
  // TODO: see about using prompts validate hooks
  if (!answers.friendlyName) {
    throw new Error(
      'Friendly name (What should I call you) appears to be blank.',
    );
  }

  if (!answers.userId) {
    throw new Error('Authentication user name appears to be blank.');
  }

  if (!answers.email) {
    throw new Error('Recovery email address appears to be blank.');
  }

  if (!answers.password) {
    throw new Error('Password appears to be blank.');
  }

  if (answers.password !== answers.password2) {
    throw new Error('Passwords do not match');
  }

  if (!answers.accountName) {
    throw new Error('Account name appears to be blank.');
  }

  return answers;
}

async function submitRegistration(answers: RegistrationAnswers) {
  const client = await MdsSdk.getIdentityServiceClient();
  return client.register(answers).then((resp) => merge({}, answers, resp));
}

type RegistrationResult = {
  accountId: string;
  friendlyName: string;
  userId: string;
  email: string;
  password: string;
  password2: string;
  accountName: string;
};

export async function RegisterUser(): Promise<RegistrationResult> {
  const answers = await collectInfo();
  await validateData(answers);
  return await submitRegistration(answers);
}
