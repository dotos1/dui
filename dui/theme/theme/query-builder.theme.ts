
import { Theme } from '../interfaces';
import { matColor } from '../mat-color';

export function duiQueryBuilderTheme(theme: Theme): Object {
  const backgroundCardColor: string = matColor(theme.background, 'card');
  return {
    "query-builder .q-button":{
      "background-color": backgroundCardColor
    },
    "query-builder .q-input-control, .q-operator-control, .q-field-control, .q-entity-control":{
      "color": "#555555",
      "background-color": backgroundCardColor,
      "border":" 1px solid "+matColor(theme.foreground, 'divider')
    },
    "query-builder .q-switch-label, .q-button":{
      border: "1px solid "+matColor(theme.foreground, 'divider')
    },
    "query-builder .q-switch-label, .q-button &:hover":{
      "background-color": "#F0F0F0"
    },
    "query-builder .q-switch-label":{
      "background-color": "#e4e4e4"
    },
    "query-builder .q-switch-radio &:checked + .q-switch-label":{
      "border": "#e4e4e4",
      "background": backgroundCardColor,
      "color": "rgba(49, 118, 179,1.0)"
    },
    "query-builder .q-invalid-ruleset":{
      "border": "1px solid rgba(179, 65, 93, 0.5) !important",
      "background": "rgba(179, 65, 93, 0.1) !important"
    },
    "query-builder .q-empty-warning":{
      "color": "rgba(141, 37, 46,1.0)"
    },
    "query-builder .q-ruleset":{
      "border":" 1px solid "+matColor(theme.foreground, 'divider')
    },
    "query-builder .q-rule":{
      "border":" 1px solid "+matColor(theme.foreground, 'divider'),
      "background": backgroundCardColor
    },
    "query-builder .q-connector  &::before, &::after":{
      "border-color": matColor(theme.foreground, 'divider')
    }
  };
}
