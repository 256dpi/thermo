import { helper } from '@ember/component/helper';

export function changesetDirty([value, key]) {
  return value.changes.filter((change) => change.key === key).length > 0;
}

export default helper(changesetDirty);
