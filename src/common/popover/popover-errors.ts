/**
 * Throws an exception for the case when popover trigger doesn't have a valid popover instance

 * @zh 执行 `throwPopoverMissingError`，用于throw气泡卡片Missing错误。
 */
export function throwPopoverMissingError() {
  throw Error(`popover-trigger: must pass in an popover instance.
    Example:
      <popover #popover="duiPopover"></popover>
      <button [popoverTriggerFor]="popover"></button>`);
}

/**
 * Throws an exception for the case when popover's popoverPositionX value isn't valid.
 * In other words, it doesn't match 'before' or 'after'.

 * @zh 执行 `throwPopoverInvalidPositionX`，用于throw气泡卡片无效位置X坐标。
 */
export function throwPopoverInvalidPositionX() {
  throw Error(`popoverPositionX value must be either 'before' or after'.
      Example: <popover popoverPositionX="before" #popover="duiPopover"></popover>`);
}

/**
 * Throws an exception for the case when popover's popoverPositionY value isn't valid.
 * In other words, it doesn't match 'above' or 'below'.

 * @zh 执行 `throwPopoverInvalidPositionY`，用于throw气泡卡片无效位置Y坐标。
 */
export function throwPopoverInvalidPositionY() {
  throw Error(`popoverPositionY value must be either 'above' or below'.
      Example: <popover popoverPositionY="above" #popover="duiPopover"></popover>`);
}
