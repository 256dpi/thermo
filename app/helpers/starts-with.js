import { helper } from '@ember/component/helper';

export function startsWith([str, prefix]) {
  return str.startsWith(prefix);
}

export default helper(startsWith);
