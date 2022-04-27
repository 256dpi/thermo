import { helper } from '@ember/component/helper';
import { get } from '@ember/object';

export function changesetDirty([value, key]) {
  return value.change ? get(value.change, key) !== undefined : false;
}

export default helper(changesetDirty);
