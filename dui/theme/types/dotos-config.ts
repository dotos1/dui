export interface DotosConfig {
    isDesktop?: boolean;
    theme?: {
        type: 'light'|'dark'|'darkblue';
        primary: string;
        accent: string;
        warn: string;
        formType:'fill'|'outline';
    };
    wallpaper?: string;
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
    routerAnimation: string;
}
