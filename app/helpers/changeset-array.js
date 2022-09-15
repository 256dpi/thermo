import { helper } from '@ember/component/helper';
import { A } from '@ember/array';
import ArrayProxy from '@ember/array/proxy';
import { Changeset } from 'ember-changeset';
import { isChangeset } from 'validated-changeset';

function changesetArray([changeset, path]) {
  // prepare changesets
  let changesets = A([]);

  // prepare updater
  const update = () => {
    // count virtuals
    const virtuals = changesets.reduce((state, changeset) => {
      return changeset.changesetArrayProxyVirtual ? state + 1 : state;
    }, 0);

    // determine removals
    const removals = changeset.data[path]?.length !== changesets.length - virtuals;

    // check array
    const pristine = changesets.reduce((state, changeset) => {
      return state && changeset.isPristine;
    }, true);

    // rollback or set changesets
    if (pristine && !removals && !virtuals) {
      changeset.rollbackProperty(path);
    } else {
      changeset.set(path, changesets);
    }
  };

  // prepare wrapper
  const wrap = (item, virtual) => {
    // unwrap our own proxies
    if (item.isChangesetArrayProxy) {
      virtual = item.changesetArrayProxyVirtual;
      item = item.changesetArrayProxyTarget;
    }

    // create changeset if not already
    if (!isChangeset(item)) {
      item = new Changeset(item);
    }

    return new Proxy(item, {
      get(target, key) {
        // handle internal keys
        switch (key.toString()) {
          case 'isChangesetArrayProxy':
            return true;
          case 'changesetArrayProxyTarget':
            return target;
          case 'changesetArrayProxyVirtual':
            return virtual;
        }

        // return target value
        return target.get(key.toString());
      },
      set(target, key, value) {
        // update value
        target.set(key.toString(), value);

        // update parent
        update();

        return true;
      },
    });
  };

  // create changesets
  changesets = A(
    (changeset.get(path) || []).map((item) => {
      return wrap(item, false);
    })
  );

  return ArrayProxy.create({
    content: changesets,
    replaceContent(index, remove, insert) {
      // apply change to changesets
      changesets.replace(
        index,
        remove,
        insert.map((item) => {
          return wrap(item, true);
        })
      );

      // update parent
      update();
    },
  });
}

export default helper(changesetArray);
