import { homedir } from 'os';
import { join } from 'path';
import { mkdir, writeFile } from 'fs/promises';
const envFileName = 'selectedEnv';
const settingDir = join(homedir(), '.mds');

export async function setDefaultEnv(name: string) {
  const file = join(settingDir, envFileName);

  await mkdir(settingDir, { recursive: true });
  return writeFile(file, name);
}
