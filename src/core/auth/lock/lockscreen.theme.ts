
import { Theme } from '@dotos/dui/theme';
import { matColor } from '@dotos/dui/theme';

export function LockTheme(theme: Theme): Object {
  const backgroundCardColor: string = matColor(theme.background, 'card');
  const textColor: string = matColor(theme.foreground, 'secondary-text');
  return {
    "app-lockscreen #lock  #lock-form-wrapper #lock-form": {
      "background": backgroundCardColor
    },
    "app-lockscreen #lock  #lock-form-wrapper #lock-form .lock-form-header .avatar-container  mat-icon": {
      "color": "red"
    },
    "app-lockscreen #lock  #lock-form-wrapper #lock-form .lock-form-header  .title": {
      "color": textColor
    },
    "app-lockscreen #lock  #lock-form-wrapper #lock-form .lock-form-header  .subtitle": {
      "color": textColor
    },
    "app-lockscreen #lock  #lock-form-wrapper #lock-form .message  .link": {
      "color":  matColor(theme.accent)
    }
  };
}

