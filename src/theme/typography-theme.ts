import { TypographyConfig } from './interfaces';


// Foreground palette for light themes.
const looseTypography: TypographyConfig = {
    type: 'loose',
    'display-4': { 'font-size': '112px', 'line-height': '112px', 'font-weight': 300,"letter-spacing":"normal" },
    'display-3': { 'font-size': '56px', 'line-height': '56px', 'font-weight': 400 ,"letter-spacing":"normal"},
    'display-2': { 'font-size': '45px', 'line-height': '48px', 'font-weight': 400,"letter-spacing":"normal" },
    'display-1': { 'font-size': '34px', 'line-height': '40px', 'font-weight': 400 ,"letter-spacing":"normal"},
    headline: { 'font-size': '24px', 'line-height': '32px', 'font-weight': 400 ,"letter-spacing":"normal"},
    title: { 'font-size': '20px', 'line-height': '20px', 'font-weight': 400 ,"letter-spacing":"normal"},
    'subheading-2': { 'font-size': '16px', 'line-height': '28px', 'font-weight': 400 ,"letter-spacing":"normal"},
    'subheading-1': { 'font-size': '15px', 'line-height': '24px', 'font-weight': 400 ,"letter-spacing":"normal"},
    'body-2': { 'font-size': '14px', 'line-height': '24px', 'font-weight': 500 ,"letter-spacing":"normal"},
    'body-1': { 'font-size': '14px', 'line-height': '20px', 'font-weight': 400 ,"letter-spacing":"normal"},
    caption: { 'font-size': '12px', 'line-height': '20px', 'font-weight': 400 ,"letter-spacing":"normal"},
    button: { 'font-size': '14px', 'line-height': '14px', 'font-weight': 500 ,"letter-spacing":"normal"},
    input: { 'font-size': 'inherit', 'line-height': 1.125, 'font-weight': 400 ,"letter-spacing":"normal"},
    'font-family': 'Roboto, "Helvetica Neue", sans-serif',
};

const normalTypography: TypographyConfig = {
    type: 'normal',
    'display-4': { 'font-size': '100px', 'line-height': '100px', 'font-weight': 300 ,"letter-spacing":"normal"},
    'display-3': { 'font-size': '50px', 'line-height': '50px', 'font-weight': 400 ,"letter-spacing":"normal"},
    'display-2': { 'font-size': '40px', 'line-height': '44px', 'font-weight': 400 ,"letter-spacing":"normal"},
    'display-1': { 'font-size': '30px', 'line-height': '36px', 'font-weight': 400 ,"letter-spacing":"normal"},
    headline: { 'font-size': '22px', 'line-height': '28px', 'font-weight': 400 ,"letter-spacing":"normal"},
    title: { 'font-size': '18px', 'line-height': '28px', 'font-weight': 400 ,"letter-spacing":"normal"},
    'subheading-2': { 'font-size': '15px', 'line-height': '21px', 'font-weight': 400 ,"letter-spacing":"normal"},
    'subheading-1': { 'font-size': '14px', 'line-height': '21px', 'font-weight': 400 ,"letter-spacing":"normal"},
    'body-2': { 'font-size': '14px', 'line-height': '22px', 'font-weight': 500 ,"letter-spacing":"normal"},
    'body-1': { 'font-size': '14px', 'line-height': '18px', 'font-weight': 400 ,"letter-spacing":"normal"},
    caption: { 'font-size': '12px', 'line-height': '18px', 'font-weight': 400 ,"letter-spacing":"normal"},
    button: { 'font-size': '13px', 'line-height': '13px', 'font-weight': 500 ,"letter-spacing":"normal"},
    input: { 'font-size': 'inherit', 'line-height': 0.9844, 'font-weight': 400 ,"letter-spacing":"normal"},
    'font-family': 'Roboto, "Helvetica Neue", sans-serif',
};


const compactTypography: TypographyConfig = {
    type: 'compact',
    'display-4': { 'font-size': '90px', 'line-height': '90px', 'font-weight': 300 ,"letter-spacing":"normal"},
    'display-3': { 'font-size': '44px', 'line-height': '44px', 'font-weight': 400 ,"letter-spacing":"normal"},
    'display-2': { 'font-size': '36px', 'line-height': '38px', 'font-weight': 400 ,"letter-spacing":"normal"},
    'display-1': { 'font-size': '28px', 'line-height': '28px', 'font-weight': 400 ,"letter-spacing":"normal"},
    headline: { 'font-size': '20px', 'line-height': '20px', 'font-weight': 400 ,"letter-spacing":"normal"},
    title: { 'font-size': '18px', 'line-height': '18px', 'font-weight': 400 ,"letter-spacing":"normal"},
    'subheading-2': { 'font-size': '14px', 'line-height': '20px', 'font-weight': 400 ,"letter-spacing":"normal"},
    'subheading-1': { 'font-size': '13px', 'line-height': '20px', 'font-weight': 400 ,"letter-spacing":"normal"},
    'body-2': { 'font-size': '14px', 'line-height': '20px', 'font-weight': 500 ,"letter-spacing":"normal"},
    'body-1': { 'font-size': '14px', 'line-height': '16px', 'font-weight': 400 ,"letter-spacing":"normal"},
    caption: { 'font-size': '12px', 'line-height': '18px', 'font-weight': 400 ,"letter-spacing":"normal"},
    button: { 'font-size': '13px', 'line-height': '13px', 'font-weight': 500 ,"letter-spacing":"normal"},
    input: { 'font-size': 'inherit', 'line-height': 0.9844, 'font-weight': 400 ,"letter-spacing":"normal"},
    'font-family': 'Roboto, "Helvetica Neue", sans-serif',
};

export const TypographyMap = {
    compact: compactTypography,
    normal: normalTypography,
    loose: looseTypography
}
