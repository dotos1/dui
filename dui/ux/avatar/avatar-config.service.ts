import { Injectable, Inject, Optional } from '@angular/core';
import { AVATAR_CONFIG } from './avatar-config.token';
import { AvatarConfig } from './avatar-config';

@Injectable()
export class AvatarConfigService {
  constructor(
    @Optional()
    @Inject(AVATAR_CONFIG)
    public userConfig: AvatarConfig
  ) {}

  public getAvatarColors(defaultColors: string[]): string[] {
    return (
      (this.userConfig &&
        this.userConfig.colors &&
        this.userConfig.colors.length &&
        this.userConfig.colors) ||
      defaultColors
    );
  }
}
