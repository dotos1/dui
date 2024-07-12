export function structuralStyling(prefix){
    const key1='.'+prefix+'-focus-indicator';
    let val={}
    val['.'+prefix+'-focus-indicator']= {
        position: 'relative',
        '&::before' :{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            position: 'absolute',
          'box-sizing': 'border-box',
          'pointer-events': 'none',
          'display': `var(--${prefix}-focus-indicator-display, none)`,
          'border': `var(--${prefix}-focus-indicator-border-width,3px)',
                    'var(--${prefix}-focus-indicator-border-style,solid )',
                    'var(--${prefix}-focus-indicator-border-color, transparent )`,
          'border-radius': `var(--${prefix}-focus-indicator-border-radius,4px)`
        },
        '&:focus::before': {
            content: ''
        }
    }
    return val;
}
export function matFocus(): Object {
    return structuralStyling('mat');
}
export function mdcFocus(): Object {
    return structuralStyling('mat-mdc');
}