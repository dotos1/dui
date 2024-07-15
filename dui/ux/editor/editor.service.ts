import { Injectable, Optional } from '@angular/core';

import { EditorConfig } from './types';
import Locals from './Locals';
import { EditorServiceConfig } from './editor-config.service';

@Injectable({
  providedIn: 'root',
})
export class EditorService {
  config: EditorServiceConfig;

  constructor(@Optional() config?: EditorServiceConfig) {
    this.config = config;
  }

  get locals(): Locals {
    return new Locals(this.config.locals);
  }
}

export const provideMyServiceOptions = (config?: EditorConfig): EditorServiceConfig => {
  return {
    locals: config.locals ?? {},
  };
};
