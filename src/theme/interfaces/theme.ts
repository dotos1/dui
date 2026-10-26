/**
 * @fileoverview Module `src/theme/interfaces/theme.ts` providing theme definitions and implementation.
 * @zh 模块文件 `src/theme/interfaces/theme.ts`，提供主题相关的定义与实现。
 */

import { Palette } from './palette';
import { Foreground } from './foreground';
import { Background } from './background';
import { TypographyConfig } from './typography-config';

/**
 * Interface `Theme` defining the contract and properties for theme.
 * @zh 接口 `Theme`，定义主题的数据结构契约与属性规范。
 */
export interface Theme {
    /**
     * Property `primary` (`Palette`) storing primary.
     * @zh 属性 `primary`（类型：`Palette`），用于存储或配置主色。
     */
    readonly primary: Palette;
    /**
     * Property `accent` (`Palette`) storing accent.
     * @zh 属性 `accent`（类型：`Palette`），用于存储或配置强调色。
     */
    readonly accent: Palette;
    /**
     * Property `warn` (`Palette`) storing warn.
     * @zh 属性 `warn`（类型：`Palette`），用于存储或配置警告色。
     */
    readonly warn: Palette;
    /**
     * Property `type` (`'light'|'dark'|'darkblue'`) storing type.
     * @zh 属性 `type`（类型：`'light'|'dark'|'darkblue'`），用于存储或配置类型。
     */
    readonly type: 'light'|'dark'|'darkblue';
    /**
     * Property `foreground` (`Foreground`) storing foreground.
     * @zh 属性 `foreground`（类型：`Foreground`），用于存储或配置前景。
     */
    readonly foreground: Foreground;
    /**
     * Property `background` (`Background`) storing background.
     * @zh 属性 `background`（类型：`Background`），用于存储或配置背景。
     */
    readonly background: Background;
    /**
     * Property `density` (`number`) storing density.
     * @zh 属性 `density`（类型：`number`），用于存储或配置密度。
     */
    readonly density: number;
    /**
     * Property `typography` (`TypographyConfig`) storing typography.
     * @zh 属性 `typography`（类型：`TypographyConfig`），用于存储或配置排版。
     */
    readonly typography:TypographyConfig
}
