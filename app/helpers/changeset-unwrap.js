import { helper } from '@ember/component/helper';

export function changesetUnwrap([value]) {
  return value?.unwrap ? value.unwrap() : value;
}

export default helper(changesetUnwrap);
