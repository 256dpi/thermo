import { helper } from '@ember/component/helper';
import { get } from '@ember/object';

export function changesetDirty([value, key]) {
  console.log(value.change, key);
  return value.change ? get(value.change, key) != undefined : false;
}

export default helper(changesetDirty);
