/**
 * @fileoverview Module `src/theme/config/config.ts` providing config definitions and implementation.
 * @zh 模块文件 `src/theme/config/config.ts`，提供配置相关的定义与实现。
 */

import { DotosConfig } from "../types";

/**
 * Constant/variable `dotosConfig` defining dotos config in `src/theme/config`.
 * @zh 常量/变量 `dotosConfig`，定义 `src/theme/config` 中的DotOS配置。
 */
export const dotosConfig: DotosConfig = {
    isDesktop: false,
    routerAnimation: 'none',
    wallpaper: '/assets/wallpapers/default.jpg',
    theme: {
        type: 'light',
        primary: 'blue-500',
        accent: 'orange-500',
        warn: 'red-800',
        formType:'fill'
    },
    layout: {
        pagemodel: 'compact',
        style: 'horizontal-layout',
        width: 'fullwidth',
        folded: false,
        variant: 'vertical',
        sidepanel: {
            hidden: false,
            position: 'right'
        }
    }
};
