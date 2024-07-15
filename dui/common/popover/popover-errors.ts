/**
 * Throws an exception for the case when popover trigger doesn't have a valid dui-popover instance
 */
export function throwDuiPopoverMissingError() {
  throw Error(`dui-popover-trigger: must pass in an dui-popover instance.
    Example:
      <dui-popover #popover="duiPopover"></dui-popover>
      <button [duiPopoverTriggerFor]="popover"></button>`);
}

/**
 * Throws an exception for the case when popover's duiPopoverPositionX value isn't valid.
 * In other words, it doesn't match 'before' or 'after'.
 */
export function throwDuiPopoverInvalidPositionX() {
  throw Error(`duiPopoverPositionX value must be either 'before' or after'.
      Example: <dui-popover duiPopoverPositionX="before" #popover="duiPopover"></dui-popover>`);
}

/**
 * Throws an exception for the case when popover's duiPopoverPositionY value isn't valid.
 * In other words, it doesn't match 'above' or 'below'.
 */
export function throwDuiPopoverInvalidPositionY() {
  throw Error(`duiPopoverPositionY value must be either 'above' or below'.
      Example: <dui-popover duiPopoverPositionY="above" #popover="duiPopover"></dui-popover>`);
}
