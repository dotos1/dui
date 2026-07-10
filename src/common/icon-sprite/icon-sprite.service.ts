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

  /**
   * The currently configured base sprite path.
   * @zh 当前配置的雪碧图基础路径。
   */
  public spritePath: string;

  constructor(@Optional() config: IconSpriteConfig) {
    if (config) {
      this.setPath(config.path);
    }
  }

  /**
   * Sets the base sprite path used to resolve icon references.
   * @zh 设置用于解析图标引用的基础雪碧图路径。
   */
  setPath(path: string) {
    this.spritePath = path;
  }

  /**
   * Returns the currently configured base sprite path.
   * @zh 返回当前配置的基础雪碧图路径。
   */
  getPath(): string {
    return this.spritePath;
  }
}
