/**
 * 按字段配置(labelProp / valueProp / disabledProp / groupProp)从原始选项里取值。
 *
 * SelectOptionsPipe 和 select.field 的本地搜索共用这一份。b8c5e5c 复核:
 * 管道改成返回新对象、不再把 label/value 写回原始选项之后,本地搜索仍然直接读
 * `option.label` —— 配了 `labelProp: 'text' | 'title' | 'name'` 的下拉框
 * (主应用 40 多处)按标签就一条也搜不到,只有按 value 搜还像是正常的。
 * 两边必须用同一套取值规则。
 */
export function shouldUseLegacyOption(item: any, to: any): boolean {
  return !to?.valueProp
    && !to?.labelProp
    && item != null
    && typeof item === 'object'
    && 'key' in item
    && 'value' in item;
}

export function getOptionLabel(item: any, to: any): any {
  to = to || {};
  if (typeof to.labelProp === 'function') {
    return to.labelProp(item);
  }
  if (shouldUseLegacyOption(item, to)) {
    return item.value;
  }
  return item?.[to.labelProp || 'label'];
}

export function getOptionValue(item: any, to: any): any {
  to = to || {};
  if (typeof to.valueProp === 'function') {
    return to.valueProp(item);
  }
  if (shouldUseLegacyOption(item, to)) {
    return item.key;
  }
  return item?.[to.valueProp || 'value'];
}

export function getOptionDisabled(item: any, to: any): any {
  to = to || {};
  if (typeof to.disabledProp === 'function') {
    return to.disabledProp(item);
  }
  return item?.[to.disabledProp || 'disabled'];
}

export function getOptionGroup(item: any, to: any): any {
  to = to || {};
  if (typeof to.groupProp === 'function') {
    return to.groupProp(item);
  }
  return item?.[to.groupProp || 'group'];
}
