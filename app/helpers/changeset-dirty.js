import { helper } from '@ember/component/helper';

export function changesetDirty([value, key]) {
  if (key) {
    return value.changes.filter((change) => change.key === key).length > 0;
  } else {
    return value.changes?.length > 0;
  }
}

export default helper(changesetDirty);
