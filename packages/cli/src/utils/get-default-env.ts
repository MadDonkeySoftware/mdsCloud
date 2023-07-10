import { homedir } from 'os';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';
import * as IN_PROC_CACHE from './in-proc-cache';

const envFileName = 'selectedEnv';
const settingDir = join(homedir(), '.mds');

export function getDefaultEnv(): string {
  // TODO: look into making async
  const cacheKey = 'getDefaultEnv';
  const cacheVal = IN_PROC_CACHE.get(cacheKey);
  if (cacheVal) {
    return cacheVal as string;
  }

  const file = join(settingDir, envFileName);
  if (existsSync(file)) {
    const data = readFileSync(file);
    if (data) {
      // Trim just in case the file was edited by the user.
      IN_PROC_CACHE.set(cacheKey, data.toString().trim());
      return IN_PROC_CACHE.get(cacheKey) as string;
    }
  }

  return 'default';
}
