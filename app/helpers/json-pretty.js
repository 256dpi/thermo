import { helper } from '@ember/component/helper';

export function jsonPretty([value]) {
  return JSON.stringify(value, null, '  ');
}

export default helper(jsonPretty);
