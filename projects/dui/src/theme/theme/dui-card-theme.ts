
import { Theme } from '../interfaces';


export function duiCardTheme(theme: Theme): Object {
  const type: string = theme.typography['type'];
  let px80: string = type === 'loose' ? '140px' : type === 'normal' ? '130px' : '120px';
  let px100: string = type === 'loose' ? '140px' : type === 'normal' ? '130px' : '120px';
  let px120: string = type === 'loose' ? '140px' : type === 'normal' ? '130px' : '120px';

  return {
    '.rightbottom': {
      "position":"absolute",
      bottom: px120 + " !important",
      right: px80 + " !important",
    },
    '.righttop': {
      "position":"absolute",
      top: px100 + " !important",
      right: px80 + " !important",
    }
  };
}
