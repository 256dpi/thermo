import Transform from '@ember-data/serializer/transform';
import { A } from '@ember/array';

export default class FileLinksTransform extends Transform {
  serialize(values) {
    // check null
    if (!values) {
      return [];
    }

    return values.toArray();
  }

  deserialize(values) {
    // check null
    if (!values) {
      return A([]);
    }

    return A(values);
  }
}
