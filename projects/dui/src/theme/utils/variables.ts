
export const matXsmall= 'max-width: 599px';
export const matSmall= 'max-width: 959px';

export const  zIndexFab= '20 !default';
export const  zIndexDrawer= "100 !default";

// Global constants
export const  pi= 3.14159265;

// Padding between input toggles and their labels
export const  matTogglePadding=' 8px !default';
// Width and height of input toggles
export const  matToggleSize=' 20px !default';

// Easing Curves
// TODO(jelbourn): all of these need to be revisited

// The default animation curves used by material design.
export const  matLinearOutSlowInTimingFunction= 'cubic-bezier(0, 0, 0.2, 0.1) !default';
export const  matFastOutSlowInTimingFunction= 'cubic-bezier(0.4, 0, 0.2, 1) !default';
export const  matFastOutLinearInTimingFunction= 'cubic-bezier(0.4, 0, 1, 1) !default';

export const  easeInOutCurveFunction= 'cubic-bezier(0.35, 0, 0.25, 1) !default';

export const  swiftEaseOutDuration= '400ms !default';
export const  swiftEaseOutTimingFunction= 'cubic-bezier(0.25, 0.8, 0.25, 1) !default';
export const  swiftEaseOut= 'all '+ swiftEaseOutDuration +' '+ swiftEaseOutTimingFunction+' !default';

export const  swiftEaseInDuration= '300ms !default';
export const  swiftEaseInTimingFunction= 'cubic-bezier(0.55, 0, 0.55, 0.2) !default';
export const  swiftEaseIn=' all '+swiftEaseInDuration+' '+ swiftEaseInTimingFunction+' !default';

export const swiftEaseInOutDuration=' 500ms !default';
export const swiftEaseInOutTimingFunction= easeInOutCurveFunction+' !default';
export const swiftEaseInOut=' all '+swiftEaseInOutDuration+' '+ swiftEaseInOutTimingFunction+' !default';

export const swiftLinearDuration=' 80ms !default';
export const swiftLinearTimingFunction=' linear !default';
export const swiftLinear=' all '+swiftLinearDuration+' '+ swiftLinearTimingFunction+' !default';
