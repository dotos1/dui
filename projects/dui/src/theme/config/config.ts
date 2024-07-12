import { DotosConfig } from "../types";

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
