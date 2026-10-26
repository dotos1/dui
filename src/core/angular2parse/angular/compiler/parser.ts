/**
 * @fileoverview Module `src/core/angular2parse/angular/compiler/parser.ts` providing parser definitions and implementation.
 * @zh 模块文件 `src/core/angular2parse/angular/compiler/parser.ts`，提供解析器相关的定义与实现。
 */


import * as chars from './chars';
import {escapeRegExp, isBlank, isPresent} from '../facade/lang';
import {DEFAULT_INTERPOLATION_CONFIG, InterpolationConfig} from './interpolation-config';

import {AST, ASTWithSource, AstVisitor, Binary, BindingPipe, Chain, Conditional, EmptyExpr, FunctionCall, ImplicitReceiver, Interpolation, KeyedRead, KeyedWrite, LiteralArray, LiteralMap, LiteralPrimitive, MethodCall, ParseSpan, ParserError, PrefixNot, PropertyRead, PropertyWrite, Quote, SafeMethodCall, SafePropertyRead, TemplateBinding} from './ast';
import {EOF, Lexer, Token, TokenType, isIdentifier, isQuote} from './lexer';


/**
 * Class `SplitInterpolation` encapsulating split interpolation data structures and logic in `src/core/angular2parse/angular/compiler`.
 * @zh 类 `SplitInterpolation`，封装 `src/core/angular2parse/angular/compiler` 中的分割面板Interpolation数据结构与处理逻辑。
 */
export class SplitInterpolation {
    /**
     * Creates an instance of `SplitInterpolation` and initializes its dependencies and internal state.
     * @zh 创建 `SplitInterpolation` 实例，并初始化其依赖项与内部状态。
     * @param strings - Injected or initial strings (`string[]`) / 注入或传入的字符串（`string[]`）
     * @param expressions - Injected or initial expressions (`string[]`) / 注入或传入的表达式（`string[]`）
     * @param offsets - Injected or initial offsets (`number[]`) / 注入或传入的偏移量（`number[]`）
     */
    constructor(public strings: string[], public expressions: string[], public offsets: number[]) {}
}

/**
 * Class `TemplateBindingParseResult` encapsulating template binding parse result data structures and logic in `src/core/angular2parse/angular/compiler`.
 * @zh 类 `TemplateBindingParseResult`，封装 `src/core/angular2parse/angular/compiler` 中的模板绑定解析结果数据结构与处理逻辑。
 */
export class TemplateBindingParseResult {
    /**
     * Creates an instance of `TemplateBindingParseResult` and initializes its dependencies and internal state.
     * @zh 创建 `TemplateBindingParseResult` 实例，并初始化其依赖项与内部状态。
     * @param templateBindings - Injected or initial template bindings (`TemplateBinding[]`) / 注入或传入的模板Bindings（`TemplateBinding[]`）
     * @param warnings - Injected or initial warnings (`string[]`) / 注入或传入的警告（`string[]`）
     * @param errors - Injected or initial errors (`ParserError[]`) / 注入或传入的错误列表（`ParserError[]`）
     */
    constructor(
        public templateBindings: TemplateBinding[], public warnings: string[],
        public errors: ParserError[]) {}
}

/**
 * Executes `_createInterpolateRegExp` to handle create interpolate reg exp.
 * @zh 执行 `_createInterpolateRegExp`，用于创建InterpolateRegExp。
 * @param config - config parameter (`InterpolationConfig`) / 配置参数（`InterpolationConfig`）
 * @returns Result of type `RegExp` / 类型为 `RegExp` 的返回值
 */
function _createInterpolateRegExp(config: InterpolationConfig): RegExp {
    const pattern = escapeRegExp(config.start) + '([\\s\\S]*?)' + escapeRegExp(config.end);
    return new RegExp(pattern, 'g');
}

/**
 * Class `Parser` encapsulating parser data structures and logic in `src/core/angular2parse/angular/compiler`.
 * @zh 类 `Parser`，封装 `src/core/angular2parse/angular/compiler` 中的解析器数据结构与处理逻辑。
 */
export class Parser {
    /**
     * Property `errors` (`ParserError[]`) storing errors (default: `[]`).
     * @zh 属性 `errors`（类型：`ParserError[]`），用于存储或配置错误列表（默认值：`[]`）。
     */
    private errors: ParserError[] = [];

    /**
     * Creates an instance of `Parser` and initializes its dependencies and internal state.
     * @zh 创建 `Parser` 实例，并初始化其依赖项与内部状态。
     * @param _lexer - Injected or initial lexer (`Lexer`) / 注入或传入的lexer（`Lexer`）
     */
    constructor(private _lexer: Lexer) {}

    /**
     * Executes `parseAction` to handle parse action.
     * @zh 执行 `parseAction`，用于解析动作。
     * @param input - input parameter (`string`) / 输入属性参数（`string`）
     * @param location - location parameter (`any`) / location参数（`any`）
     * @param interpolationConfig - interpolation config parameter (`InterpolationConfig`) / interpolation配置参数（`InterpolationConfig`）
     * @returns Result of type `ASTWithSource` / 类型为 `ASTWithSource` 的返回值
     */
    parseAction(
        input: string, location,
        interpolationConfig: InterpolationConfig = DEFAULT_INTERPOLATION_CONFIG): ASTWithSource {
        this._checkNoInterpolation(input, location, interpolationConfig);
        const sourceToLex = this._stripComments(input);
        const tokens = this._lexer.tokenize(this._stripComments(input));
        const ast = new _ParseAST(
            input, location, tokens, sourceToLex.length, true, this.errors,
            input.length - sourceToLex.length)
            .parseChain();
        return new ASTWithSource(ast, input, location, this.errors);
    }

    /**
     * Executes `parseBinding` to handle parse binding.
     * @zh 执行 `parseBinding`，用于解析绑定。
     * @param input - input parameter (`string`) / 输入属性参数（`string`）
     * @param location - location parameter (`any`) / location参数（`any`）
     * @param interpolationConfig - interpolation config parameter (`InterpolationConfig`) / interpolation配置参数（`InterpolationConfig`）
     * @returns Result of type `ASTWithSource` / 类型为 `ASTWithSource` 的返回值
     */
    parseBinding(
        input: string, location,
        interpolationConfig: InterpolationConfig = DEFAULT_INTERPOLATION_CONFIG): ASTWithSource {
        const ast = this._parseBindingAst(input, location, interpolationConfig);
        return new ASTWithSource(ast, input, location, this.errors);
    }

    /**
     * Executes `parseSimpleBinding` to handle parse simple binding.
     * @zh 执行 `parseSimpleBinding`，用于解析Simple绑定。
     * @param input - input parameter (`string`) / 输入属性参数（`string`）
     * @param location - location parameter (`string`) / location参数（`string`）
     * @param interpolationConfig - interpolation config parameter (`InterpolationConfig`) / interpolation配置参数（`InterpolationConfig`）
     * @returns Result of type `ASTWithSource` / 类型为 `ASTWithSource` 的返回值
     */
    parseSimpleBinding(
        input: string, location: string,
        interpolationConfig: InterpolationConfig = DEFAULT_INTERPOLATION_CONFIG): ASTWithSource {
        const ast = this._parseBindingAst(input, location, interpolationConfig);
        const errors = SimpleExpressionChecker.check(ast);
        if (errors.length > 0) {
            this._reportError(
                `Host binding expression cannot contain ${errors.join(' ')}`, input, location);
        }
        return new ASTWithSource(ast, input, location, this.errors);
    }

    /**
     * Executes `_reportError` to handle report error.
     * @zh 执行 `_reportError`，用于report错误。
     * @param message - message parameter (`string`) / 消息参数（`string`）
     * @param input - input parameter (`string`) / 输入属性参数（`string`）
     * @param errLocation - err location parameter (`string`) / 错误Location参数（`string`）
     * @param ctxLocation - ctx location parameter (`any`) / 上下文Location参数（`any`）
     */
    private _reportError(message: string, input: string, errLocation: string, ctxLocation?) {
        this.errors.push(new ParserError(message, input, errLocation, ctxLocation));
    }

    /**
     * Executes `_parseBindingAst` to handle parse binding ast.
     * @zh 执行 `_parseBindingAst`，用于解析绑定抽象语法树。
     * @param input - input parameter (`string`) / 输入属性参数（`string`）
     * @param location - location parameter (`string`) / location参数（`string`）
     * @param interpolationConfig - interpolation config parameter (`InterpolationConfig`) / interpolation配置参数（`InterpolationConfig`）
     * @returns Result of type `AST` / 类型为 `AST` 的返回值
     */
    private _parseBindingAst(
        input: string, location: string, interpolationConfig: InterpolationConfig): AST {
        // Quotes expressions use 3rd-party expression language. We don't want to use
        // our lexer or parser for that, so we check for that ahead of time.
        const quote = this._parseQuote(input, location);

        if (isPresent(quote)) {
            return quote;
        }

        this._checkNoInterpolation(input, location, interpolationConfig);
        const sourceToLex = this._stripComments(input);
        const tokens = this._lexer.tokenize(sourceToLex);
        return new _ParseAST(
            input, location, tokens, sourceToLex.length, false, this.errors,
            input.length - sourceToLex.length)
            .parseChain();
    }

    /**
     * Executes `_parseQuote` to handle parse quote.
     * @zh 执行 `_parseQuote`，用于解析Quote。
     * @param input - input parameter (`string`) / 输入属性参数（`string`）
     * @param location - location parameter (`any`) / location参数（`any`）
     * @returns Result of type `AST` / 类型为 `AST` 的返回值
     */
    private _parseQuote(input: string, location): AST {
        if (isBlank(input)) return null;
        const prefixSeparatorIndex = input.indexOf(':');
        if (prefixSeparatorIndex == -1) return null;
        const prefix = input.substring(0, prefixSeparatorIndex).trim();
        if (!isIdentifier(prefix)) return null;
        const uninterpretedExpression = input.substring(prefixSeparatorIndex + 1);
        return new Quote(new ParseSpan(0, input.length), prefix, uninterpretedExpression, location);
    }

    /**
     * Executes `parseTemplateBindings` to handle parse template bindings.
     * @zh 执行 `parseTemplateBindings`，用于解析模板Bindings。
     * @param prefixToken - prefix token parameter (`string`) / 前缀令牌参数（`string`）
     * @param input - input parameter (`string`) / 输入属性参数（`string`）
     * @param location - location parameter (`any`) / location参数（`any`）
     * @returns Result of type `TemplateBindingParseResult` / 类型为 `TemplateBindingParseResult` 的返回值
     */
    parseTemplateBindings(prefixToken: string, input: string, location):
    TemplateBindingParseResult {
        const tokens = this._lexer.tokenize(input);
        if (prefixToken) {
            // Prefix the tokens with the tokens from prefixToken but have them take no space (0 index).
            const prefixTokens = this._lexer.tokenize(prefixToken).map(t => {
                t.index = 0;
                return t;
            });
            tokens.unshift(...prefixTokens);
        }
        return new _ParseAST(input, location, tokens, input.length, false, this.errors, 0)
            .parseTemplateBindings();
    }

    /**
     * Executes `parseInterpolation` to handle parse interpolation.
     * @zh 执行 `parseInterpolation`，用于解析Interpolation。
     * @param input - input parameter (`string`) / 输入属性参数（`string`）
     * @param location - location parameter (`any`) / location参数（`any`）
     * @param interpolationConfig - interpolation config parameter (`InterpolationConfig`) / interpolation配置参数（`InterpolationConfig`）
     * @returns Result of type `ASTWithSource` / 类型为 `ASTWithSource` 的返回值
     */
    parseInterpolation(
        input: string, location,
        interpolationConfig: InterpolationConfig = DEFAULT_INTERPOLATION_CONFIG): ASTWithSource {
        const split = this.splitInterpolation(input, location, interpolationConfig);
        if (split == null) return null;

        const expressions: AST[] = [];

        for (let i = 0; i < split.expressions.length; ++i) {
            const expressionText = split.expressions[i];
            const sourceToLex = this._stripComments(expressionText);
            const tokens = this._lexer.tokenize(this._stripComments(split.expressions[i]));
            const ast = new _ParseAST(
                input, location, tokens, sourceToLex.length, false, this.errors,
                split.offsets[i] + (expressionText.length - sourceToLex.length))
                .parseChain();
            expressions.push(ast);
        }

        return new ASTWithSource(
            new Interpolation(
                new ParseSpan(0, isBlank(input) ? 0 : input.length), split.strings, expressions),
            input, location, this.errors);
    }

    /**
     * Executes `splitInterpolation` to handle split interpolation.
     * @zh 执行 `splitInterpolation`，用于分割面板Interpolation。
     * @param input - input parameter (`string`) / 输入属性参数（`string`）
     * @param location - location parameter (`string`) / location参数（`string`）
     * @param interpolationConfig - interpolation config parameter (`InterpolationConfig`) / interpolation配置参数（`InterpolationConfig`）
     * @returns Result of type `SplitInterpolation` / 类型为 `SplitInterpolation` 的返回值
     */
    splitInterpolation(
        input: string, location: string,
        interpolationConfig: InterpolationConfig = DEFAULT_INTERPOLATION_CONFIG): SplitInterpolation {
        const regexp = _createInterpolateRegExp(interpolationConfig);
        const parts = input.split(regexp);
        if (parts.length <= 1) {
            return null;
        }
        const strings: string[] = [];
        const expressions: string[] = [];
        const offsets: number[] = [];
        let offset = 0;
        for (let i = 0; i < parts.length; i++) {
            const part: string = parts[i];
            if (i % 2 === 0) {
                // fixed string
                strings.push(part);
                offset += part.length;
            } else if (part.trim().length > 0) {
                offset += interpolationConfig.start.length;
                expressions.push(part);
                offsets.push(offset);
                offset += part.length + interpolationConfig.end.length;
            } else {
                this._reportError(
                    'Blank expressions are not allowed in interpolated strings', input,
                    `at column ${this._findInterpolationErrorColumn(parts, i, interpolationConfig)} in`,
                    location);
                expressions.push('$implict');
                offsets.push(offset);
            }
        }
        return new SplitInterpolation(strings, expressions, offsets);
    }

    /**
     * Executes `wrapLiteralPrimitive` to handle wrap literal primitive.
     * @zh 执行 `wrapLiteralPrimitive`，用于包裹LiteralPrimitive。
     * @param input - input parameter (`string`) / 输入属性参数（`string`）
     * @param location - location parameter (`any`) / location参数（`any`）
     * @returns Result of type `ASTWithSource` / 类型为 `ASTWithSource` 的返回值
     */
    wrapLiteralPrimitive(input: string, location): ASTWithSource {
        return new ASTWithSource(
            new LiteralPrimitive(new ParseSpan(0, isBlank(input) ? 0 : input.length), input), input,
            location, this.errors);
    }

    /**
     * Executes `_stripComments` to handle strip comments.
     * @zh 执行 `_stripComments`，用于stripComments。
     * @param input - input parameter (`string`) / 输入属性参数（`string`）
     * @returns Result of type `string` / 类型为 `string` 的返回值
     */
    private _stripComments(input: string): string {
        const i = this._commentStart(input);
        return isPresent(i) ? input.substring(0, i).trim() : input;
    }

    /**
     * Executes `_commentStart` to handle comment start.
     * @zh 执行 `_commentStart`，用于comment开始。
     * @param input - input parameter (`string`) / 输入属性参数（`string`）
     * @returns Result of type `number` / 类型为 `number` 的返回值
     */
    private _commentStart(input: string): number {
        let outerQuote: number = null;
        for (let i = 0; i < input.length - 1; i++) {
            const char = input.charCodeAt(i);
            const nextChar = input.charCodeAt(i + 1);

            if (char === chars.$SLASH && nextChar == chars.$SLASH && isBlank(outerQuote)) return i;

            if (outerQuote === char) {
                outerQuote = null;
            } else if (isBlank(outerQuote) && isQuote(char)) {
                outerQuote = char;
            }
        }
        return null;
    }

    /**
     * Executes `_checkNoInterpolation` to handle check no interpolation.
     * @zh 执行 `_checkNoInterpolation`，用于检查NoInterpolation。
     * @param input - input parameter (`string`) / 输入属性参数（`string`）
     * @param location - location parameter (`any`) / location参数（`any`）
     * @param interpolationConfig - interpolation config parameter (`InterpolationConfig`) / interpolation配置参数（`InterpolationConfig`）
     */
    private _checkNoInterpolation(
        input: string, location, interpolationConfig: InterpolationConfig): void {
        const regexp = _createInterpolateRegExp(interpolationConfig);
        const parts = input.split(regexp);
        if (parts.length > 1) {
            this._reportError(
                `Got interpolation (${interpolationConfig.start}${interpolationConfig.end}) where expression was expected`,
                input,
                `at column ${this._findInterpolationErrorColumn(parts, 1, interpolationConfig)} in`,
                location);
        }
    }

    /**
     * Executes `_findInterpolationErrorColumn` to handle find interpolation error column.
     * @zh 执行 `_findInterpolationErrorColumn`，用于查找Interpolation错误列。
     * @param parts - parts parameter (`string[]`) / parts参数（`string[]`）
     * @param partInErrIdx - part in err idx parameter (`number`) / part在错误索引参数（`number`）
     * @param interpolationConfig - interpolation config parameter (`InterpolationConfig`) / interpolation配置参数（`InterpolationConfig`）
     * @returns Result of type `number` / 类型为 `number` 的返回值
     */
    private _findInterpolationErrorColumn(
        parts: string[], partInErrIdx: number, interpolationConfig: InterpolationConfig): number {
        let errLocation = '';
        for (let j = 0; j < partInErrIdx; j++) {
            errLocation += j % 2 === 0 ?
                parts[j] :
                `${interpolationConfig.start}${parts[j]}${interpolationConfig.end}`;
        }

        return errLocation.length;
    }
}

/**
 * Class `_ParseAST` encapsulating parse ast data structures and logic in `src/core/angular2parse/angular/compiler`.
 * @zh 类 `_ParseAST`，封装 `src/core/angular2parse/angular/compiler` 中的解析抽象语法树数据结构与处理逻辑。
 */
export class _ParseAST {
    /**
     * Property `rparensExpected` (`number`) storing rparens expected (default: `0`).
     * @zh 属性 `rparensExpected`（类型：`number`），用于存储或配置rparensExpected（默认值：`0`）。
     */
    private rparensExpected = 0;
    /**
     * Property `rbracketsExpected` (`number`) storing rbrackets expected (default: `0`).
     * @zh 属性 `rbracketsExpected`（类型：`number`），用于存储或配置rbracketsExpected（默认值：`0`）。
     */
    private rbracketsExpected = 0;
    /**
     * Property `rbracesExpected` (`number`) storing rbraces expected (default: `0`).
     * @zh 属性 `rbracesExpected`（类型：`number`），用于存储或配置rbracesExpected（默认值：`0`）。
     */
    private rbracesExpected = 0;

    /**
     * Property `index` (`number`) storing index (default: `0`).
     * @zh 属性 `index`（类型：`number`），用于存储或配置索引（默认值：`0`）。
     */
    index: number = 0;

    /**
     * Creates an instance of `_ParseAST` and initializes its dependencies and internal state.
     * @zh 创建 `_ParseAST` 实例，并初始化其依赖项与内部状态。
     * @param input - Injected or initial input (`string`) / 注入或传入的输入属性（`string`）
     * @param location - Injected or initial location (`any`) / 注入或传入的location（`any`）
     * @param tokens - Injected or initial tokens (`Token[]`) / 注入或传入的设计令牌（`Token[]`）
     * @param inputLength - Injected or initial input length (`number`) / 注入或传入的输入属性长度（`number`）
     * @param parseAction - Injected or initial parse action (`boolean`) / 注入或传入的解析动作（`boolean`）
     * @param errors - Injected or initial errors (`ParserError[]`) / 注入或传入的错误列表（`ParserError[]`）
     * @param offset - Injected or initial offset (`number`) / 注入或传入的偏移量（`number`）
     */
    constructor(
        public input: string, public location, public tokens: Token[],
        public inputLength: number, public parseAction: boolean, private errors: ParserError[],
        private offset: number) {}

    /**
     * Executes `peek` to handle peek.
     * @zh 执行 `peek`，用于peek。
     * @param offset - offset parameter (`number`) / 偏移量参数（`number`）
     * @returns Result of type `Token` / 类型为 `Token` 的返回值
     */
    peek(offset: number): Token {
        const i = this.index + offset;
        return i < this.tokens.length ? this.tokens[i] : EOF;
    }

    /**
     * Gets the current next (`next: Token`).
     * @zh 获取当前下一个（`next: Token`）。
     */
    get next(): Token { return this.peek(0); }

    /**
     * Gets the current input index (`inputIndex: number`).
     * @zh 获取当前输入属性索引（`inputIndex: number`）。
     */
    get inputIndex(): number {
        return (this.index < this.tokens.length) ? this.next.index + this.offset :
            this.inputLength + this.offset;
    }

    /**
     * Executes `span` to handle span.
     * @zh 执行 `span`，用于span。
     * @param start - start parameter (`number`) / 开始参数（`number`）
     */
    span(start: number) { return new ParseSpan(start, this.inputIndex); }

    /**
     * Executes `advance` to handle advance.
     * @zh 执行 `advance`，用于advance。
     */
    advance() { this.index++; }

    /**
     * Executes `optionalCharacter` to handle optional character.
     * @zh 执行 `optionalCharacter`，用于可选字符。
     * @param code - code parameter (`number`) / 编码参数（`number`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    optionalCharacter(code: number): boolean {
        if (this.next.isCharacter(code)) {
            this.advance();
            return true;
        } else {
            return false;
        }
    }

    /**
     * Executes `peekKeywordLet` to handle peek keyword let.
     * @zh 执行 `peekKeywordLet`，用于peekKeywordLet。
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    peekKeywordLet(): boolean { return this.next.isKeywordLet(); }

    /**
     * Executes `expectCharacter` to handle expect character.
     * @zh 执行 `expectCharacter`，用于expect字符。
     * @param code - code parameter (`number`) / 编码参数（`number`）
     */
    expectCharacter(code: number) {
        if (this.optionalCharacter(code)) return;
        this.error(`Missing expected ${String.fromCharCode(code)}`);
    }

    /**
     * Executes `optionalOperator` to handle optional operator.
     * @zh 执行 `optionalOperator`，用于可选操作符。
     * @param op - op parameter (`string`) / op参数（`string`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    optionalOperator(op: string): boolean {
        if (this.next.isOperator(op)) {
            this.advance();
            return true;
        } else {
            return false;
        }
    }

    /**
     * Executes `expectOperator` to handle expect operator.
     * @zh 执行 `expectOperator`，用于expect操作符。
     * @param operator - operator parameter (`string`) / 操作符参数（`string`）
     */
    expectOperator(operator: string) {
        if (this.optionalOperator(operator)) return;
        this.error(`Missing expected operator ${operator}`);
    }

    /**
     * Executes `expectIdentifierOrKeyword` to handle expect identifier or keyword.
     * @zh 执行 `expectIdentifierOrKeyword`，用于expectIdentifierOrKeyword。
     * @returns Result of type `string` / 类型为 `string` 的返回值
     */
    expectIdentifierOrKeyword(): string {
        const n = this.next;
        if (!n.isIdentifier() && !n.isKeyword()) {
            this.error(`Unexpected token ${n}, expected identifier or keyword`);
            return '';
        }
        this.advance();
        return n.toString();
    }

    /**
     * Executes `expectIdentifierOrKeywordOrString` to handle expect identifier or keyword or string.
     * @zh 执行 `expectIdentifierOrKeywordOrString`，用于expectIdentifierOrKeywordOr字符串。
     * @returns Result of type `string` / 类型为 `string` 的返回值
     */
    expectIdentifierOrKeywordOrString(): string {
        const n = this.next;
        if (!n.isIdentifier() && !n.isKeyword() && !n.isString()) {
            this.error(`Unexpected token ${n}, expected identifier, keyword, or string`);
            return '';
        }
        this.advance();
        return n.toString();
    }

    /**
     * Executes `parseChain` to handle parse chain.
     * @zh 执行 `parseChain`，用于解析Chain。
     * @returns Result of type `AST` / 类型为 `AST` 的返回值
     */
    parseChain(): AST {
        const exprs: AST[] = [];
        const start = this.inputIndex;
        while (this.index < this.tokens.length) {
            const expr = this.parsePipe();
            exprs.push(expr);

            if (this.optionalCharacter(chars.$SEMICOLON)) {
                if (!this.parseAction) {
                    this.error('Binding expression cannot contain chained expression');
                }
                while (this.optionalCharacter(chars.$SEMICOLON)) {
                }  // read all semicolons
            } else if (this.index < this.tokens.length) {
                this.error(`Unexpected token '${this.next}'`);
            }
        }
        if (exprs.length == 0) return new EmptyExpr(this.span(start));
        if (exprs.length == 1) return exprs[0];
        return new Chain(this.span(start), exprs);
    }

    /**
     * Executes `parsePipe` to handle parse pipe.
     * @zh 执行 `parsePipe`，用于解析管道。
     * @returns Result of type `AST` / 类型为 `AST` 的返回值
     */
    parsePipe(): AST {
        let result = this.parseExpression();
        if (this.optionalOperator('|')) {
            if (this.parseAction) {
                this.error('Cannot have a pipe in an action expression');
            }

            do {
                const name = this.expectIdentifierOrKeyword();
                const args: AST[] = [];
                while (this.optionalCharacter(chars.$COLON)) {
                    args.push(this.parseExpression());
                }
                result = new BindingPipe(this.span(result.span.start), result, name, args);
            } while (this.optionalOperator('|'));
        }

        return result;
    }

    /**
     * Executes `parseExpression` to handle parse expression.
     * @zh 执行 `parseExpression`，用于解析表达式。
     * @returns Result of type `AST` / 类型为 `AST` 的返回值
     */
    parseExpression(): AST { return this.parseConditional(); }

    /**
     * Executes `parseConditional` to handle parse conditional.
     * @zh 执行 `parseConditional`，用于解析Conditional。
     * @returns Result of type `AST` / 类型为 `AST` 的返回值
     */
    parseConditional(): AST {
        const start = this.inputIndex;
        const result = this.parseLogicalOr();

        if (this.optionalOperator('?')) {
            const yes = this.parsePipe();
            let no: AST;
            if (!this.optionalCharacter(chars.$COLON)) {
                const end = this.inputIndex;
                const expression = this.input.substring(start, end);
                this.error(`Conditional expression ${expression} requires all 3 expressions`);
                no = new EmptyExpr(this.span(start));
            } else {
                no = this.parsePipe();
            }
            return new Conditional(this.span(start), result, yes, no);
        } else {
            return result;
        }
    }

    /**
     * Executes `parseLogicalOr` to handle parse logical or.
     * @zh 执行 `parseLogicalOr`，用于解析LogicalOr。
     * @returns Result of type `AST` / 类型为 `AST` 的返回值
     */
    parseLogicalOr(): AST {
        // '||'
        let result = this.parseLogicalAnd();
        while (this.optionalOperator('||')) {
            const right = this.parseLogicalAnd();
            result = new Binary(this.span(result.span.start), '||', result, right);
        }
        return result;
    }

    /**
     * Executes `parseLogicalAnd` to handle parse logical and.
     * @zh 执行 `parseLogicalAnd`，用于解析LogicalAnd。
     * @returns Result of type `AST` / 类型为 `AST` 的返回值
     */
    parseLogicalAnd(): AST {
        // '&&'
        let result = this.parseEquality();
        while (this.optionalOperator('&&')) {
            const right = this.parseEquality();
            result = new Binary(this.span(result.span.start), '&&', result, right);
        }
        return result;
    }

    /**
     * Executes `parseEquality` to handle parse equality.
     * @zh 执行 `parseEquality`，用于解析Equality。
     * @returns Result of type `AST` / 类型为 `AST` 的返回值
     */
    parseEquality(): AST {
        // '==','!=','===','!=='
        let result = this.parseRelational();
        while (this.next.type == TokenType.Operator) {
            const operator = this.next.strValue;
            switch (operator) {
                case '==':
                case '===':
                case '!=':
                case '!==':
                    this.advance();
                    const right = this.parseRelational();
                    result = new Binary(this.span(result.span.start), operator, result, right);
                    continue;
            }
            break;
        }
        return result;
    }

    /**
     * Executes `parseRelational` to handle parse relational.
     * @zh 执行 `parseRelational`，用于解析Relational。
     * @returns Result of type `AST` / 类型为 `AST` 的返回值
     */
    parseRelational(): AST {
        // '<', '>', '<=', '>='
        let result = this.parseAdditive();
        while (this.next.type == TokenType.Operator) {
            const operator = this.next.strValue;
            switch (operator) {
                case '<':
                case '>':
                case '<=':
                case '>=':
                    this.advance();
                    const right = this.parseAdditive();
                    result = new Binary(this.span(result.span.start), operator, result, right);
                    continue;
            }
            break;
        }
        return result;
    }

    /**
     * Executes `parseAdditive` to handle parse additive.
     * @zh 执行 `parseAdditive`，用于解析Additive。
     * @returns Result of type `AST` / 类型为 `AST` 的返回值
     */
    parseAdditive(): AST {
        // '+', '-'
        let result = this.parseMultiplicative();
        while (this.next.type == TokenType.Operator) {
            const operator = this.next.strValue;
            switch (operator) {
                case '+':
                case '-':
                    this.advance();
                    let right = this.parseMultiplicative();
                    result = new Binary(this.span(result.span.start), operator, result, right);
                    continue;
            }
            break;
        }
        return result;
    }

    /**
     * Executes `parseMultiplicative` to handle parse multiplicative.
     * @zh 执行 `parseMultiplicative`，用于解析Multiplicative。
     * @returns Result of type `AST` / 类型为 `AST` 的返回值
     */
    parseMultiplicative(): AST {
        // '*', '%', '/'
        let result = this.parsePrefix();
        while (this.next.type == TokenType.Operator) {
            const operator = this.next.strValue;
            switch (operator) {
                case '*':
                case '%':
                case '/':
                    this.advance();
                    let right = this.parsePrefix();
                    result = new Binary(this.span(result.span.start), operator, result, right);
                    continue;
            }
            break;
        }
        return result;
    }

    /**
     * Executes `parsePrefix` to handle parse prefix.
     * @zh 执行 `parsePrefix`，用于解析前缀。
     * @returns Result of type `AST` / 类型为 `AST` 的返回值
     */
    parsePrefix(): AST {
        if (this.next.type == TokenType.Operator) {
            const start = this.inputIndex;
            const operator = this.next.strValue;
            let result: AST;
            switch (operator) {
                case '+':
                    this.advance();
                    return this.parsePrefix();
                case '-':
                    this.advance();
                    result = this.parsePrefix();
                    return new Binary(
                        this.span(start), operator, new LiteralPrimitive(new ParseSpan(start, start), 0),
                        result);
                case '!':
                    this.advance();
                    result = this.parsePrefix();
                    return new PrefixNot(this.span(start), result);
            }
        }
        return this.parseCallChain();
    }

    /**
     * Executes `parseCallChain` to handle parse call chain.
     * @zh 执行 `parseCallChain`，用于解析调用Chain。
     * @returns Result of type `AST` / 类型为 `AST` 的返回值
     */
    parseCallChain(): AST {
        let result = this.parsePrimary();
        while (true) {
            if (this.optionalCharacter(chars.$PERIOD)) {
                result = this.parseAccessMemberOrMethodCall(result, false);

            } else if (this.optionalOperator('?.')) {
                result = this.parseAccessMemberOrMethodCall(result, true);

            } else if (this.optionalCharacter(chars.$LBRACKET)) {
                this.rbracketsExpected++;
                const key = this.parsePipe();
                this.rbracketsExpected--;
                this.expectCharacter(chars.$RBRACKET);
                if (this.optionalOperator('=')) {
                    const value = this.parseConditional();
                    result = new KeyedWrite(this.span(result.span.start), result, key, value);
                } else {
                    result = new KeyedRead(this.span(result.span.start), result, key);
                }

            } else if (this.optionalCharacter(chars.$LPAREN)) {
                this.rparensExpected++;
                const args = this.parseCallArguments();
                this.rparensExpected--;
                this.expectCharacter(chars.$RPAREN);
                result = new FunctionCall(this.span(result.span.start), result, args);

            } else {
                return result;
            }
        }
    }

    /**
     * Executes `parsePrimary` to handle parse primary.
     * @zh 执行 `parsePrimary`，用于解析主色。
     * @returns Result of type `AST` / 类型为 `AST` 的返回值
     */
    parsePrimary(): AST {
        const start = this.inputIndex;
        if (this.optionalCharacter(chars.$LPAREN)) {
            this.rparensExpected++;
            const result = this.parsePipe();
            this.rparensExpected--;
            this.expectCharacter(chars.$RPAREN);
            return result;

        } else if (this.next.isKeywordNull()) {
            this.advance();
            return new LiteralPrimitive(this.span(start), null);

        } else if (this.next.isKeywordUndefined()) {
            this.advance();
            return new LiteralPrimitive(this.span(start), void 0);

        } else if (this.next.isKeywordTrue()) {
            this.advance();
            return new LiteralPrimitive(this.span(start), true);

        } else if (this.next.isKeywordFalse()) {
            this.advance();
            return new LiteralPrimitive(this.span(start), false);

        } else if (this.next.isKeywordThis()) {
            this.advance();
            return new ImplicitReceiver(this.span(start));

        } else if (this.optionalCharacter(chars.$LBRACKET)) {
            this.rbracketsExpected++;
            const elements = this.parseExpressionList(chars.$RBRACKET);
            this.rbracketsExpected--;
            this.expectCharacter(chars.$RBRACKET);
            return new LiteralArray(this.span(start), elements);

        } else if (this.next.isCharacter(chars.$LBRACE)) {
            return this.parseLiteralMap();

        } else if (this.next.isIdentifier()) {
            return this.parseAccessMemberOrMethodCall(new ImplicitReceiver(this.span(start)), false);

        } else if (this.next.isNumber()) {
            const value = this.next.toNumber();
            this.advance();
            return new LiteralPrimitive(this.span(start), value);

        } else if (this.next.isString()) {
            const literalValue = this.next.toString();
            this.advance();
            return new LiteralPrimitive(this.span(start), literalValue);

        } else if (this.index >= this.tokens.length) {
            this.error(`Unexpected end of expression: ${this.input}`);
            return new EmptyExpr(this.span(start));
        } else {
            this.error(`Unexpected token ${this.next}`);
            return new EmptyExpr(this.span(start));
        }
    }

    /**
     * Executes `parseExpressionList` to handle parse expression list.
     * @zh 执行 `parseExpressionList`，用于解析表达式列表。
     * @param terminator - terminator parameter (`number`) / terminator参数（`number`）
     * @returns Result of type `AST[]` / 类型为 `AST[]` 的返回值
     */
    parseExpressionList(terminator: number): AST[] {
        const result: AST[] = [];
        if (!this.next.isCharacter(terminator)) {
            do {
                result.push(this.parsePipe());
            } while (this.optionalCharacter(chars.$COMMA));
        }
        return result;
    }

    /**
     * Executes `parseLiteralMap` to handle parse literal map.
     * @zh 执行 `parseLiteralMap`，用于解析Literal映射表。
     * @returns Result of type `LiteralMap` / 类型为 `LiteralMap` 的返回值
     */
    parseLiteralMap(): LiteralMap {
        const keys: string[] = [];
        const values: AST[] = [];
        const start = this.inputIndex;
        this.expectCharacter(chars.$LBRACE);
        if (!this.optionalCharacter(chars.$RBRACE)) {
            this.rbracesExpected++;
            do {
                const key = this.expectIdentifierOrKeywordOrString();
                keys.push(key);
                this.expectCharacter(chars.$COLON);
                values.push(this.parsePipe());
            } while (this.optionalCharacter(chars.$COMMA));
            this.rbracesExpected--;
            this.expectCharacter(chars.$RBRACE);
        }
        return new LiteralMap(this.span(start), keys, values);
    }

    /**
     * Executes `parseAccessMemberOrMethodCall` to handle parse access member or method call.
     * @zh 执行 `parseAccessMemberOrMethodCall`，用于解析Access成员Or方法调用。
     * @param receiver - receiver parameter (`AST`) / receiver参数（`AST`）
     * @param isSafe - is safe parameter (`boolean`) / 是否为安全参数（`boolean`）
     * @returns Result of type `AST` / 类型为 `AST` 的返回值
     */
    parseAccessMemberOrMethodCall(receiver: AST, isSafe: boolean = false): AST {
        const start = receiver.span.start;
        const id = this.expectIdentifierOrKeyword();

        if (this.optionalCharacter(chars.$LPAREN)) {
            this.rparensExpected++;
            const args = this.parseCallArguments();
            this.expectCharacter(chars.$RPAREN);
            this.rparensExpected--;
            const span = this.span(start);
            return isSafe ? new SafeMethodCall(span, receiver, id, args) :
                new MethodCall(span, receiver, id, args);

        } else {
            if (isSafe) {
                if (this.optionalOperator('=')) {
                    this.error('The \'?.\' operator cannot be used in the assignment');
                    return new EmptyExpr(this.span(start));
                } else {
                    return new SafePropertyRead(this.span(start), receiver, id);
                }
            } else {
                if (this.optionalOperator('=')) {
                    if (!this.parseAction) {
                        this.error('Bindings cannot contain assignments');
                        return new EmptyExpr(this.span(start));
                    }

                    const value = this.parseConditional();
                    return new PropertyWrite(this.span(start), receiver, id, value);
                } else {
                    return new PropertyRead(this.span(start), receiver, id);
                }
            }
        }
    }

    /**
     * Executes `parseCallArguments` to handle parse call arguments.
     * @zh 执行 `parseCallArguments`，用于解析调用Arguments。
     * @returns Result of type `BindingPipe[]` / 类型为 `BindingPipe[]` 的返回值
     */
    parseCallArguments(): BindingPipe[] {
        if (this.next.isCharacter(chars.$RPAREN)) return [];
        const positionals: AST[] = [];
        do {
            positionals.push(this.parsePipe());
        } while (this.optionalCharacter(chars.$COMMA));
        return positionals as BindingPipe[];
    }

    /**
     * An identifier, a keyword, a string with an optional `-` inbetween.

     * @zh 执行 `expectTemplateBindingKey`，用于expect模板绑定键。
     */
    expectTemplateBindingKey(): string {
        let result = '';
        let operatorFound = false;
        do {
            result += this.expectIdentifierOrKeywordOrString();
            operatorFound = this.optionalOperator('-');
            if (operatorFound) {
                result += '-';
            }
        } while (operatorFound);

        return result.toString();
    }

    /**
     * Executes `parseTemplateBindings` to handle parse template bindings.
     * @zh 执行 `parseTemplateBindings`，用于解析模板Bindings。
     * @returns Result of type `TemplateBindingParseResult` / 类型为 `TemplateBindingParseResult` 的返回值
     */
    parseTemplateBindings(): TemplateBindingParseResult {
        const bindings: TemplateBinding[] = [];
        let prefix: string = null;
        const warnings: string[] = [];
        while (this.index < this.tokens.length) {
            const start = this.inputIndex;
            const keyIsVar: boolean = this.peekKeywordLet();
            if (keyIsVar) {
                this.advance();
            }
            let key = this.expectTemplateBindingKey();
            if (!keyIsVar) {
                if (prefix == null) {
                    prefix = key;
                } else {
                    key = prefix + key[0].toUpperCase() + key.substring(1);
                }
            }
            this.optionalCharacter(chars.$COLON);
            let name: string = null;
            let expression: ASTWithSource = null;
            if (keyIsVar) {
                if (this.optionalOperator('=')) {
                    name = this.expectTemplateBindingKey();
                } else {
                    name = '\$implicit';
                }
            } else if (this.next !== EOF && !this.peekKeywordLet()) {
                const start = this.inputIndex;
                const ast = this.parsePipe();
                const source = this.input.substring(start - this.offset, this.inputIndex - this.offset);
                expression = new ASTWithSource(ast, source, this.location, this.errors);
            }
            bindings.push(new TemplateBinding(this.span(start), key, keyIsVar, name, expression));
            if (!this.optionalCharacter(chars.$SEMICOLON)) {
                this.optionalCharacter(chars.$COMMA);
            }
        }
        return new TemplateBindingParseResult(bindings, warnings, this.errors);
    }

    /**
     * Executes `error` to handle error.
     * @zh 执行 `error`，用于错误。
     * @param message - message parameter (`string`) / 消息参数（`string`）
     * @param index - index parameter (`number`) / 索引参数（`number`）
     */
    error(message: string, index: number = null) {
        this.errors.push(new ParserError(message, this.input, this.locationText(index), this.location));
        this.skip();
    }

    /**
     * Executes `locationText` to handle location text.
     * @zh 执行 `locationText`，用于location文本。
     * @param index - index parameter (`number`) / 索引参数（`number`）
     */
    private locationText(index: number = null) {
        if (isBlank(index)) index = this.index;
        return (index < this.tokens.length) ? `at column ${this.tokens[index].index + 1} in` :
            `at the end of the expression`;
    }

    // Error recovery should skip tokens until it encounters a recovery point. skip() treats
    // the end of input and a ';' as unconditionally a recovery point. It also treats ')',
    // '}' and ']' as conditional recovery points if one of calling productions is expecting
    // one of these symbols. This allows skip() to recover from errors such as '(a.) + 1' allowing
    // more of the AST to be retained (it doesn't skip any tokens as the ')' is retained because
    // of the '(' begins an '(' <expr> ')' production). The recovery points of grouping symbols
    // must be conditional as they must be skipped if none of the calling productions are not
    // expecting the closing token else we will never make progress in the case of an
    // extraneous group closing symbol (such as a stray ')'). This is not the case for ';' because
    // parseChain() is always the root production and it expects a ';'.

    // If a production expects one of these token it increments the corresponding nesting count,
    // and then decrements it just prior to checking if the token is in the input.
    /**
     * Executes `skip` to handle skip.
     * @zh 执行 `skip`，用于skip。
     */
    private skip() {
        let n = this.next;
        while (this.index < this.tokens.length && !n.isCharacter(chars.$SEMICOLON) &&
        (this.rparensExpected <= 0 || !n.isCharacter(chars.$RPAREN)) &&
        (this.rbracesExpected <= 0 || !n.isCharacter(chars.$RBRACE)) &&
        (this.rbracketsExpected <= 0 || !n.isCharacter(chars.$RBRACKET))) {
            if (this.next.isError()) {
                this.errors.push(
                    new ParserError(this.next.toString(), this.input, this.locationText(), this.location));
            }
            this.advance();
            n = this.next;
        }
    }
}

/**
 * Class `SimpleExpressionChecker` encapsulating simple expression checker data structures and logic in `src/core/angular2parse/angular/compiler`.
 * @zh 类 `SimpleExpressionChecker`，封装 `src/core/angular2parse/angular/compiler` 中的Simple表达式检查器数据结构与处理逻辑。
 */
class SimpleExpressionChecker implements AstVisitor {
    /**
     * Executes `check` to handle check.
     * @zh 执行 `check`，用于检查。
     * @param ast - ast parameter (`AST`) / 抽象语法树参数（`AST`）
     * @returns Result of type `string[]` / 类型为 `string[]` 的返回值
     */
    static check(ast: AST): string[] {
        const s = new SimpleExpressionChecker();
        ast.visit(s);
        return s.errors;
    }

    /**
     * Property `errors` (`string[]`) storing errors (default: `[]`).
     * @zh 属性 `errors`（类型：`string[]`），用于存储或配置错误列表（默认值：`[]`）。
     */
    errors: string[] = [];

    /**
     * Executes `visitImplicitReceiver` to handle visit implicit receiver.
     * @zh 执行 `visitImplicitReceiver`，用于访问ImplicitReceiver。
     * @param ast - ast parameter (`ImplicitReceiver`) / 抽象语法树参数（`ImplicitReceiver`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     */
    visitImplicitReceiver(ast: ImplicitReceiver, context) {}

    /**
     * Executes `visitInterpolation` to handle visit interpolation.
     * @zh 执行 `visitInterpolation`，用于访问Interpolation。
     * @param ast - ast parameter (`Interpolation`) / 抽象语法树参数（`Interpolation`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     */
    visitInterpolation(ast: Interpolation, context) {}

    /**
     * Executes `visitLiteralPrimitive` to handle visit literal primitive.
     * @zh 执行 `visitLiteralPrimitive`，用于访问LiteralPrimitive。
     * @param ast - ast parameter (`LiteralPrimitive`) / 抽象语法树参数（`LiteralPrimitive`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     */
    visitLiteralPrimitive(ast: LiteralPrimitive, context) {}

    /**
     * Executes `visitPropertyRead` to handle visit property read.
     * @zh 执行 `visitPropertyRead`，用于访问属性读取。
     * @param ast - ast parameter (`PropertyRead`) / 抽象语法树参数（`PropertyRead`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     */
    visitPropertyRead(ast: PropertyRead, context) {}

    /**
     * Executes `visitPropertyWrite` to handle visit property write.
     * @zh 执行 `visitPropertyWrite`，用于访问属性写入。
     * @param ast - ast parameter (`PropertyWrite`) / 抽象语法树参数（`PropertyWrite`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     */
    visitPropertyWrite(ast: PropertyWrite, context) {}

    /**
     * Executes `visitSafePropertyRead` to handle visit safe property read.
     * @zh 执行 `visitSafePropertyRead`，用于访问安全属性读取。
     * @param ast - ast parameter (`SafePropertyRead`) / 抽象语法树参数（`SafePropertyRead`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     */
    visitSafePropertyRead(ast: SafePropertyRead, context) {}

    /**
     * Executes `visitMethodCall` to handle visit method call.
     * @zh 执行 `visitMethodCall`，用于访问方法调用。
     * @param ast - ast parameter (`MethodCall`) / 抽象语法树参数（`MethodCall`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     */
    visitMethodCall(ast: MethodCall, context) {}

    /**
     * Executes `visitSafeMethodCall` to handle visit safe method call.
     * @zh 执行 `visitSafeMethodCall`，用于访问安全方法调用。
     * @param ast - ast parameter (`SafeMethodCall`) / 抽象语法树参数（`SafeMethodCall`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     */
    visitSafeMethodCall(ast: SafeMethodCall, context) {}

    /**
     * Executes `visitFunctionCall` to handle visit function call.
     * @zh 执行 `visitFunctionCall`，用于访问函数调用。
     * @param ast - ast parameter (`FunctionCall`) / 抽象语法树参数（`FunctionCall`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     */
    visitFunctionCall(ast: FunctionCall, context) {}

    /**
     * Executes `visitLiteralArray` to handle visit literal array.
     * @zh 执行 `visitLiteralArray`，用于访问Literal数组。
     * @param ast - ast parameter (`LiteralArray`) / 抽象语法树参数（`LiteralArray`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     */
    visitLiteralArray(ast: LiteralArray, context) { this.visitAll(ast.expressions); }

    /**
     * Executes `visitLiteralMap` to handle visit literal map.
     * @zh 执行 `visitLiteralMap`，用于访问Literal映射表。
     * @param ast - ast parameter (`LiteralMap`) / 抽象语法树参数（`LiteralMap`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     */
    visitLiteralMap(ast: LiteralMap, context) { this.visitAll(ast.values); }

    /**
     * Executes `visitBinary` to handle visit binary.
     * @zh 执行 `visitBinary`，用于访问Binary。
     * @param ast - ast parameter (`Binary`) / 抽象语法树参数（`Binary`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     */
    visitBinary(ast: Binary, context) {}

    /**
     * Executes `visitPrefixNot` to handle visit prefix not.
     * @zh 执行 `visitPrefixNot`，用于访问前缀Not。
     * @param ast - ast parameter (`PrefixNot`) / 抽象语法树参数（`PrefixNot`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     */
    visitPrefixNot(ast: PrefixNot, context) {}

    /**
     * Executes `visitConditional` to handle visit conditional.
     * @zh 执行 `visitConditional`，用于访问Conditional。
     * @param ast - ast parameter (`Conditional`) / 抽象语法树参数（`Conditional`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     */
    visitConditional(ast: Conditional, context) {}

    /**
     * Executes `visitPipe` to handle visit pipe.
     * @zh 执行 `visitPipe`，用于访问管道。
     * @param ast - ast parameter (`BindingPipe`) / 抽象语法树参数（`BindingPipe`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     */
    visitPipe(ast: BindingPipe, context) { this.errors.push('pipes'); }

    /**
     * Executes `visitKeyedRead` to handle visit keyed read.
     * @zh 执行 `visitKeyedRead`，用于访问已键读取。
     * @param ast - ast parameter (`KeyedRead`) / 抽象语法树参数（`KeyedRead`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     */
    visitKeyedRead(ast: KeyedRead, context) {}

    /**
     * Executes `visitKeyedWrite` to handle visit keyed write.
     * @zh 执行 `visitKeyedWrite`，用于访问已键写入。
     * @param ast - ast parameter (`KeyedWrite`) / 抽象语法树参数（`KeyedWrite`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     */
    visitKeyedWrite(ast: KeyedWrite, context) {}

    /**
     * Executes `visitAll` to handle visit all.
     * @zh 执行 `visitAll`，用于访问全部。
     * @param asts - asts parameter (`any[]`) / 抽象语法树参数（`any[]`）
     * @returns Result of type `any[]` / 类型为 `any[]` 的返回值
     */
    visitAll(asts) { return asts.map(node => node.visit(this)); }

    /**
     * Executes `visitChain` to handle visit chain.
     * @zh 执行 `visitChain`，用于访问Chain。
     * @param ast - ast parameter (`Chain`) / 抽象语法树参数（`Chain`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     */
    visitChain(ast: Chain, context) {}

    /**
     * Executes `visitQuote` to handle visit quote.
     * @zh 执行 `visitQuote`，用于访问Quote。
     * @param ast - ast parameter (`Quote`) / 抽象语法树参数（`Quote`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     */
    visitQuote(ast: Quote, context) {}
}