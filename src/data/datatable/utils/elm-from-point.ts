/**
 * @fileoverview Module `src/data/datatable/utils/elm-from-point.ts` providing elm from point definitions and implementation.
 * @zh 模块文件 `src/data/datatable/utils/elm-from-point.ts`，提供elm从坐标点相关的定义与实现。
 */

if (typeof document !== 'undefined' && !document.elementsFromPoint) {
  document.elementsFromPoint = elementsFromPoint;
}


/**
 * Executes `elementsFromPoint` to handle elements from point.
 * @zh 执行 `elementsFromPoint`，用于元素列表从坐标点。
 * @param x - x parameter (`number`) / X坐标参数（`number`）
 * @param y - y parameter (`number`) / Y坐标参数（`number`）
 */
export function elementsFromPoint(x: number, y: number) {
  const elements = [];
  const previousPointerEvents = [];
  let current; // TODO: window.getComputedStyle should be used with inferred type (Element)
  let i;
  let d;

  //if (document === undefined) return elements;

  // get all elements via elementFromPoint, and remove them from hit-testing in order
  while ((current = document.elementFromPoint(x, y)) && elements.indexOf(current) === -1 && current != null) {
    // push the element and its current style
    elements.push(current);
    previousPointerEvents.push({
      value: current.style.getPropertyValue('pointer-events'),
      priority: current.style.getPropertyPriority('pointer-events')
    });

    // add "pointer-events: none", to get to the underlying element
    current.style.setProperty('pointer-events', 'none', 'important');
  }

  // restore the previous pointer-events values
  for (i = previousPointerEvents.length; (d = previousPointerEvents[--i]);) {
    elements[i].style.setProperty('pointer-events', d.value ? d.value : '', d.priority);
  }

  // return our results
  return elements;
}
/*tslint:enable*/
