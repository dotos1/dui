import { InjectionToken } from '@angular/core';
import { MultiWindowConfig } from '../types/multi-window.config';
import { WindowSaveStrategy } from '../types/window-save-strategy.enum';

export const NGXMW_CONFIG = new InjectionToken<MultiWindowConfig>('dotosmw_config');
export const defaultMultiWindowConfig: MultiWindowConfig = {
  keyPrefix: 'dotos_',
  heartbeat: 500,
  newWindowScan: 5000,
  messageTimeout: 5000,
  windowTimeout: 15000,
  windowSaveStrategy: WindowSaveStrategy.SAVE_FORCE,
};
