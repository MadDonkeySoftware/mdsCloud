export function stringifyForDisplay(value: any): string {
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }

  return value;
}
