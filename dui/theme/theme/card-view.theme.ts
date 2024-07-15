import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';

export function duiCardViewTheme(theme: Theme): Object {

  return {
    ".dui-property-list .dui-property-label":{
        "color":matColor(theme.foreground, 'text', 0.54)
    },
    ".dui-property-list .dui-property-value,.mat-mdc-form-field-label":{
      "color":matColor(theme.foreground, 'text', 0.87)
    },
    ".dui-array-item-action": {
      color: matColor(theme.foreground, "text", 0.25)
    },
    ".dui-array-item-action:hover,.dui-array-item-action:focus": {
      "color":  matColor(theme.foreground, "text")
    },
    ".dui-dateitem-editable": {
      "border-bottom": "1px solid "+matColor(theme.foreground, "text",  0.42)
    },
    ".dui-datetime-underline":{
        "background-color":matColor(theme.foreground, "text", 0.5)
      },

    ".dui-textitem-edit-icon.mat-icon": {
      "color": matColor(theme.foreground, "text", 0.25)
    },
    ".dui-textitem-action.mat-mdc-icon-button": {
      "color": matColor(theme.foreground, "text", 0.25)
    },
    ".dui-textitem-action:hover,.dui-textitem-action:focus": {
        color: matColor(theme.foreground, "text")
    },
    ".dui-textitem-readonly:hover .dui-textitem-action:focus .dui-textitem-action": {
      color: matColor(theme.foreground, "text")
    },
    ".dui-textitem-clickable:hover .dui-textitem-action":{
        color: matColor(theme.foreground, "text")
    },
    ".dui-textitem-clickable-value": {
        color: matColor(theme.primary)+" !important"
    },
    ".dui-textitem-editable-controls mat-icon:not(.dui-button-disabled):hover":{
        color: matColor(theme.foreground, "text")
      },
      // ".dui-textitem-editable-controls input:focus,textarea:focus":{
      //     border: outline
      // },
      ".dui-textitem-default-value": {
        color: matColor(theme.foreground, "text", 0.54)
      },
      ".dui-textitem-scroll &:hover::-webkit-scrollbar-thumb": {
          "background-color": matColor(theme.foreground, "text", 0.25)
      },
      ".dui-property-field.dui-card-textitem-field:hover .dui-property-clear-value":{
          "color":  matColor(theme.foreground, "text", 0.25)
      },
      ".dui-property-field.dui-card-textitem-field:hover .dui-property-clear-value:hover":{
         color: matColor(theme.foreground, "text")
       },
      ".dui-card-view__key-value-pairs__col .mat-mdc-form-field-appearance-legacy .mat-mdc-form-field-label":{
         color: matColor(theme.foreground, "text", 0.4)+" !important"
      }
  }
}
