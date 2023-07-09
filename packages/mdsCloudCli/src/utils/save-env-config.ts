import { homedir } from 'os';
import { join } from 'path';
import { mkdir, writeFile } from 'fs/promises';
import { getEnvConfig } from './get-env-config';
import { mergeSetting } from './merge-setting';

const settingDir = join(homedir(), '.mds');

export async function saveEnvConfig(
  name: string,
  settings: Record<string, unknown> = { qsUrl: null, smUrl: null },
) {
  const file = join(settingDir, `${name}.json`);

  await mkdir(settingDir, { recursive: true });
  const conf = await getEnvConfig(name);
  const newSettings = await mergeSetting(conf, settings);
  return writeFile(file, JSON.stringify(newSettings, null, '\t'));
}
