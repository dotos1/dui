
import { rgba, Theme } from '@dotos/dui/theme';
import { matColor } from '@dotos/dui/theme';
import { matThemeElevation } from '@dotos/dui/theme';

export function duiWindowTheme(theme: Theme): Object {

  const backgroundCardColor: string = matColor(theme.background, 'card');
  const primaryColor: string = matColor(theme.primary, 500);

  return {
    ".dui-scroll-view &::-webkit-scrollbar-corner": {
      "background":theme.type=='light'?"#dfdfdf": "#2c2c2c"
    },
    ".dui-scroll-view -webkit-scrollbar-track": {
      "background": theme.type=='light'? "#e6e6e6":"#202020"
    },
    ".dui-scroll-view -webkit-scrollbar-thumb": {
      "background": theme.type=='light' ? "#b0b0b0":"#3e3e3e" ,
      "border": "solid 3px " + theme.type=='light'? "#e6e6e6":"#202020"
    },
    ".dui-scroll-view -webkit-scrollbar-thumb &:hover": {
      "background": theme.type=='light' ? "black":"white"
    },
    ".dui-scroll-view &::-webkit-scrollbar-button": {
      "background-color": theme.type=='light'?"#5d5d5d" :"#e9e9e9"
    },
    ".dui-scroll-view &::-webkit-scrollbar-button &:hover": {
      "background-color": theme.type=='light'? "#d2d2d2 !important":"#5d5d5d !important"
    },
    ".dui-window": {
      "background": backgroundCardColor,
      "border": "solid 1px " + matColor(theme.foreground, 'divider'),
      ...matThemeElevation(8, theme, 1),
      "&.dui-active": {
        "background": rgba(matColor(theme.background, 'card'), .7),
        "border": "solid 1px " + primaryColor,
        ...matThemeElevation(16, theme, 1),
        "@supports (not(backdrop-filter: blur(40px)))": {
          "background": backgroundCardColor
        }
      }
    },
    ".dui-title-bar": {
      "background": matColor(theme.background, 'card'),
      "color": matColor(theme.foreground, 'text'),
      ...matThemeElevation(1, theme, 1),
      "&.dui-active": {
        "background": primaryColor,
        "color":  matColor(theme.primary, "darker-contrast")
      },
      "&.dui-active  .dui-title-icon":{
        "color":  matColor(theme.primary, "darker-contrast")+" !important"
      },
      "&.dui-active .dui-title-bar-button": {
        "background-color": primaryColor
      },
      "&.dui-active &:hover:not(.dui-disabled)": {
        "background-color": rgba(matColor(theme.background, 'card'), .1)
      },
      " &.dui-active &:not(.dui-disabled):active": {
        "background-color": rgba(matColor(theme.background, 'card'), .2)
      },
      "&.dui-active &[aria-label='Close']:not(.dui-disabled) .dui-icon &:hover": {
        "background-color": "rgb(232, 17, 35)"
      },
      "&.dui-active &[aria-label='Close']:not(.dui-disabled) .dui-icon &:hover &:active": {
        "background-color": "rgba(232, 17, 35, .8)"
      },
    },
    ".dui-title-icon":{
      "color":  matColor(theme.foreground, "icon")
    },
    ".dui-title-bar-button": {
      "background-color": matColor(theme.background, 'card'),
    },
    ".dui-title-bar-button ": {
      "&:hover:not(.dui-disabled)":{
        "background-color": matColor(theme.foreground, 'disabled')
      }
    }
  };
}
