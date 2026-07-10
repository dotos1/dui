import { Injectable, Optional } from '@angular/core';
import { IconSpriteConfig } from './icon-sprite-config.model';


/**
 * Holds the shared base path used to resolve `<svg-icon-sprite>` icon references
 * (`spritePath#iconId`), optionally seeded from an injected {@link IconSpriteConfig}.
 * @zh 保存用于解析 `<svg-icon-sprite>` 图标引用（`spritePath#iconId`）的共享基础路径，
 * 可通过注入的 {@link IconSpriteConfig} 预先配置。
 */
@Injectable({
  providedIn: 'root'
})
export class IconSpriteService {

  public spritePath: string;

  constructor(@Optional() config: IconSpriteConfig) {
    if (config) {
      this.setPath(config.path);
    }
  }

  setPath(path: string) {
    this.spritePath = path;
  }

  getPath(): string {
    return this.spritePath;
  }
}
