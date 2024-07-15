import { Palette } from './interfaces';

export function matPalette(basePalette: Palette, defaultColor: number | string = 500, lighter: number | string = 100, darker: number | string = 700,text= defaultColor): Palette {
    const result: Palette = { ...basePalette };

    result['default'] = basePalette[defaultColor];
    result['lighter'] = basePalette[lighter];
    result['darker'] = basePalette[darker];
    result['text'] = basePalette[text];
    result['default-contrast'] = matContrast(basePalette, defaultColor);
    result['lighter-contrast'] = matContrast(basePalette, lighter);
    result['darker-contrast'] = matContrast(basePalette, darker);

    // For each hue in the palette, add a "-contrast" color to the map.
    Object.keys(basePalette).map((key: string) => {
        if (key !== 'contrast') {
            result[`${key}-contrast`] = matContrast(basePalette, key);
        }
    });
    return result;
}

function matContrast(palette: Palette, hue: number | string): string {
    return palette.contrast[hue];
}
