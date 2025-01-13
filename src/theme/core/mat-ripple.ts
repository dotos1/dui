export function matRipple(): Object {
    return {
        '.mat-ripple': {
            overflow: 'hidden',
            position: 'relative',
            '&:not(:empty)': {
                transform: 'translateZ(0)'
            }
        },
        '.mat-ripple.mat-ripple-unbounded': {
            overflow: 'visible'
        },
        '.mat-ripple-element': {
            position: 'absolute',
            'border-radius': '50%',
            'pointer-events': 'none',
            transition: 'opacity, transform 0ms cubic-bezier(0, 0, 0.2, 1)',
            transform: 'scale3d(0, 0, 0)'
        }
    };
}
