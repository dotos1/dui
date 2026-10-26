/**
 * @fileoverview Module `src/core/angular2parse/angular/compiler/chars.ts` providing chars definitions and implementation.
 * @zh 模块文件 `src/core/angular2parse/angular/compiler/chars.ts`，提供字符相关的定义与实现。
 */


/**
 * Constant/variable `$EOF` defining eof in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$EOF`，定义 `src/core/angular2parse/angular/compiler` 中的EOF。
 */
export const $EOF = 0;
/**
 * Constant/variable `$TAB` defining tab in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$TAB`，定义 `src/core/angular2parse/angular/compiler` 中的选项卡。
 */
export const $TAB = 9;
/**
 * Constant/variable `$LF` defining lf in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$LF`，定义 `src/core/angular2parse/angular/compiler` 中的LF。
 */
export const $LF = 10;
/**
 * Constant/variable `$VTAB` defining vtab in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$VTAB`，定义 `src/core/angular2parse/angular/compiler` 中的VTAB。
 */
export const $VTAB = 11;
/**
 * Constant/variable `$FF` defining ff in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$FF`，定义 `src/core/angular2parse/angular/compiler` 中的FF。
 */
export const $FF = 12;
/**
 * Constant/variable `$CR` defining cr in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$CR`，定义 `src/core/angular2parse/angular/compiler` 中的CR。
 */
export const $CR = 13;
/**
 * Constant/variable `$SPACE` defining space in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$SPACE`，定义 `src/core/angular2parse/angular/compiler` 中的SPACE。
 */
export const $SPACE = 32;
/**
 * Constant/variable `$BANG` defining bang in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$BANG`，定义 `src/core/angular2parse/angular/compiler` 中的BANG。
 */
export const $BANG = 33;
/**
 * Constant/variable `$DQ` defining dq in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$DQ`，定义 `src/core/angular2parse/angular/compiler` 中的DQ。
 */
export const $DQ = 34;
/**
 * Constant/variable `$HASH` defining hash in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$HASH`，定义 `src/core/angular2parse/angular/compiler` 中的HASH。
 */
export const $HASH = 35;
/**
 * Constant/variable `$$` defining $$ in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$$`，定义 `src/core/angular2parse/angular/compiler` 中的$$。
 */
export const $$ = 36;
/**
 * Constant/variable `$PERCENT` defining percent in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$PERCENT`，定义 `src/core/angular2parse/angular/compiler` 中的百分比。
 */
export const $PERCENT = 37;
/**
 * Constant/variable `$AMPERSAND` defining ampersand in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$AMPERSAND`，定义 `src/core/angular2parse/angular/compiler` 中的AMPERSAND。
 */
export const $AMPERSAND = 38;
/**
 * Constant/variable `$SQ` defining sq in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$SQ`，定义 `src/core/angular2parse/angular/compiler` 中的SQ。
 */
export const $SQ = 39;
/**
 * Constant/variable `$LPAREN` defining lparen in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$LPAREN`，定义 `src/core/angular2parse/angular/compiler` 中的LPAREN。
 */
export const $LPAREN = 40;
/**
 * Constant/variable `$RPAREN` defining rparen in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$RPAREN`，定义 `src/core/angular2parse/angular/compiler` 中的RPAREN。
 */
export const $RPAREN = 41;
/**
 * Constant/variable `$STAR` defining star in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$STAR`，定义 `src/core/angular2parse/angular/compiler` 中的STAR。
 */
export const $STAR = 42;
/**
 * Constant/variable `$PLUS` defining plus in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$PLUS`，定义 `src/core/angular2parse/angular/compiler` 中的PLUS。
 */
export const $PLUS = 43;
/**
 * Constant/variable `$COMMA` defining comma in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$COMMA`，定义 `src/core/angular2parse/angular/compiler` 中的COMMA。
 */
export const $COMMA = 44;
/**
 * Constant/variable `$MINUS` defining minus in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$MINUS`，定义 `src/core/angular2parse/angular/compiler` 中的MINUS。
 */
export const $MINUS = 45;
/**
 * Constant/variable `$PERIOD` defining period in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$PERIOD`，定义 `src/core/angular2parse/angular/compiler` 中的PERIOD。
 */
export const $PERIOD = 46;
/**
 * Constant/variable `$SLASH` defining slash in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$SLASH`，定义 `src/core/angular2parse/angular/compiler` 中的SLASH。
 */
export const $SLASH = 47;
/**
 * Constant/variable `$COLON` defining colon in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$COLON`，定义 `src/core/angular2parse/angular/compiler` 中的COLON。
 */
export const $COLON = 58;
/**
 * Constant/variable `$SEMICOLON` defining semicolon in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$SEMICOLON`，定义 `src/core/angular2parse/angular/compiler` 中的SEMICOLON。
 */
export const $SEMICOLON = 59;
/**
 * Constant/variable `$LT` defining lt in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$LT`，定义 `src/core/angular2parse/angular/compiler` 中的LT。
 */
export const $LT = 60;
/**
 * Constant/variable `$EQ` defining eq in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$EQ`，定义 `src/core/angular2parse/angular/compiler` 中的EQ。
 */
export const $EQ = 61;
/**
 * Constant/variable `$GT` defining gt in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$GT`，定义 `src/core/angular2parse/angular/compiler` 中的GT。
 */
export const $GT = 62;
/**
 * Constant/variable `$QUESTION` defining question in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$QUESTION`，定义 `src/core/angular2parse/angular/compiler` 中的QUESTION。
 */
export const $QUESTION = 63;

/**
 * Constant/variable `$0` defining 0 in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$0`，定义 `src/core/angular2parse/angular/compiler` 中的0。
 */
export const $0 = 48;
/**
 * Constant/variable `$9` defining 9 in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$9`，定义 `src/core/angular2parse/angular/compiler` 中的9。
 */
export const $9 = 57;

/**
 * Constant/variable `$A` defining a in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$A`，定义 `src/core/angular2parse/angular/compiler` 中的A。
 */
export const $A = 65;
/**
 * Constant/variable `$E` defining e in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$E`，定义 `src/core/angular2parse/angular/compiler` 中的E。
 */
export const $E = 69;
/**
 * Constant/variable `$F` defining f in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$F`，定义 `src/core/angular2parse/angular/compiler` 中的F。
 */
export const $F = 70;
/**
 * Constant/variable `$X` defining x in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$X`，定义 `src/core/angular2parse/angular/compiler` 中的X坐标。
 */
export const $X = 88;
/**
 * Constant/variable `$Z` defining z in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$Z`，定义 `src/core/angular2parse/angular/compiler` 中的Z坐标。
 */
export const $Z = 90;

/**
 * Constant/variable `$LBRACKET` defining lbracket in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$LBRACKET`，定义 `src/core/angular2parse/angular/compiler` 中的LBRACKET。
 */
export const $LBRACKET = 91;
/**
 * Constant/variable `$BACKSLASH` defining backslash in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$BACKSLASH`，定义 `src/core/angular2parse/angular/compiler` 中的BACKSLASH。
 */
export const $BACKSLASH = 92;
/**
 * Constant/variable `$RBRACKET` defining rbracket in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$RBRACKET`，定义 `src/core/angular2parse/angular/compiler` 中的RBRACKET。
 */
export const $RBRACKET = 93;
/**
 * Constant/variable `$CARET` defining caret in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$CARET`，定义 `src/core/angular2parse/angular/compiler` 中的CARET。
 */
export const $CARET = 94;
/**
 * Constant/variable `$_` defining $_ in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$_`，定义 `src/core/angular2parse/angular/compiler` 中的$_。
 */
export const $_ = 95;

/**
 * Constant/variable `$a` defining a in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$a`，定义 `src/core/angular2parse/angular/compiler` 中的a。
 */
export const $a = 97;
/**
 * Constant/variable `$e` defining e in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$e`，定义 `src/core/angular2parse/angular/compiler` 中的e。
 */
export const $e = 101;
/**
 * Constant/variable `$f` defining f in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$f`，定义 `src/core/angular2parse/angular/compiler` 中的f。
 */
export const $f = 102;
/**
 * Constant/variable `$n` defining n in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$n`，定义 `src/core/angular2parse/angular/compiler` 中的n。
 */
export const $n = 110;
/**
 * Constant/variable `$r` defining r in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$r`，定义 `src/core/angular2parse/angular/compiler` 中的r。
 */
export const $r = 114;
/**
 * Constant/variable `$t` defining t in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$t`，定义 `src/core/angular2parse/angular/compiler` 中的t。
 */
export const $t = 116;
/**
 * Constant/variable `$u` defining u in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$u`，定义 `src/core/angular2parse/angular/compiler` 中的u。
 */
export const $u = 117;
/**
 * Constant/variable `$v` defining v in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$v`，定义 `src/core/angular2parse/angular/compiler` 中的v。
 */
export const $v = 118;
/**
 * Constant/variable `$x` defining x in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$x`，定义 `src/core/angular2parse/angular/compiler` 中的X坐标。
 */
export const $x = 120;
/**
 * Constant/variable `$z` defining z in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$z`，定义 `src/core/angular2parse/angular/compiler` 中的Z坐标。
 */
export const $z = 122;

/**
 * Constant/variable `$LBRACE` defining lbrace in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$LBRACE`，定义 `src/core/angular2parse/angular/compiler` 中的LBRACE。
 */
export const $LBRACE = 123;
/**
 * Constant/variable `$BAR` defining bar in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$BAR`，定义 `src/core/angular2parse/angular/compiler` 中的条。
 */
export const $BAR = 124;
/**
 * Constant/variable `$RBRACE` defining rbrace in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$RBRACE`，定义 `src/core/angular2parse/angular/compiler` 中的RBRACE。
 */
export const $RBRACE = 125;
/**
 * Constant/variable `$NBSP` defining nbsp in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$NBSP`，定义 `src/core/angular2parse/angular/compiler` 中的NBSP。
 */
export const $NBSP = 160;

/**
 * Constant/variable `$PIPE` defining pipe in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$PIPE`，定义 `src/core/angular2parse/angular/compiler` 中的管道。
 */
export const $PIPE = 124;
/**
 * Constant/variable `$TILDA` defining tilda in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$TILDA`，定义 `src/core/angular2parse/angular/compiler` 中的TILDA。
 */
export const $TILDA = 126;
/**
 * Constant/variable `$AT` defining at in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$AT`，定义 `src/core/angular2parse/angular/compiler` 中的位于。
 */
export const $AT = 64;

/**
 * Constant/variable `$BT` defining bt in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `$BT`，定义 `src/core/angular2parse/angular/compiler` 中的BT。
 */
export const $BT = 96;

/**
 * Executes `isWhitespace` to handle is whitespace.
 * @zh 执行 `isWhitespace`，用于是否为Whitespace。
 * @param code - code parameter (`number`) / 编码参数（`number`）
 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
 */
export function isWhitespace(code: number): boolean {
    return (code >= $TAB && code <= $SPACE) || (code == $NBSP);
}

/**
 * Executes `isDigit` to handle is digit.
 * @zh 执行 `isDigit`，用于是否为Digit。
 * @param code - code parameter (`number`) / 编码参数（`number`）
 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
 */
export function isDigit(code: number): boolean {
    return $0 <= code && code <= $9;
}

/**
 * Executes `isAsciiLetter` to handle is ascii letter.
 * @zh 执行 `isAsciiLetter`，用于是否为AsciiLetter。
 * @param code - code parameter (`number`) / 编码参数（`number`）
 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
 */
export function isAsciiLetter(code: number): boolean {
    return code >= $a && code <= $z || code >= $A && code <= $Z;
}

/**
 * Executes `isAsciiHexDigit` to handle is ascii hex digit.
 * @zh 执行 `isAsciiHexDigit`，用于是否为Ascii十六进制颜色Digit。
 * @param code - code parameter (`number`) / 编码参数（`number`）
 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
 */
export function isAsciiHexDigit(code: number): boolean {
    return code >= $a && code <= $f || code >= $A && code <= $F || isDigit(code);
}