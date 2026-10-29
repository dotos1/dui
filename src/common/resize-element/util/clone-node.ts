/**
 * Creates a deep clone of an element.
 * @zh 执行 `deepCloneNode`，用于深度克隆节点。
 */
export function deepCloneNode(node: HTMLElement): HTMLElement {
  const clone = node.cloneNode(true) as HTMLElement;
  const descendantsWithId = clone.querySelectorAll('[id]');
  const nodeName = node.nodeName.toLowerCase();

  // Remove the `id` to avoid having multiple elements with the same id on the page.
  clone.removeAttribute('id');

  descendantsWithId.forEach((descendant) => {
    descendant.removeAttribute('id');
  });

  if (nodeName === 'canvas') {
    transferCanvasData(node as HTMLCanvasElement, clone as HTMLCanvasElement);
  } else if (
    nodeName === 'input' ||
    nodeName === 'select' ||
    nodeName === 'textarea'
  ) {
    transferInputData(node as HTMLInputElement, clone as HTMLInputElement);
  }

  transferData('canvas', node, clone, transferCanvasData);
  transferData('input, textarea, select', node, clone, transferInputData);
  return clone;
}

/**
 * Matches elements between an element and its clone and allows for their data to be cloned.
 * @zh 执行 `transferData`，用于转移数据。
 */
function transferData<T extends Element>(
  selector: string,
  node: HTMLElement,
  clone: HTMLElement,
  callback: (source: T, clone: T) => void
) {
  const descendantElements = node.querySelectorAll<T>(selector);

  if (descendantElements.length) {
    const cloneElements = clone.querySelectorAll<T>(selector);

    for (let i = 0; i < descendantElements.length; i++) {
      callback(descendantElements[i], cloneElements[i]);
    }
  }
}

// Counter for unique cloned radio button names.
/**
 * Constant/variable `cloneUniqueId` defining clone unique id in `src/common/resize-element/util`.
 * @zh 常量/变量 `cloneUniqueId`，定义 `src/common/resize-element/util` 中的克隆唯一唯一标识。
 */
let cloneUniqueId = 0;

/**
 * Transfers the data of one input element to another.
 * @zh 执行 `transferInputData`，用于转移输入属性数据。
 */
function transferInputData(
  source: Element & { value: string },
  clone: Element & { value: string; name: string; type: string }
) {
  // Browsers throw an error when assigning the value of a file input programmatically.
  if (clone.type !== 'file') {
    clone.value = source.value;
  }

  // Radio button `name` attributes must be unique for radio button groups
  // otherwise original radio buttons can lose their checked state
  // once the clone is inserted in the DOM.
  if (clone.type === 'radio' && clone.name) {
    clone.name = `mat-clone-${clone.name}-${cloneUniqueId++}`;
  }
}

/**
 * Transfers the data of one canvas element to another.
 * @zh 执行 `transferCanvasData`，用于转移画布数据。
 */
function transferCanvasData(
  source: HTMLCanvasElement,
  clone: HTMLCanvasElement
) {
  const context = clone.getContext('2d');

  if (context) {
    // In some cases `drawImage` can throw (e.g. if the canvas size is 0x0).
    // We can't do much about it so just ignore the error.
    try {
      context.drawImage(source, 0, 0);
    } catch {}
  }
}
