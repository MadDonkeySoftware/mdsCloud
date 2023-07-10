import { join } from 'path';
import { homedir } from 'os';
import { existsSync, readFileSync, constants } from 'fs';
import { access, readFile } from 'fs/promises';
import * as IN_PROC_CACHE from './in-proc-cache';

const settingDir = join(homedir(), '.mds');

export function getEnvConfigSync<T>(name: string): T {
  const cacheKey = `getEnvConfig-${name}`;
  const cacheVal = IN_PROC_CACHE.get(cacheKey) as T;
  if (cacheVal) {
    return cacheVal;
  }

  const file = join(settingDir, `${name}.json`);
  if (name && existsSync(file)) {
    const body = readFileSync(file).toString();
    IN_PROC_CACHE.set(cacheKey, JSON.parse(body));
    return IN_PROC_CACHE.get(cacheKey) as T;
  }

  return null;
}

export async function getEnvConfig<T>(name: string): Promise<T> {
  const cacheKey = `getEnvConfig-${name}`;
  const cacheVal = IN_PROC_CACHE.get(cacheKey) as T;
  if (cacheVal) {
    return cacheVal;
  }

  const file = join(settingDir, `${name}.json`);
  if (name) {
    try {
      await access(file, constants.O_RDWR);
    } catch (err) {
      // Ignore the error. The file may not exist.
      return null;
    }

    const body = (await readFile(file)).toString();
    IN_PROC_CACHE.set(cacheKey, JSON.parse(body));
    return IN_PROC_CACHE.get(cacheKey) as T;
  }
}
