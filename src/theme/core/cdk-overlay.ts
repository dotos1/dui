/**
 * @fileoverview Module `src/theme/core/cdk-overlay.ts` providing cdk overlay definitions and implementation.
 * @zh 模块文件 `src/theme/core/cdk-overlay.ts`，提供CDK工具浮层相关的定义与实现。
 */

/**
 * Executes `cdkOverlay` to handle cdk overlay.
 * @zh 执行 `cdkOverlay`，用于CDK工具浮层。
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function cdkOverlay(): Object {
    const zOverlay: number = 1000;

    return {
        '.cdk-overlay-container, .cdk-global-overlay-wrapper': {
            // Disable events from being captured on the overlay container.
            'pointer-events': 'none',
            // The container should be the size of the viewport.
            top: 0,
            left: 0,
            height: '100%',
            width: '100%'
        },
        // The overlay-container is an invisible element which contains all individual overlays.
        '.cdk-overlay-container': {
            position: 'fixed',
            'z-index': zOverlay,
            '&:empty': {
                display: 'none'
            }
        },

        '.cdk-global-overlay-wrapper': {
            display: 'flex',
            position: 'absolute',
            'z-index': zOverlay
        },
        '.cdk-overlay-pane': {
            position: 'absolute',
            'pointer-events': 'auto',
            'box-sizing': 'border-box',
            'z-index': zOverlay+100,
            'display': 'flex',
            'max-width': '100%',
            'max-height': '100%'
        },
        '.cdk-overlay-backdrop': {
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            'z-index': zOverlay,
            'pointer-events': 'auto',
            '-webkit-tap-highlight-color': 'transparent',
            transition: 'opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1)',
            opacity: 0,
            '&.cdk-overlay-backdrop-showing': {
                opacity: 1,
                '.cdk-high-contrast-active &': {
                    opacity: 0.6
                } 
            }
        },
        '.cdk-overlay-dark-backdrop': {
            background: 'rgba(0, 0, 0, 0.288)'
        },
        '.cdk-overlay-transparent-backdrop': {
            'transition': 'visibility 1ms linear, opacity 1ms linear',
            'visibility': 'hidden',
            'opacity': 1,
            '&.cdk-overlay-backdrop-showing': {
                opacity: 0,
                visibility: 'visible'
            }
        },
        '.cdk-overlay-backdrop-noop-animation': {
            'transition': 'none'
        },
        '.cdk-overlay-connected-position-bounding-box': {
            position: 'absolute',
            'z-index': zOverlay,
            display: 'flex',
            'flex-direction': 'column',
            'min-width': '1px',
            'min-height': '1px'
        },
        // Used when disabling global scrolling.
        '.cdk-global-scrollblock': {
            position: 'fixed',
            width: '100%',
            'overflow-y': 'hidden'
        }
    };
}
