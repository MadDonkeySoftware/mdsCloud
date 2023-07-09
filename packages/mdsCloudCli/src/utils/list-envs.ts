import { homedir } from 'os';
import { join, extname } from 'path';
import { readdir } from 'fs/promises';
import { map } from 'lodash';

const settingDir = join(homedir(), '.mds');

export async function listEnvs(): Promise<string[]> {
  const files = await readdir(settingDir);
  const filteredFiles = files.filter(
    (file) => extname(file).toLowerCase() === '.json',
  );
  const envs = map(filteredFiles, (file) => file.split('.')[0]);
  return envs || [];
}
