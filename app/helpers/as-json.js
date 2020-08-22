import { helper } from '@ember/component/helper';

export function asJson(params) {
  return JSON.stringify(params[0], null, '  ');
}

export default helper(asJson);
