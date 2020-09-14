import { helper } from '@ember/component/helper';
import { guidFor as _guidFor } from '@ember/object/internals';

export function guidFor([object]) {
  return _guidFor(object);
}

export default helper(guidFor);
