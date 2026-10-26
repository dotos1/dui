/**
 * @fileoverview Module `src/core/angular2parse/angular/compiler/lexer.ts` providing lexer definitions and implementation.
 * @zh 模块文件 `src/core/angular2parse/angular/compiler/lexer.ts`，提供lexer相关的定义与实现。
 */


import * as chars from './chars';
import {NumberWrapper} from '../facade/lang';

/**
 * Enumeration `TokenType` defining supported token type constants.
 * @zh 枚举 `TokenType`，定义支持的令牌类型常量集合。
 */
export enum TokenType {
    /**
     * Enum member `TokenType.Character` representing character.
     * @zh 枚举项 `TokenType.Character`，表示字符。
     */
    Character,
    /**
     * Enum member `TokenType.Identifier` representing identifier.
     * @zh 枚举项 `TokenType.Identifier`，表示Identifier。
     */
    Identifier,
    /**
     * Enum member `TokenType.Keyword` representing keyword.
     * @zh 枚举项 `TokenType.Keyword`，表示Keyword。
     */
    Keyword,
    /**
     * Enum member `TokenType.String` representing string.
     * @zh 枚举项 `TokenType.String`，表示字符串。
     */
    String,
    /**
     * Enum member `TokenType.Operator` representing operator.
     * @zh 枚举项 `TokenType.Operator`，表示操作符。
     */
    Operator,
    /**
     * Enum member `TokenType.Number` representing number.
     * @zh 枚举项 `TokenType.Number`，表示数字。
     */
    Number,
    /**
     * Enum member `TokenType.Error` representing error.
     * @zh 枚举项 `TokenType.Error`，表示错误。
     */
    Error
}

/**
 * Constant/variable `KEYWORDS` defining keywords in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `KEYWORDS`，定义 `src/core/angular2parse/angular/compiler` 中的KEYWORDS。
 */
const KEYWORDS = ['var', 'let', 'null', 'undefined', 'true', 'false', 'if', 'else', 'this'];

/**
 * Class `Lexer` encapsulating lexer data structures and logic in `src/core/angular2parse/angular/compiler`.
 * @zh 类 `Lexer`，封装 `src/core/angular2parse/angular/compiler` 中的Lexer数据结构与处理逻辑。
 */
export class Lexer {
    /**
     * Executes `tokenize` to handle tokenize.
     * @zh 执行 `tokenize`，用于tokenize。
     * @param text - text parameter (`string`) / 文本参数（`string`）
     * @returns Result of type `Token[]` / 类型为 `Token[]` 的返回值
     */
    tokenize(text: string): Token[] {
        const scanner = new _Scanner(text);
        const tokens: Token[] = [];
        let token = scanner.scanToken();
        while (token != null) {
            tokens.push(token);
            token = scanner.scanToken();
        }
        return tokens;
    }
}

/**
 * Class `Token` encapsulating token data structures and logic in `src/core/angular2parse/angular/compiler`.
 * @zh 类 `Token`，封装 `src/core/angular2parse/angular/compiler` 中的令牌数据结构与处理逻辑。
 */
export class Token {
    /**
     * Creates an instance of `Token` and initializes its dependencies and internal state.
     * @zh 创建 `Token` 实例，并初始化其依赖项与内部状态。
     * @param index - Injected or initial index (`number`) / 注入或传入的索引（`number`）
     * @param type - Injected or initial type (`TokenType`) / 注入或传入的类型（`TokenType`）
     * @param numValue - Injected or initial num value (`number`) / 注入或传入的数值值（`number`）
     * @param strValue - Injected or initial str value (`string`) / 注入或传入的字符串值（`string`）
     */
    constructor(
        public index: number, public type: TokenType, public numValue: number,
        public strValue: string) {}

    /**
     * Executes `isCharacter` to handle is character.
     * @zh 执行 `isCharacter`，用于是否为字符。
     * @param code - code parameter (`number`) / 编码参数（`number`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    isCharacter(code: number): boolean {
        return this.type == TokenType.Character && this.numValue == code;
    }

    /**
     * Executes `isNumber` to handle is number.
     * @zh 执行 `isNumber`，用于是否为数字。
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    isNumber(): boolean { return this.type == TokenType.Number; }

    /**
     * Executes `isString` to handle is string.
     * @zh 执行 `isString`，用于是否为字符串。
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    isString(): boolean { return this.type == TokenType.String; }

    /**
     * Executes `isOperator` to handle is operator.
     * @zh 执行 `isOperator`，用于是否为操作符。
     * @param operater - operater parameter (`string`) / operater参数（`string`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    isOperator(operater: string): boolean {
        return this.type == TokenType.Operator && this.strValue == operater;
    }

    /**
     * Executes `isIdentifier` to handle is identifier.
     * @zh 执行 `isIdentifier`，用于是否为Identifier。
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    isIdentifier(): boolean { return this.type == TokenType.Identifier; }

    /**
     * Executes `isKeyword` to handle is keyword.
     * @zh 执行 `isKeyword`，用于是否为Keyword。
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    isKeyword(): boolean { return this.type == TokenType.Keyword; }

    /**
     * Executes `isKeywordLet` to handle is keyword let.
     * @zh 执行 `isKeywordLet`，用于是否为KeywordLet。
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    isKeywordLet(): boolean { return this.type == TokenType.Keyword && this.strValue == 'let'; }

    /**
     * Executes `isKeywordNull` to handle is keyword null.
     * @zh 执行 `isKeywordNull`，用于是否为Keyword空值。
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    isKeywordNull(): boolean { return this.type == TokenType.Keyword && this.strValue == 'null'; }

    /**
     * Executes `isKeywordUndefined` to handle is keyword undefined.
     * @zh 执行 `isKeywordUndefined`，用于是否为Keyword未定义。
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    isKeywordUndefined(): boolean {
        return this.type == TokenType.Keyword && this.strValue == 'undefined';
    }

    /**
     * Executes `isKeywordTrue` to handle is keyword true.
     * @zh 执行 `isKeywordTrue`，用于是否为KeywordTrue。
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    isKeywordTrue(): boolean { return this.type == TokenType.Keyword && this.strValue == 'true'; }

    /**
     * Executes `isKeywordFalse` to handle is keyword false.
     * @zh 执行 `isKeywordFalse`，用于是否为KeywordFalse。
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    isKeywordFalse(): boolean { return this.type == TokenType.Keyword && this.strValue == 'false'; }

    /**
     * Executes `isKeywordThis` to handle is keyword this.
     * @zh 执行 `isKeywordThis`，用于是否为KeywordThis。
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    isKeywordThis(): boolean { return this.type == TokenType.Keyword && this.strValue == 'this'; }

    /**
     * Executes `isError` to handle is error.
     * @zh 执行 `isError`，用于是否为错误。
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    isError(): boolean { return this.type == TokenType.Error; }

    /**
     * Executes `toNumber` to handle to number.
     * @zh 执行 `toNumber`，用于转换为数字。
     * @returns Result of type `number` / 类型为 `number` 的返回值
     */
    toNumber(): number { return this.type == TokenType.Number ? this.numValue : -1; }

    /**
     * Executes `toString` to handle to string.
     * @zh 执行 `toString`，用于转换为字符串。
     * @returns Result of type `string` / 类型为 `string` 的返回值
     */
    toString(): string {
        switch (this.type) {
            case TokenType.Character:
            case TokenType.Identifier:
            case TokenType.Keyword:
            case TokenType.Operator:
            case TokenType.String:
            case TokenType.Error:
                return this.strValue;
            case TokenType.Number:
                return this.numValue.toString();
            default:
                return null;
        }
    }
}

/**
 * Executes `newCharacterToken` to handle new character token.
 * @zh 执行 `newCharacterToken`，用于新字符令牌。
 * @param index - index parameter (`number`) / 索引参数（`number`）
 * @param code - code parameter (`number`) / 编码参数（`number`）
 * @returns Result of type `Token` / 类型为 `Token` 的返回值
 */
function newCharacterToken(index: number, code: number): Token {
    return new Token(index, TokenType.Character, code, String.fromCharCode(code));
}

/**
 * Executes `newIdentifierToken` to handle new identifier token.
 * @zh 执行 `newIdentifierToken`，用于新Identifier令牌。
 * @param index - index parameter (`number`) / 索引参数（`number`）
 * @param text - text parameter (`string`) / 文本参数（`string`）
 * @returns Result of type `Token` / 类型为 `Token` 的返回值
 */
function newIdentifierToken(index: number, text: string): Token {
    return new Token(index, TokenType.Identifier, 0, text);
}

/**
 * Executes `newKeywordToken` to handle new keyword token.
 * @zh 执行 `newKeywordToken`，用于新Keyword令牌。
 * @param index - index parameter (`number`) / 索引参数（`number`）
 * @param text - text parameter (`string`) / 文本参数（`string`）
 * @returns Result of type `Token` / 类型为 `Token` 的返回值
 */
function newKeywordToken(index: number, text: string): Token {
    return new Token(index, TokenType.Keyword, 0, text);
}

/**
 * Executes `newOperatorToken` to handle new operator token.
 * @zh 执行 `newOperatorToken`，用于新操作符令牌。
 * @param index - index parameter (`number`) / 索引参数（`number`）
 * @param text - text parameter (`string`) / 文本参数（`string`）
 * @returns Result of type `Token` / 类型为 `Token` 的返回值
 */
function newOperatorToken(index: number, text: string): Token {
    return new Token(index, TokenType.Operator, 0, text);
}

/**
 * Executes `newStringToken` to handle new string token.
 * @zh 执行 `newStringToken`，用于新字符串令牌。
 * @param index - index parameter (`number`) / 索引参数（`number`）
 * @param text - text parameter (`string`) / 文本参数（`string`）
 * @returns Result of type `Token` / 类型为 `Token` 的返回值
 */
function newStringToken(index: number, text: string): Token {
    return new Token(index, TokenType.String, 0, text);
}

/**
 * Executes `newNumberToken` to handle new number token.
 * @zh 执行 `newNumberToken`，用于新数字令牌。
 * @param index - index parameter (`number`) / 索引参数（`number`）
 * @param n - n parameter (`number`) / n参数（`number`）
 * @returns Result of type `Token` / 类型为 `Token` 的返回值
 */
function newNumberToken(index: number, n: number): Token {
    return new Token(index, TokenType.Number, n, '');
}

/**
 * Executes `newErrorToken` to handle new error token.
 * @zh 执行 `newErrorToken`，用于新错误令牌。
 * @param index - index parameter (`number`) / 索引参数（`number`）
 * @param message - message parameter (`string`) / 消息参数（`string`）
 * @returns Result of type `Token` / 类型为 `Token` 的返回值
 */
function newErrorToken(index: number, message: string): Token {
    return new Token(index, TokenType.Error, 0, message);
}

/**
 * Constant/variable `EOF` defining eof in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `EOF`，定义 `src/core/angular2parse/angular/compiler` 中的EOF。
 */
export const EOF: Token = new Token(-1, TokenType.Character, 0, '');

/**
 * Class `_Scanner` encapsulating scanner data structures and logic in `src/core/angular2parse/angular/compiler`.
 * @zh 类 `_Scanner`，封装 `src/core/angular2parse/angular/compiler` 中的扫描器数据结构与处理逻辑。
 */
class _Scanner {
    /**
     * Property `length` (`number`) storing length.
     * @zh 属性 `length`（类型：`number`），用于存储或配置长度。
     */
    length: number;
    /**
     * Property `peek` (`number`) storing peek (default: `0`).
     * @zh 属性 `peek`（类型：`number`），用于存储或配置peek（默认值：`0`）。
     */
    peek: number = 0;
    /**
     * Property `index` (`number`) storing index (default: `-1`).
     * @zh 属性 `index`（类型：`number`），用于存储或配置索引（默认值：`-1`）。
     */
    index: number = -1;

    /**
     * Creates an instance of `_Scanner` and initializes its dependencies and internal state.
     * @zh 创建 `_Scanner` 实例，并初始化其依赖项与内部状态。
     * @param input - Injected or initial input (`string`) / 注入或传入的输入属性（`string`）
     */
    constructor(public input: string) {
        this.length = input.length;
        this.advance();
    }

    /**
     * Executes `advance` to handle advance.
     * @zh 执行 `advance`，用于advance。
     */
    advance() {
        this.peek = ++this.index >= this.length ? chars.$EOF : this.input.charCodeAt(this.index);
    }

    /**
     * Executes `scanToken` to handle scan token.
     * @zh 执行 `scanToken`，用于scan令牌。
     * @returns Result of type `Token` / 类型为 `Token` 的返回值
     */
    scanToken(): Token {
        const input = this.input, length = this.length;
        let peek = this.peek, index = this.index;

        // Skip whitespace.
        while (peek <= chars.$SPACE) {
            if (++index >= length) {
                peek = chars.$EOF;
                break;
            } else {
                peek = input.charCodeAt(index);
            }
        }

        this.peek = peek;
        this.index = index;

        if (index >= length) {
            return null;
        }

        // Handle identifiers and numbers.
        if (isIdentifierStart(peek)) return this.scanIdentifier();
        if (chars.isDigit(peek)) return this.scanNumber(index);

        const start: number = index;
        switch (peek) {
            case chars.$PERIOD:
                this.advance();
                return chars.isDigit(this.peek) ? this.scanNumber(start) :
                    newCharacterToken(start, chars.$PERIOD);
            case chars.$LPAREN:
            case chars.$RPAREN:
            case chars.$LBRACE:
            case chars.$RBRACE:
            case chars.$LBRACKET:
            case chars.$RBRACKET:
            case chars.$COMMA:
            case chars.$COLON:
            case chars.$SEMICOLON:
                return this.scanCharacter(start, peek);
            case chars.$SQ:
            case chars.$DQ:
                return this.scanString();
            case chars.$HASH:
            case chars.$PLUS:
            case chars.$MINUS:
            case chars.$STAR:
            case chars.$SLASH:
            case chars.$PERCENT:
            case chars.$CARET:
                return this.scanOperator(start, String.fromCharCode(peek));
            case chars.$QUESTION:
                return this.scanComplexOperator(start, '?', chars.$PERIOD, '.');
            case chars.$LT:
            case chars.$GT:
                return this.scanComplexOperator(start, String.fromCharCode(peek), chars.$EQ, '=');
            case chars.$BANG:
            case chars.$EQ:
                return this.scanComplexOperator(
                    start, String.fromCharCode(peek), chars.$EQ, '=', chars.$EQ, '=');
            case chars.$AMPERSAND:
                return this.scanComplexOperator(start, '&', chars.$AMPERSAND, '&');
            case chars.$BAR:
                return this.scanComplexOperator(start, '|', chars.$BAR, '|');
            case chars.$NBSP:
                while (chars.isWhitespace(this.peek)) this.advance();
                return this.scanToken();
        }

        this.advance();
        return this.error(`Unexpected character [${String.fromCharCode(peek)}]`, 0);
    }

    /**
     * Executes `scanCharacter` to handle scan character.
     * @zh 执行 `scanCharacter`，用于scan字符。
     * @param start - start parameter (`number`) / 开始参数（`number`）
     * @param code - code parameter (`number`) / 编码参数（`number`）
     * @returns Result of type `Token` / 类型为 `Token` 的返回值
     */
    scanCharacter(start: number, code: number): Token {
        this.advance();
        return newCharacterToken(start, code);
    }


    /**
     * Executes `scanOperator` to handle scan operator.
     * @zh 执行 `scanOperator`，用于scan操作符。
     * @param start - start parameter (`number`) / 开始参数（`number`）
     * @param str - str parameter (`string`) / 字符串参数（`string`）
     * @returns Result of type `Token` / 类型为 `Token` 的返回值
     */
    scanOperator(start: number, str: string): Token {
        this.advance();
        return newOperatorToken(start, str);
    }

    /**
     * Tokenize a 2/3 char long operator
     *
     * @param start start index in the expression
     * @param one first symbol (always part of the operator)
     * @param twoCode code point for the second symbol
     * @param two second symbol (part of the operator when the second code point matches)
     * @param threeCode code point for the third symbol
     * @param three third symbol (part of the operator when provided and matches source expression)
     * @returns {Token}

     * @zh 执行 `scanComplexOperator`，用于scanComplex操作符。
     */
    scanComplexOperator(
        start: number, one: string, twoCode: number, two: string, threeCode?: number,
        three?: string): Token {
        this.advance();
        let str: string = one;
        if (this.peek == twoCode) {
            this.advance();
            str += two;
        }
        if (threeCode != null && this.peek == threeCode) {
            this.advance();
            str += three;
        }
        return newOperatorToken(start, str);
    }

    /**
     * Executes `scanIdentifier` to handle scan identifier.
     * @zh 执行 `scanIdentifier`，用于scanIdentifier。
     * @returns Result of type `Token` / 类型为 `Token` 的返回值
     */
    scanIdentifier(): Token {
        const start: number = this.index;
        this.advance();
        while (isIdentifierPart(this.peek)) this.advance();
        const str: string = this.input.substring(start, this.index);
        return KEYWORDS.indexOf(str) > -1 ? newKeywordToken(start, str) :
            newIdentifierToken(start, str);
    }

    /**
     * Executes `scanNumber` to handle scan number.
     * @zh 执行 `scanNumber`，用于scan数字。
     * @param start - start parameter (`number`) / 开始参数（`number`）
     * @returns Result of type `Token` / 类型为 `Token` 的返回值
     */
    scanNumber(start: number): Token {
        let simple: boolean = (this.index === start);
        this.advance();  // Skip initial digit.
        while (true) {
            if (chars.isDigit(this.peek)) {
                // Do nothing.
            } else if (this.peek == chars.$PERIOD) {
                simple = false;
            } else if (isExponentStart(this.peek)) {
                this.advance();
                if (isExponentSign(this.peek)) this.advance();
                if (!chars.isDigit(this.peek)) return this.error('Invalid exponent', -1);
                simple = false;
            } else {
                break;
            }
            this.advance();
        }
        const str: string = this.input.substring(start, this.index);
        const value: number = simple ? NumberWrapper.parseIntAutoRadix(str) : parseFloat(str);
        return newNumberToken(start, value);
    }

    /**
     * Executes `scanString` to handle scan string.
     * @zh 执行 `scanString`，用于scan字符串。
     * @returns Result of type `Token` / 类型为 `Token` 的返回值
     */
    scanString(): Token {
        const start: number = this.index;
        const quote: number = this.peek;
        this.advance();  // Skip initial quote.

        let buffer: string = '';
        let marker: number = this.index;
        const input: string = this.input;

        while (this.peek != quote) {
            if (this.peek == chars.$BACKSLASH) {
                buffer += input.substring(marker, this.index);
                this.advance();
                let unescapedCode: number;
                // Workaround for TS2.1-introduced type strictness
                // this.peek = this.peek;
                //@ts-ignore
                if (this.peek == chars.$u) {
                    // 4 character hex code for unicode character.
                    const hex: string = input.substring(this.index + 1, this.index + 5);
                    if (/^[0-9a-f]+$/i.test(hex)) {
                        unescapedCode = parseInt(hex, 16);
                    } else {
                        return this.error(`Invalid unicode escape [\\u${hex}]`, 0);
                    }
                    for (let i: number = 0; i < 5; i++) {
                        this.advance();
                    }
                } else {
                    unescapedCode = unescape(this.peek);
                    this.advance();
                }
                buffer += String.fromCharCode(unescapedCode);
                marker = this.index;
            } else if (this.peek == chars.$EOF) {
                return this.error('Unterminated quote', 0);
            } else {
                this.advance();
            }
        }

        const last: string = input.substring(marker, this.index);
        this.advance();  // Skip terminating quote.

        return newStringToken(start, buffer + last);
    }

    /**
     * Executes `error` to handle error.
     * @zh 执行 `error`，用于错误。
     * @param message - message parameter (`string`) / 消息参数（`string`）
     * @param offset - offset parameter (`number`) / 偏移量参数（`number`）
     * @returns Result of type `Token` / 类型为 `Token` 的返回值
     */
    error(message: string, offset: number): Token {
        const position: number = this.index + offset;
        return newErrorToken(
            position, `Lexer Error: ${message} at column ${position} in expression [${this.input}]`);
    }
}

/**
 * Executes `isIdentifierStart` to handle is identifier start.
 * @zh 执行 `isIdentifierStart`，用于是否为Identifier开始。
 * @param code - code parameter (`number`) / 编码参数（`number`）
 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
 */
function isIdentifierStart(code: number): boolean {
    return (chars.$a <= code && code <= chars.$z) || (chars.$A <= code && code <= chars.$Z) ||
        (code == chars.$_) || (code == chars.$$);
}

/**
 * Executes `isIdentifier` to handle is identifier.
 * @zh 执行 `isIdentifier`，用于是否为Identifier。
 * @param input - input parameter (`string`) / 输入属性参数（`string`）
 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
 */
export function isIdentifier(input: string): boolean {
    if (input.length == 0) return false;
    const scanner = new _Scanner(input);
    if (!isIdentifierStart(scanner.peek)) return false;
    scanner.advance();
    while (scanner.peek !== chars.$EOF) {
        if (!isIdentifierPart(scanner.peek)) return false;
        scanner.advance();
    }
    return true;
}

/**
 * Executes `isIdentifierPart` to handle is identifier part.
 * @zh 执行 `isIdentifierPart`，用于是否为IdentifierPart。
 * @param code - code parameter (`number`) / 编码参数（`number`）
 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
 */
function isIdentifierPart(code: number): boolean {
    return chars.isAsciiLetter(code) || chars.isDigit(code) || (code == chars.$_) ||
        (code == chars.$$);
}

/**
 * Executes `isExponentStart` to handle is exponent start.
 * @zh 执行 `isExponentStart`，用于是否为Exponent开始。
 * @param code - code parameter (`number`) / 编码参数（`number`）
 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
 */
function isExponentStart(code: number): boolean {
    return code == chars.$e || code == chars.$E;
}

/**
 * Executes `isExponentSign` to handle is exponent sign.
 * @zh 执行 `isExponentSign`，用于是否为ExponentSign。
 * @param code - code parameter (`number`) / 编码参数（`number`）
 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
 */
function isExponentSign(code: number): boolean {
    return code == chars.$MINUS || code == chars.$PLUS;
}

/**
 * Executes `isQuote` to handle is quote.
 * @zh 执行 `isQuote`，用于是否为Quote。
 * @param code - code parameter (`number`) / 编码参数（`number`）
 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
 */
export function isQuote(code: number): boolean {
    return code === chars.$SQ || code === chars.$DQ || code === chars.$BT;
}

/**
 * Executes `unescape` to handle unescape.
 * @zh 执行 `unescape`，用于unescape。
 * @param code - code parameter (`number`) / 编码参数（`number`）
 * @returns Result of type `number` / 类型为 `number` 的返回值
 */
function unescape(code: number): number {
    switch (code) {
        case chars.$n:
            return chars.$LF;
        case chars.$f:
            return chars.$FF;
        case chars.$r:
            return chars.$CR;
        case chars.$t:
            return chars.$TAB;
        case chars.$v:
            return chars.$VTAB;
        default:
            return code;
    }
}