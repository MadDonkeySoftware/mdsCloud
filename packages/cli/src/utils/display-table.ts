import Table from 'cli-table';
import { display } from './display';

export function displayTable(rows, headers: string[] = []) {
  const table = new Table({
    head: headers,
    chars: {
      top: '',
      'top-mid': '',
      'top-left': '',
      'top-right': '',
      bottom: '',
      'bottom-mid': '',
      'bottom-left': '',
      'bottom-right': '',
      left: '',
      'left-mid': '',
      mid: '',
      'mid-mid': '',
      right: '',
      'right-mid': '',
      middle: ' ',
    },
    style: { 'padding-left': 0, 'padding-right': 0 },
  });

  rows.forEach((e) => table.push(e));

  display(table.toString());
}
