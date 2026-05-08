import { helper } from '@ember/component/helper';

export function scopeActive([scope, filter]) {
  const a = (scope && scope.filter) || {};
  const b = filter || {};
  const ak = Object.keys(a);
  const bk = Object.keys(b);
  if (ak.length !== bk.length) {
    return false;
  }
  for (const k of ak) {
    if (a[k] !== b[k]) {
      return false;
    }
  }
  return true;
}

export default helper(scopeActive);
