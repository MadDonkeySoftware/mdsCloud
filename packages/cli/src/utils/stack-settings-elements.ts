export type StackSettingsElement = {
  key: string;
  displayPrompt: string;
  queryPrompt: string;
  isSourceDir: boolean;
  isSecret: boolean;
  displayOrder: number;
};

export const STACK_SETTINGS_ELEMENTS: StackSettingsElement[] = [
  {
    key: 'mdsCloudSourceDirectory',
    queryPrompt:
      'What folder does the "package.json" for mdsCloud (the mono-repo) reside in on your local system?',
    displayPrompt: 'Root Source Directory',
    isSourceDir: true,
    isSecret: false,
    displayOrder: 1,
  },
  {
    key: 'defaultAdminPassword',
    queryPrompt:
      'What default admin password would you like to use for your local stack?',
    displayPrompt: 'Default Admin Password',
    isSourceDir: false,
    isSecret: true,
    displayOrder: 2,
  },
];
