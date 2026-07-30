import { StringUtils } from './string-utils';
import { GroupingChanges, ChangeType } from './change.interface';

export class ChangeUtils {
  static findChanges(
    obj1: any[],
    obj2: any[],
    ignoreKeys: string[] = []
  ): GroupingChanges {
    const items: GroupingChanges = {
      added: [],
      deleted: [],
      modified: []
    };

    if (!obj1 || !obj2) {
      return items;
    }

    // Row matching used to be O(n^2): a linear findIndex() + splice() per item in obj1.
    // Index obj2 by id once (O(n)) so each obj1 item is matched/consumed in O(1); the
    // Map also naturally preserves obj2's original order for whatever's left over
    // (the "added" items), same as the old splice-and-collect-remainder approach.
    const obj2ById = new Map<any, any>();
    for (const item of obj2) {
      obj2ById.set(item.id, item);
    }

    for (const fromItem of obj1) {
      const toItem = obj2ById.get(fromItem.id);

      if (toItem === undefined) {
        items.deleted.push({
          change: { type: ChangeType.DELETED },
          value: fromItem
        });
        continue;
      }
      obj2ById.delete(fromItem.id);

      const fromItemClone = JSON.parse(JSON.stringify(fromItem));
      const toItemClone = JSON.parse(JSON.stringify(toItem));

      const keysChanged = ChangeUtils.compareObject(
        fromItemClone,
        toItemClone,
        undefined,
        ignoreKeys
      );

      if (keysChanged.length) {
        items.modified.push({
          change: {
            type: ChangeType.MODIFIED,
            keysChanged
          },
          value: fromItemClone,
          oldValue: fromItem,
          newValue: toItem
        });
      }
    }

    items.added = Array.from(obj2ById.values()).map(itemAdded => {
      return {
        change: { type: ChangeType.ADDED },
        value: itemAdded
      };
    });

    return items;
  }

  private static compareObject(fromItem, toItem, baseKey?, ignoreKeys = []) {
    const keys: any = new Set([
      ...Object.keys(fromItem),
      ...Object.keys(toItem)
    ]);
    let keysChanged = [];
    keys.forEach(key => {
      const keyString = baseKey ? `${baseKey}.${key}` : key;
      if (ignoreKeys.indexOf(keyString) !== -1) {
        return;
      }

      // Capture each key's pre-mutation value before the array-join/StringUtils.diff
      // rewrites below, so keysChanged[].oldValue/newValue still reflect what was
      // actually there. This replaces the two full-object JSON.parse(JSON.stringify())
      // deep clones this function used to make on every call (redundant with the clone
      // findChanges() already made one level up, and repeated again at every recursion
      // level) with a cheap per-key reference/value capture.
      const originalFromValue = fromItem[key];
      const originalToValue = toItem[key];

      if (Array.isArray(fromItem[key])) {
        fromItem[key] = fromItem[key].join(',<br>');
      }
      if (Array.isArray(toItem[key])) {
        toItem[key] = toItem[key].join(',<br>');
      }

      if (
        typeof fromItem[key] === 'object' &&
        typeof toItem[key] === 'object' &&
        fromItem[key] !== null &&
        toItem[key] !== null
      ) {
        keysChanged = keysChanged.concat(
          this.compareObject(fromItem[key], toItem[key], keyString)
        );
      } else {
        if (fromItem[key] !== toItem[key]) {
          keysChanged.push({
            key: keyString,
            oldValue: originalFromValue,
            newValue: originalToValue
          });
          fromItem[key] = StringUtils.diff(fromItem[key], toItem[key]);
        }
      }
    });

    return keysChanged;
  }
}
