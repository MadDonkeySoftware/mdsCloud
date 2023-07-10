import { EOL } from 'os';

export function display(msg: string, suppressEol = false) {
  process.stdout.write(msg);

  if (!suppressEol) {
    process.stdout.write(EOL);
  }
}
