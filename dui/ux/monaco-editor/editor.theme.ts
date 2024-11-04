import { Theme } from '@dotos/dui/theme';
import { matColor } from '@dotos/dui/theme';

export function EditorTheme(theme: Theme): Object {
  return {
    ".mtk1":{
      "color":matColor(theme.foreground, 'secondary-text') +"!important"
    },
    ".monaco-editor .cursors-layer .cursor" :{
          "background-color": matColor(theme.foreground, 'text') +"!important",
          "border-color": matColor(theme.foreground, 'dividers') +"!important",
          "color": matColor(theme.foreground, 'text') +"!important"
    }
  };
}
