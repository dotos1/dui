/**
 * @fileoverview Module `src/theme/types/dotos-config.ts` providing dotos config definitions and implementation.
 * @zh 模块文件 `src/theme/types/dotos-config.ts`，提供DotOS配置相关的定义与实现。
 */

/**
 * Interface `DotosConfig` defining the contract and properties for dotos config.
 * @zh 接口 `DotosConfig`，定义DotOS配置的数据结构契约与属性规范。
 */
export interface DotosConfig {
    /**
     * Property `isDesktop` (`boolean`) storing is desktop.
     * @zh 属性 `isDesktop`（类型：`boolean`），用于存储或配置是否为Desktop。
     */
    isDesktop?: boolean;
    customScrollbars?: boolean;
    /**
     * Property `theme` (`{ type: 'light'|'dark'|'darkblue'; primary: string; accent: string; wa...`) storing theme.
     * @zh 属性 `theme`（类型：`{ type: 'light'|'dark'|'darkblue'; primary: string; accent: string; wa...`），用于存储或配置主题。
     */
    theme?: {
        type: 'light'|'dark'|'darkblue';
        primary: string;
        accent: string;
        warn: string;
        formType:'fill'|'outline';
    };
    /**
     * Property `wallpaper` (`string`) storing wallpaper.
     * @zh 属性 `wallpaper`（类型：`string`），用于存储或配置wallpaper。
     */
    wallpaper?: string;
    /**
     * Property `layout` (`{ pagemodel: string; style: string; width: 'fullwidth' | 'boxed'; fold...`) storing layout.
     * @zh 属性 `layout`（类型：`{ pagemodel: string; style: string; width: 'fullwidth' | 'boxed'; fold...`），用于存储或配置布局。
     */
    layout: {
        pagemodel: string;
        style: string;
        width: 'fullwidth' | 'boxed';
        folded: boolean;
        variant: string;
        sidepanel: {
            hidden: boolean;
            position: 'left' | 'right'
        }
    };
    /**
     * Property `routerAnimation` (`string`) storing router animation.
     * @zh 属性 `routerAnimation`（类型：`string`），用于存储或配置router动画。
     */
    routerAnimation: string;
}
