import { helper } from '@ember/component/helper';

export function jsonExcerpt([value, length = 32]) {
  const str = JSON.stringify(value) || '';
  if (str.length > length) {
    return str.substring(0, length) + '…';
  }
  return str;
}

export default helper(jsonExcerpt);
