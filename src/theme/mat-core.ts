import {
    matRipple,
    cdkA11y,
    cdkOverlay,
    cdkTextfieldAutosize,
    cdkTextfieldAutoFill,
    matFocus,mdcFocus
} from './core';

import { TypographyConfig } from './interfaces';

export function matCore(typographyConfig: TypographyConfig = null): Object {
    return {
        ...matRipple(),
        ...cdkA11y(),
        ...cdkOverlay(),
        ...cdkTextfieldAutosize(),
        ...cdkTextfieldAutoFill(),
        ...matFocus(),
        ...mdcFocus()
    };
}

