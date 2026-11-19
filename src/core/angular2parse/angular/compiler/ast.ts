/**
 * @fileoverview Module `src/core/angular2parse/angular/compiler/ast.ts` providing ast definitions and implementation.
 * @zh 模块文件 `src/core/angular2parse/angular/compiler/ast.ts`，提供抽象语法树相关的定义与实现。
 */



import {isBlank} from '../facade/lang';

/**
 * Class `ParserError` encapsulating parser error data structures and logic in `src/core/angular2parse/angular/compiler`.
 * @zh 类 `ParserError`，封装 `src/core/angular2parse/angular/compiler` 中的解析器错误数据结构与处理逻辑。
 */
export class ParserError {
    /**
     * Property `message` (`string`) storing message.
     * @zh 属性 `message`（类型：`string`），用于存储或配置消息。
     */
    public message: string;
    /**
     * Creates an instance of `ParserError` and initializes its dependencies and internal state.
     * @zh 创建 `ParserError` 实例，并初始化其依赖项与内部状态。
     * @param message - Injected or initial message (`string`) / 注入或传入的消息（`string`）
     * @param input - Injected or initial input (`string`) / 注入或传入的输入属性（`string`）
     * @param errLocation - Injected or initial err location (`string`) / 注入或传入的错误Location（`string`）
     * @param ctxLocation - Injected or initial ctx location (`any`) / 注入或传入的上下文Location（`any`）
     */
    constructor(
        message: string, public input: string, public errLocation: string, public ctxLocation?) {
        this.message = `Parser Error: ${message} ${errLocation} [${input}] in ${ctxLocation}`;
    }
}

/**
 * Class `ParseSpan` encapsulating parse span data structures and logic in `src/core/angular2parse/angular/compiler`.
 * @zh 类 `ParseSpan`，封装 `src/core/angular2parse/angular/compiler` 中的解析Span数据结构与处理逻辑。
 */
export class ParseSpan {
    /**
     * Creates an instance of `ParseSpan` and initializes its dependencies and internal state.
     * @zh 创建 `ParseSpan` 实例，并初始化其依赖项与内部状态。
     * @param start - Injected or initial start (`number`) / 注入或传入的开始（`number`）
     * @param end - Injected or initial end (`number`) / 注入或传入的结束（`number`）
     */
    constructor(public start: number, public end: number) {}
}

/**
 * Class `AST` encapsulating ast data structures and logic in `src/core/angular2parse/angular/compiler`.
 * @zh 类 `AST`，封装 `src/core/angular2parse/angular/compiler` 中的抽象语法树数据结构与处理逻辑。
 */
export class AST {
    /**
     * Creates an instance of `AST` and initializes its dependencies and internal state.
     * @zh 创建 `AST` 实例，并初始化其依赖项与内部状态。
     * @param span - Injected or initial span (`ParseSpan`) / 注入或传入的span（`ParseSpan`）
     */
    constructor(public span: ParseSpan) {}
    /**
     * Executes `visit` to handle visit.
     * @zh 执行 `visit`，用于访问。
     * @param visitor - visitor parameter (`AstVisitor`) / 访问器参数（`AstVisitor`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    visit(visitor: AstVisitor, context = null) { return null; }
    /**
     * Executes `toString` to handle to string.
     * @zh 执行 `toString`，用于转换为字符串。
     * @returns Result of type `string` / 类型为 `string` 的返回值
     */
    toString(): string { return 'AST'; }
}

/**
 * Represents a quoted expression of the form:
 *
 * quote = prefix `:` uninterpretedExpression
 * prefix = identifier
 * uninterpretedExpression = arbitrary string
 *
 * A quoted expression is meant to be pre-processed by an AST transformer that
 * converts it into another AST that no longer contains quoted expressions.
 * It is meant to allow third-party developers to extend Angular template
 * expression language. The `uninterpretedExpression` part of the quote is
 * therefore not interpreted by the Angular's own expression parser.

 * @zh 类 `Quote`，封装 `src/core/angular2parse/angular/compiler` 中的Quote数据结构与处理逻辑。
 */
export class Quote extends AST {
    /**
     * Creates an instance of `Quote` and initializes its dependencies and internal state.
     * @zh 创建 `Quote` 实例，并初始化其依赖项与内部状态。
     * @param span - Injected or initial span (`ParseSpan`) / 注入或传入的span（`ParseSpan`）
     * @param prefix - Injected or initial prefix (`string`) / 注入或传入的前缀（`string`）
     * @param uninterpretedExpression - Injected or initial uninterpreted expression (`string`) / 注入或传入的uninterpreted表达式（`string`）
     * @param location - Injected or initial location (`any`) / 注入或传入的location（`any`）
     */
    constructor(
        span: ParseSpan, public prefix: string, public uninterpretedExpression: string,
        public location) {
        super(span);
    }
    /**
     * Executes `visit` to handle visit.
     * @zh 执行 `visit`，用于访问。
     * @param visitor - visitor parameter (`AstVisitor`) / 访问器参数（`AstVisitor`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visit(visitor: AstVisitor, context = null) { return visitor.visitQuote(this, context); }
    /**
     * Executes `toString` to handle to string.
     * @zh 执行 `toString`，用于转换为字符串。
     * @returns Result of type `string` / 类型为 `string` 的返回值
     */
    override toString(): string { return 'Quote'; }
}

/**
 * Class `EmptyExpr` encapsulating empty expr data structures and logic in `src/core/angular2parse/angular/compiler`.
 * @zh 类 `EmptyExpr`，封装 `src/core/angular2parse/angular/compiler` 中的空Expr数据结构与处理逻辑。
 */
export class EmptyExpr extends AST {
    /**
     * Executes `visit` to handle visit.
     * @zh 执行 `visit`，用于访问。
     * @param visitor - visitor parameter (`AstVisitor`) / 访问器参数（`AstVisitor`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     */
    override visit(visitor: AstVisitor, context = null) {
        // do nothing
    }
}

/**
 * Class `ImplicitReceiver` encapsulating implicit receiver data structures and logic in `src/core/angular2parse/angular/compiler`.
 * @zh 类 `ImplicitReceiver`，封装 `src/core/angular2parse/angular/compiler` 中的ImplicitReceiver数据结构与处理逻辑。
 */
export class ImplicitReceiver extends AST {
    /**
     * Executes `visit` to handle visit.
     * @zh 执行 `visit`，用于访问。
     * @param visitor - visitor parameter (`AstVisitor`) / 访问器参数（`AstVisitor`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visit(visitor: AstVisitor, context = null) {
        return visitor.visitImplicitReceiver(this, context);
    }
}

/**
 * Multiple expressions separated by a semicolon.

 * @zh 类 `Chain`，封装 `src/core/angular2parse/angular/compiler` 中的Chain数据结构与处理逻辑。
 */
export class Chain extends AST {
    /**
     * Creates an instance of `Chain` and initializes its dependencies and internal state.
     * @zh 创建 `Chain` 实例，并初始化其依赖项与内部状态。
     * @param span - Injected or initial span (`ParseSpan`) / 注入或传入的span（`ParseSpan`）
     * @param expressions - Injected or initial expressions (`any`) / 注入或传入的表达式（`any`）
     */
    constructor(span: ParseSpan, public expressions) { super(span); }
    /**
     * Executes `visit` to handle visit.
     * @zh 执行 `visit`，用于访问。
     * @param visitor - visitor parameter (`AstVisitor`) / 访问器参数（`AstVisitor`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visit(visitor: AstVisitor, context = null) { return visitor.visitChain(this, context); }
}

/**
 * Class `Conditional` encapsulating conditional data structures and logic in `src/core/angular2parse/angular/compiler`.
 * @zh 类 `Conditional`，封装 `src/core/angular2parse/angular/compiler` 中的Conditional数据结构与处理逻辑。
 */
export class Conditional extends AST {
    /**
     * Creates an instance of `Conditional` and initializes its dependencies and internal state.
     * @zh 创建 `Conditional` 实例，并初始化其依赖项与内部状态。
     * @param span - Injected or initial span (`ParseSpan`) / 注入或传入的span（`ParseSpan`）
     * @param condition - Injected or initial condition (`AST`) / 注入或传入的条件（`AST`）
     * @param trueExp - Injected or initial true exp (`AST`) / 注入或传入的trueExp（`AST`）
     * @param falseExp - Injected or initial false exp (`AST`) / 注入或传入的falseExp（`AST`）
     */
    constructor(span: ParseSpan, public condition: AST, public trueExp: AST, public falseExp: AST) {
        super(span);
    }
    /**
     * Executes `visit` to handle visit.
     * @zh 执行 `visit`，用于访问。
     * @param visitor - visitor parameter (`AstVisitor`) / 访问器参数（`AstVisitor`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visit(visitor: AstVisitor, context = null) {
        return visitor.visitConditional(this, context);
    }
}

/**
 * Class `PropertyRead` encapsulating property read data structures and logic in `src/core/angular2parse/angular/compiler`.
 * @zh 类 `PropertyRead`，封装 `src/core/angular2parse/angular/compiler` 中的属性读取数据结构与处理逻辑。
 */
export class PropertyRead extends AST {
    /**
     * Creates an instance of `PropertyRead` and initializes its dependencies and internal state.
     * @zh 创建 `PropertyRead` 实例，并初始化其依赖项与内部状态。
     * @param span - Injected or initial span (`ParseSpan`) / 注入或传入的span（`ParseSpan`）
     * @param receiver - Injected or initial receiver (`AST`) / 注入或传入的receiver（`AST`）
     * @param name - Injected or initial name (`string`) / 注入或传入的名称（`string`）
     */
    constructor(span: ParseSpan, public receiver: AST, public name: string) { super(span); }
    /**
     * Executes `visit` to handle visit.
     * @zh 执行 `visit`，用于访问。
     * @param visitor - visitor parameter (`AstVisitor`) / 访问器参数（`AstVisitor`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visit(visitor: AstVisitor, context = null) {
        return visitor.visitPropertyRead(this, context);
    }
}

/**
 * Class `PropertyWrite` encapsulating property write data structures and logic in `src/core/angular2parse/angular/compiler`.
 * @zh 类 `PropertyWrite`，封装 `src/core/angular2parse/angular/compiler` 中的属性写入数据结构与处理逻辑。
 */
export class PropertyWrite extends AST {
    /**
     * Creates an instance of `PropertyWrite` and initializes its dependencies and internal state.
     * @zh 创建 `PropertyWrite` 实例，并初始化其依赖项与内部状态。
     * @param span - Injected or initial span (`ParseSpan`) / 注入或传入的span（`ParseSpan`）
     * @param receiver - Injected or initial receiver (`AST`) / 注入或传入的receiver（`AST`）
     * @param name - Injected or initial name (`string`) / 注入或传入的名称（`string`）
     * @param value - Injected or initial value (`AST`) / 注入或传入的值（`AST`）
     */
    constructor(span: ParseSpan, public receiver: AST, public name: string, public value: AST) {
        super(span);
    }
    /**
     * Executes `visit` to handle visit.
     * @zh 执行 `visit`，用于访问。
     * @param visitor - visitor parameter (`AstVisitor`) / 访问器参数（`AstVisitor`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visit(visitor: AstVisitor, context = null) {
        return visitor.visitPropertyWrite(this, context);
    }
}

/**
 * Class `SafePropertyRead` encapsulating safe property read data structures and logic in `src/core/angular2parse/angular/compiler`.
 * @zh 类 `SafePropertyRead`，封装 `src/core/angular2parse/angular/compiler` 中的安全属性读取数据结构与处理逻辑。
 */
export class SafePropertyRead extends AST {
    /**
     * Creates an instance of `SafePropertyRead` and initializes its dependencies and internal state.
     * @zh 创建 `SafePropertyRead` 实例，并初始化其依赖项与内部状态。
     * @param span - Injected or initial span (`ParseSpan`) / 注入或传入的span（`ParseSpan`）
     * @param receiver - Injected or initial receiver (`AST`) / 注入或传入的receiver（`AST`）
     * @param name - Injected or initial name (`string`) / 注入或传入的名称（`string`）
     */
    constructor(span: ParseSpan, public receiver: AST, public name: string) { super(span); }
    /**
     * Executes `visit` to handle visit.
     * @zh 执行 `visit`，用于访问。
     * @param visitor - visitor parameter (`AstVisitor`) / 访问器参数（`AstVisitor`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visit(visitor: AstVisitor, context = null) {
        return visitor.visitSafePropertyRead(this, context);
    }
}

/**
 * Class `KeyedRead` encapsulating keyed read data structures and logic in `src/core/angular2parse/angular/compiler`.
 * @zh 类 `KeyedRead`，封装 `src/core/angular2parse/angular/compiler` 中的已键读取数据结构与处理逻辑。
 */
export class KeyedRead extends AST {
    /**
     * Creates an instance of `KeyedRead` and initializes its dependencies and internal state.
     * @zh 创建 `KeyedRead` 实例，并初始化其依赖项与内部状态。
     * @param span - Injected or initial span (`ParseSpan`) / 注入或传入的span（`ParseSpan`）
     * @param obj - Injected or initial obj (`AST`) / 注入或传入的对象（`AST`）
     * @param key - Injected or initial key (`AST`) / 注入或传入的键（`AST`）
     */
    constructor(span: ParseSpan, public obj: AST, public key: AST) { super(span); }
    /**
     * Executes `visit` to handle visit.
     * @zh 执行 `visit`，用于访问。
     * @param visitor - visitor parameter (`AstVisitor`) / 访问器参数（`AstVisitor`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visit(visitor: AstVisitor, context = null) {
        return visitor.visitKeyedRead(this, context);
    }
}

/**
 * Class `KeyedWrite` encapsulating keyed write data structures and logic in `src/core/angular2parse/angular/compiler`.
 * @zh 类 `KeyedWrite`，封装 `src/core/angular2parse/angular/compiler` 中的已键写入数据结构与处理逻辑。
 */
export class KeyedWrite extends AST {
    /**
     * Creates an instance of `KeyedWrite` and initializes its dependencies and internal state.
     * @zh 创建 `KeyedWrite` 实例，并初始化其依赖项与内部状态。
     * @param span - Injected or initial span (`ParseSpan`) / 注入或传入的span（`ParseSpan`）
     * @param obj - Injected or initial obj (`AST`) / 注入或传入的对象（`AST`）
     * @param key - Injected or initial key (`AST`) / 注入或传入的键（`AST`）
     * @param value - Injected or initial value (`AST`) / 注入或传入的值（`AST`）
     */
    constructor(span: ParseSpan, public obj: AST, public key: AST, public value: AST) { super(span); }
    /**
     * Executes `visit` to handle visit.
     * @zh 执行 `visit`，用于访问。
     * @param visitor - visitor parameter (`AstVisitor`) / 访问器参数（`AstVisitor`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visit(visitor: AstVisitor, context = null) {
        return visitor.visitKeyedWrite(this, context);
    }
}

/**
 * Class `BindingPipe` encapsulating binding pipe data structures and logic in `src/core/angular2parse/angular/compiler`.
 * @zh 类 `BindingPipe`，封装 `src/core/angular2parse/angular/compiler` 中的绑定管道数据结构与处理逻辑。
 */
export class BindingPipe extends AST {
    /**
     * Creates an instance of `BindingPipe` and initializes its dependencies and internal state.
     * @zh 创建 `BindingPipe` 实例，并初始化其依赖项与内部状态。
     * @param span - Injected or initial span (`ParseSpan`) / 注入或传入的span（`ParseSpan`）
     * @param exp - Injected or initial exp (`AST`) / 注入或传入的exp（`AST`）
     * @param name - Injected or initial name (`string`) / 注入或传入的名称（`string`）
     * @param args - Injected or initial args (`any`) / 注入或传入的参数列表（`any`）
     */
    constructor(span: ParseSpan, public exp: AST, public name: string, public args) {
        super(span);
    }
    /**
     * Executes `visit` to handle visit.
     * @zh 执行 `visit`，用于访问。
     * @param visitor - visitor parameter (`AstVisitor`) / 访问器参数（`AstVisitor`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visit(visitor: AstVisitor, context = null) { return visitor.visitPipe(this, context); }
}

/**
 * Class `LiteralPrimitive` encapsulating literal primitive data structures and logic in `src/core/angular2parse/angular/compiler`.
 * @zh 类 `LiteralPrimitive`，封装 `src/core/angular2parse/angular/compiler` 中的LiteralPrimitive数据结构与处理逻辑。
 */
export class LiteralPrimitive extends AST {
    /**
     * Creates an instance of `LiteralPrimitive` and initializes its dependencies and internal state.
     * @zh 创建 `LiteralPrimitive` 实例，并初始化其依赖项与内部状态。
     * @param span - Injected or initial span (`ParseSpan`) / 注入或传入的span（`ParseSpan`）
     * @param value - Injected or initial value (`any`) / 注入或传入的值（`any`）
     */
    constructor(span: ParseSpan, public value) { super(span); }
    /**
     * Executes `visit` to handle visit.
     * @zh 执行 `visit`，用于访问。
     * @param visitor - visitor parameter (`AstVisitor`) / 访问器参数（`AstVisitor`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visit(visitor: AstVisitor, context = null) {
        return visitor.visitLiteralPrimitive(this, context);
    }
}

/**
 * Class `LiteralArray` encapsulating literal array data structures and logic in `src/core/angular2parse/angular/compiler`.
 * @zh 类 `LiteralArray`，封装 `src/core/angular2parse/angular/compiler` 中的Literal数组数据结构与处理逻辑。
 */
export class LiteralArray extends AST {
    /**
     * Creates an instance of `LiteralArray` and initializes its dependencies and internal state.
     * @zh 创建 `LiteralArray` 实例，并初始化其依赖项与内部状态。
     * @param span - Injected or initial span (`ParseSpan`) / 注入或传入的span（`ParseSpan`）
     * @param expressions - Injected or initial expressions (`any`) / 注入或传入的表达式（`any`）
     */
    constructor(span: ParseSpan, public expressions) { super(span); }
    /**
     * Executes `visit` to handle visit.
     * @zh 执行 `visit`，用于访问。
     * @param visitor - visitor parameter (`AstVisitor`) / 访问器参数（`AstVisitor`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visit(visitor: AstVisitor, context = null) {
        return visitor.visitLiteralArray(this, context);
    }
}

/**
 * Class `LiteralMap` encapsulating literal map data structures and logic in `src/core/angular2parse/angular/compiler`.
 * @zh 类 `LiteralMap`，封装 `src/core/angular2parse/angular/compiler` 中的Literal映射表数据结构与处理逻辑。
 */
export class LiteralMap extends AST {
    /**
     * Creates an instance of `LiteralMap` and initializes its dependencies and internal state.
     * @zh 创建 `LiteralMap` 实例，并初始化其依赖项与内部状态。
     * @param span - Injected or initial span (`ParseSpan`) / 注入或传入的span（`ParseSpan`）
     * @param keys - Injected or initial keys (`any`) / 注入或传入的键列表（`any`）
     * @param values - Injected or initial values (`any`) / 注入或传入的值列表（`any`）
     */
    constructor(span: ParseSpan, public keys, public values) { super(span); }
    /**
     * Executes `visit` to handle visit.
     * @zh 执行 `visit`，用于访问。
     * @param visitor - visitor parameter (`AstVisitor`) / 访问器参数（`AstVisitor`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visit(visitor: AstVisitor, context = null) {
        return visitor.visitLiteralMap(this, context);
    }
}

/**
 * Class `Interpolation` encapsulating interpolation data structures and logic in `src/core/angular2parse/angular/compiler`.
 * @zh 类 `Interpolation`，封装 `src/core/angular2parse/angular/compiler` 中的Interpolation数据结构与处理逻辑。
 */
export class Interpolation extends AST {
    /**
     * Creates an instance of `Interpolation` and initializes its dependencies and internal state.
     * @zh 创建 `Interpolation` 实例，并初始化其依赖项与内部状态。
     * @param span - Injected or initial span (`ParseSpan`) / 注入或传入的span（`ParseSpan`）
     * @param strings - Injected or initial strings (`any`) / 注入或传入的字符串（`any`）
     * @param expressions - Injected or initial expressions (`any`) / 注入或传入的表达式（`any`）
     */
    constructor(span: ParseSpan, public strings, public expressions) { super(span); }
    /**
     * Executes `visit` to handle visit.
     * @zh 执行 `visit`，用于访问。
     * @param visitor - visitor parameter (`AstVisitor`) / 访问器参数（`AstVisitor`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visit(visitor: AstVisitor, context = null) {
        return visitor.visitInterpolation(this, context);
    }
}

/**
 * Class `Binary` encapsulating binary data structures and logic in `src/core/angular2parse/angular/compiler`.
 * @zh 类 `Binary`，封装 `src/core/angular2parse/angular/compiler` 中的Binary数据结构与处理逻辑。
 */
export class Binary extends AST {
    /**
     * Creates an instance of `Binary` and initializes its dependencies and internal state.
     * @zh 创建 `Binary` 实例，并初始化其依赖项与内部状态。
     * @param span - Injected or initial span (`ParseSpan`) / 注入或传入的span（`ParseSpan`）
     * @param operation - Injected or initial operation (`string`) / 注入或传入的operation（`string`）
     * @param left - Injected or initial left (`AST`) / 注入或传入的左侧位置（`AST`）
     * @param right - Injected or initial right (`AST`) / 注入或传入的右侧位置（`AST`）
     */
    constructor(span: ParseSpan, public operation: string, public left: AST, public right: AST) {
        super(span);
    }
    /**
     * Executes `visit` to handle visit.
     * @zh 执行 `visit`，用于访问。
     * @param visitor - visitor parameter (`AstVisitor`) / 访问器参数（`AstVisitor`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visit(visitor: AstVisitor, context = null) {
        return visitor.visitBinary(this, context);
    }
}

/**
 * Class `PrefixNot` encapsulating prefix not data structures and logic in `src/core/angular2parse/angular/compiler`.
 * @zh 类 `PrefixNot`，封装 `src/core/angular2parse/angular/compiler` 中的前缀Not数据结构与处理逻辑。
 */
export class PrefixNot extends AST {
    /**
     * Creates an instance of `PrefixNot` and initializes its dependencies and internal state.
     * @zh 创建 `PrefixNot` 实例，并初始化其依赖项与内部状态。
     * @param span - Injected or initial span (`ParseSpan`) / 注入或传入的span（`ParseSpan`）
     * @param expression - Injected or initial expression (`AST`) / 注入或传入的表达式（`AST`）
     */
    constructor(span: ParseSpan, public expression: AST) { super(span); }
    /**
     * Executes `visit` to handle visit.
     * @zh 执行 `visit`，用于访问。
     * @param visitor - visitor parameter (`AstVisitor`) / 访问器参数（`AstVisitor`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visit(visitor: AstVisitor, context = null) {
        return visitor.visitPrefixNot(this, context);
    }
}

/**
 * Class `MethodCall` encapsulating method call data structures and logic in `src/core/angular2parse/angular/compiler`.
 * @zh 类 `MethodCall`，封装 `src/core/angular2parse/angular/compiler` 中的方法调用数据结构与处理逻辑。
 */
export class MethodCall extends AST {
    /**
     * Creates an instance of `MethodCall` and initializes its dependencies and internal state.
     * @zh 创建 `MethodCall` 实例，并初始化其依赖项与内部状态。
     * @param span - Injected or initial span (`ParseSpan`) / 注入或传入的span（`ParseSpan`）
     * @param receiver - Injected or initial receiver (`AST`) / 注入或传入的receiver（`AST`）
     * @param name - Injected or initial name (`string`) / 注入或传入的名称（`string`）
     * @param args - Injected or initial args (`any`) / 注入或传入的参数列表（`any`）
     */
    constructor(span: ParseSpan, public receiver: AST, public name: string, public args) {
        super(span);
    }
    /**
     * Executes `visit` to handle visit.
     * @zh 执行 `visit`，用于访问。
     * @param visitor - visitor parameter (`AstVisitor`) / 访问器参数（`AstVisitor`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visit(visitor: AstVisitor, context = null) {
        return visitor.visitMethodCall(this, context);
    }
}

/**
 * Class `SafeMethodCall` encapsulating safe method call data structures and logic in `src/core/angular2parse/angular/compiler`.
 * @zh 类 `SafeMethodCall`，封装 `src/core/angular2parse/angular/compiler` 中的安全方法调用数据结构与处理逻辑。
 */
export class SafeMethodCall extends AST {
    /**
     * Creates an instance of `SafeMethodCall` and initializes its dependencies and internal state.
     * @zh 创建 `SafeMethodCall` 实例，并初始化其依赖项与内部状态。
     * @param span - Injected or initial span (`ParseSpan`) / 注入或传入的span（`ParseSpan`）
     * @param receiver - Injected or initial receiver (`AST`) / 注入或传入的receiver（`AST`）
     * @param name - Injected or initial name (`string`) / 注入或传入的名称（`string`）
     * @param args - Injected or initial args (`any`) / 注入或传入的参数列表（`any`）
     */
    constructor(span: ParseSpan, public receiver: AST, public name: string, public args) {
        super(span);
    }
    /**
     * Executes `visit` to handle visit.
     * @zh 执行 `visit`，用于访问。
     * @param visitor - visitor parameter (`AstVisitor`) / 访问器参数（`AstVisitor`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visit(visitor: AstVisitor, context = null) {
        return visitor.visitSafeMethodCall(this, context);
    }
}

/**
 * Class `FunctionCall` encapsulating function call data structures and logic in `src/core/angular2parse/angular/compiler`.
 * @zh 类 `FunctionCall`，封装 `src/core/angular2parse/angular/compiler` 中的函数调用数据结构与处理逻辑。
 */
export class FunctionCall extends AST {
    /**
     * Creates an instance of `FunctionCall` and initializes its dependencies and internal state.
     * @zh 创建 `FunctionCall` 实例，并初始化其依赖项与内部状态。
     * @param span - Injected or initial span (`ParseSpan`) / 注入或传入的span（`ParseSpan`）
     * @param target - Injected or initial target (`AST`) / 注入或传入的目标（`AST`）
     * @param args - Injected or initial args (`any`) / 注入或传入的参数列表（`any`）
     */
    constructor(span: ParseSpan, public target: AST, public args) { super(span); }
    /**
     * Executes `visit` to handle visit.
     * @zh 执行 `visit`，用于访问。
     * @param visitor - visitor parameter (`AstVisitor`) / 访问器参数（`AstVisitor`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visit(visitor: AstVisitor, context = null) {
        return visitor.visitFunctionCall(this, context);
    }
}

/**
 * Class `ASTWithSource` encapsulating ast with source data structures and logic in `src/core/angular2parse/angular/compiler`.
 * @zh 类 `ASTWithSource`，封装 `src/core/angular2parse/angular/compiler` 中的抽象语法树带有源数据结构与处理逻辑。
 */
export class ASTWithSource extends AST {
    /**
     * Creates an instance of `ASTWithSource` and initializes its dependencies and internal state.
     * @zh 创建 `ASTWithSource` 实例，并初始化其依赖项与内部状态。
     * @param ast - Injected or initial ast (`AST`) / 注入或传入的抽象语法树（`AST`）
     * @param source - Injected or initial source (`string`) / 注入或传入的源（`string`）
     * @param location - Injected or initial location (`string`) / 注入或传入的location（`string`）
     * @param errors - Injected or initial errors (`ParserError[]`) / 注入或传入的错误列表（`ParserError[]`）
     */
    constructor(
        public ast: AST, public source: string, public location: string,
        public errors: ParserError[]) {
        super(new ParseSpan(0, isBlank(source) ? 0 : source.length));
    }
    /**
     * Executes `visit` to handle visit.
     * @zh 执行 `visit`，用于访问。
     * @param visitor - visitor parameter (`AstVisitor`) / 访问器参数（`AstVisitor`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visit(visitor: AstVisitor, context = null) { return this.ast.visit(visitor, context); }
    /**
     * Executes `toString` to handle to string.
     * @zh 执行 `toString`，用于转换为字符串。
     * @returns Result of type `string` / 类型为 `string` 的返回值
     */
    override toString(): string { return `${this.source} in ${this.location}`; }
}

/**
 * Class `TemplateBinding` encapsulating template binding data structures and logic in `src/core/angular2parse/angular/compiler`.
 * @zh 类 `TemplateBinding`，封装 `src/core/angular2parse/angular/compiler` 中的模板绑定数据结构与处理逻辑。
 */
export class TemplateBinding {
    /**
     * Creates an instance of `TemplateBinding` and initializes its dependencies and internal state.
     * @zh 创建 `TemplateBinding` 实例，并初始化其依赖项与内部状态。
     * @param span - Injected or initial span (`ParseSpan`) / 注入或传入的span（`ParseSpan`）
     * @param key - Injected or initial key (`string`) / 注入或传入的键（`string`）
     * @param keyIsVar - Injected or initial key is var (`boolean`) / 注入或传入的键是否为Var（`boolean`）
     * @param name - Injected or initial name (`string`) / 注入或传入的名称（`string`）
     * @param expression - Injected or initial expression (`ASTWithSource`) / 注入或传入的表达式（`ASTWithSource`）
     */
    constructor(
        public span: ParseSpan, public key: string, public keyIsVar: boolean, public name: string,
        public expression: ASTWithSource) {}
}

/**
 * Interface `AstVisitor` defining the contract and properties for ast visitor.
 * @zh 接口 `AstVisitor`，定义抽象语法树访问器的数据结构契约与属性规范。
 */
export interface AstVisitor {
    /**
     * Executes `visitBinary` to handle visit binary.
     * @zh 执行 `visitBinary`，用于访问Binary。
     * @param ast - ast parameter (`Binary`) / 抽象语法树参数（`Binary`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    visitBinary(ast: Binary, context);
    /**
     * Executes `visitChain` to handle visit chain.
     * @zh 执行 `visitChain`，用于访问Chain。
     * @param ast - ast parameter (`Chain`) / 抽象语法树参数（`Chain`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    visitChain(ast: Chain, context);
    /**
     * Executes `visitConditional` to handle visit conditional.
     * @zh 执行 `visitConditional`，用于访问Conditional。
     * @param ast - ast parameter (`Conditional`) / 抽象语法树参数（`Conditional`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    visitConditional(ast: Conditional, context);
    /**
     * Executes `visitFunctionCall` to handle visit function call.
     * @zh 执行 `visitFunctionCall`，用于访问函数调用。
     * @param ast - ast parameter (`FunctionCall`) / 抽象语法树参数（`FunctionCall`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    visitFunctionCall(ast: FunctionCall, context);
    /**
     * Executes `visitImplicitReceiver` to handle visit implicit receiver.
     * @zh 执行 `visitImplicitReceiver`，用于访问ImplicitReceiver。
     * @param ast - ast parameter (`ImplicitReceiver`) / 抽象语法树参数（`ImplicitReceiver`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    visitImplicitReceiver(ast: ImplicitReceiver, context);
    /**
     * Executes `visitInterpolation` to handle visit interpolation.
     * @zh 执行 `visitInterpolation`，用于访问Interpolation。
     * @param ast - ast parameter (`Interpolation`) / 抽象语法树参数（`Interpolation`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    visitInterpolation(ast: Interpolation, context);
    /**
     * Executes `visitKeyedRead` to handle visit keyed read.
     * @zh 执行 `visitKeyedRead`，用于访问已键读取。
     * @param ast - ast parameter (`KeyedRead`) / 抽象语法树参数（`KeyedRead`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    visitKeyedRead(ast: KeyedRead, context);
    /**
     * Executes `visitKeyedWrite` to handle visit keyed write.
     * @zh 执行 `visitKeyedWrite`，用于访问已键写入。
     * @param ast - ast parameter (`KeyedWrite`) / 抽象语法树参数（`KeyedWrite`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    visitKeyedWrite(ast: KeyedWrite, context);
    /**
     * Executes `visitLiteralArray` to handle visit literal array.
     * @zh 执行 `visitLiteralArray`，用于访问Literal数组。
     * @param ast - ast parameter (`LiteralArray`) / 抽象语法树参数（`LiteralArray`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    visitLiteralArray(ast: LiteralArray, context);
    /**
     * Executes `visitLiteralMap` to handle visit literal map.
     * @zh 执行 `visitLiteralMap`，用于访问Literal映射表。
     * @param ast - ast parameter (`LiteralMap`) / 抽象语法树参数（`LiteralMap`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    visitLiteralMap(ast: LiteralMap, context);
    /**
     * Executes `visitLiteralPrimitive` to handle visit literal primitive.
     * @zh 执行 `visitLiteralPrimitive`，用于访问LiteralPrimitive。
     * @param ast - ast parameter (`LiteralPrimitive`) / 抽象语法树参数（`LiteralPrimitive`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    visitLiteralPrimitive(ast: LiteralPrimitive, context);
    /**
     * Executes `visitMethodCall` to handle visit method call.
     * @zh 执行 `visitMethodCall`，用于访问方法调用。
     * @param ast - ast parameter (`MethodCall`) / 抽象语法树参数（`MethodCall`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    visitMethodCall(ast: MethodCall, context);
    /**
     * Executes `visitPipe` to handle visit pipe.
     * @zh 执行 `visitPipe`，用于访问管道。
     * @param ast - ast parameter (`BindingPipe`) / 抽象语法树参数（`BindingPipe`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    visitPipe(ast: BindingPipe, context);
    /**
     * Executes `visitPrefixNot` to handle visit prefix not.
     * @zh 执行 `visitPrefixNot`，用于访问前缀Not。
     * @param ast - ast parameter (`PrefixNot`) / 抽象语法树参数（`PrefixNot`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    visitPrefixNot(ast: PrefixNot, context);
    /**
     * Executes `visitPropertyRead` to handle visit property read.
     * @zh 执行 `visitPropertyRead`，用于访问属性读取。
     * @param ast - ast parameter (`PropertyRead`) / 抽象语法树参数（`PropertyRead`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    visitPropertyRead(ast: PropertyRead, context);
    /**
     * Executes `visitPropertyWrite` to handle visit property write.
     * @zh 执行 `visitPropertyWrite`，用于访问属性写入。
     * @param ast - ast parameter (`PropertyWrite`) / 抽象语法树参数（`PropertyWrite`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    visitPropertyWrite(ast: PropertyWrite, context);
    /**
     * Executes `visitQuote` to handle visit quote.
     * @zh 执行 `visitQuote`，用于访问Quote。
     * @param ast - ast parameter (`Quote`) / 抽象语法树参数（`Quote`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    visitQuote(ast: Quote, context);
    /**
     * Executes `visitSafeMethodCall` to handle visit safe method call.
     * @zh 执行 `visitSafeMethodCall`，用于访问安全方法调用。
     * @param ast - ast parameter (`SafeMethodCall`) / 抽象语法树参数（`SafeMethodCall`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    visitSafeMethodCall(ast: SafeMethodCall, context);
    /**
     * Executes `visitSafePropertyRead` to handle visit safe property read.
     * @zh 执行 `visitSafePropertyRead`，用于访问安全属性读取。
     * @param ast - ast parameter (`SafePropertyRead`) / 抽象语法树参数（`SafePropertyRead`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    visitSafePropertyRead(ast: SafePropertyRead, context);
}

/**
 * Class `RecursiveAstVisitor` encapsulating recursive ast visitor data structures and logic in `src/core/angular2parse/angular/compiler`.
 * @zh 类 `RecursiveAstVisitor`，封装 `src/core/angular2parse/angular/compiler` 中的Recursive抽象语法树访问器数据结构与处理逻辑。
 */
export class RecursiveAstVisitor implements AstVisitor {
    /**
     * Executes `visitBinary` to handle visit binary.
     * @zh 执行 `visitBinary`，用于访问Binary。
     * @param ast - ast parameter (`Binary`) / 抽象语法树参数（`Binary`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    visitBinary(ast: Binary, context) {
        ast.left.visit(this);
        ast.right.visit(this);
        return null;
    }
    /**
     * Executes `visitChain` to handle visit chain.
     * @zh 执行 `visitChain`，用于访问Chain。
     * @param ast - ast parameter (`Chain`) / 抽象语法树参数（`Chain`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    visitChain(ast: Chain, context) { return this.visitAll(ast.expressions, context); }
    /**
     * Executes `visitConditional` to handle visit conditional.
     * @zh 执行 `visitConditional`，用于访问Conditional。
     * @param ast - ast parameter (`Conditional`) / 抽象语法树参数（`Conditional`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    visitConditional(ast: Conditional, context) {
        ast.condition.visit(this);
        ast.trueExp.visit(this);
        ast.falseExp.visit(this);
        return null;
    }
    /**
     * Executes `visitPipe` to handle visit pipe.
     * @zh 执行 `visitPipe`，用于访问管道。
     * @param ast - ast parameter (`BindingPipe`) / 抽象语法树参数（`BindingPipe`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    visitPipe(ast: BindingPipe, context) {
        ast.exp.visit(this);
        this.visitAll(ast.args, context);
        return null;
    }
    /**
     * Executes `visitFunctionCall` to handle visit function call.
     * @zh 执行 `visitFunctionCall`，用于访问函数调用。
     * @param ast - ast parameter (`FunctionCall`) / 抽象语法树参数（`FunctionCall`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    visitFunctionCall(ast: FunctionCall, context) {
        ast.target.visit(this);
        this.visitAll(ast.args, context);
        return null;
    }
    /**
     * Executes `visitImplicitReceiver` to handle visit implicit receiver.
     * @zh 执行 `visitImplicitReceiver`，用于访问ImplicitReceiver。
     * @param ast - ast parameter (`ImplicitReceiver`) / 抽象语法树参数（`ImplicitReceiver`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    visitImplicitReceiver(ast: ImplicitReceiver, context) { return null; }
    /**
     * Executes `visitInterpolation` to handle visit interpolation.
     * @zh 执行 `visitInterpolation`，用于访问Interpolation。
     * @param ast - ast parameter (`Interpolation`) / 抽象语法树参数（`Interpolation`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    visitInterpolation(ast: Interpolation, context) {
        return this.visitAll(ast.expressions, context);
    }
    /**
     * Executes `visitKeyedRead` to handle visit keyed read.
     * @zh 执行 `visitKeyedRead`，用于访问已键读取。
     * @param ast - ast parameter (`KeyedRead`) / 抽象语法树参数（`KeyedRead`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    visitKeyedRead(ast: KeyedRead, context) {
        ast.obj.visit(this);
        ast.key.visit(this);
        return null;
    }
    /**
     * Executes `visitKeyedWrite` to handle visit keyed write.
     * @zh 执行 `visitKeyedWrite`，用于访问已键写入。
     * @param ast - ast parameter (`KeyedWrite`) / 抽象语法树参数（`KeyedWrite`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    visitKeyedWrite(ast: KeyedWrite, context) {
        ast.obj.visit(this);
        ast.key.visit(this);
        ast.value.visit(this);
        return null;
    }
    /**
     * Executes `visitLiteralArray` to handle visit literal array.
     * @zh 执行 `visitLiteralArray`，用于访问Literal数组。
     * @param ast - ast parameter (`LiteralArray`) / 抽象语法树参数（`LiteralArray`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    visitLiteralArray(ast: LiteralArray, context) {
        return this.visitAll(ast.expressions, context);
    }
    /**
     * Executes `visitLiteralMap` to handle visit literal map.
     * @zh 执行 `visitLiteralMap`，用于访问Literal映射表。
     * @param ast - ast parameter (`LiteralMap`) / 抽象语法树参数（`LiteralMap`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    visitLiteralMap(ast: LiteralMap, context) { return this.visitAll(ast.values, context); }
    /**
     * Executes `visitLiteralPrimitive` to handle visit literal primitive.
     * @zh 执行 `visitLiteralPrimitive`，用于访问LiteralPrimitive。
     * @param ast - ast parameter (`LiteralPrimitive`) / 抽象语法树参数（`LiteralPrimitive`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    visitLiteralPrimitive(ast: LiteralPrimitive, context) { return null; }
    /**
     * Executes `visitMethodCall` to handle visit method call.
     * @zh 执行 `visitMethodCall`，用于访问方法调用。
     * @param ast - ast parameter (`MethodCall`) / 抽象语法树参数（`MethodCall`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    visitMethodCall(ast: MethodCall, context) {
        ast.receiver.visit(this);
        return this.visitAll(ast.args, context);
    }
    /**
     * Executes `visitPrefixNot` to handle visit prefix not.
     * @zh 执行 `visitPrefixNot`，用于访问前缀Not。
     * @param ast - ast parameter (`PrefixNot`) / 抽象语法树参数（`PrefixNot`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    visitPrefixNot(ast: PrefixNot, context) {
        ast.expression.visit(this);
        return null;
    }
    /**
     * Executes `visitPropertyRead` to handle visit property read.
     * @zh 执行 `visitPropertyRead`，用于访问属性读取。
     * @param ast - ast parameter (`PropertyRead`) / 抽象语法树参数（`PropertyRead`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    visitPropertyRead(ast: PropertyRead, context) {
        ast.receiver.visit(this);
        return null;
    }
    /**
     * Executes `visitPropertyWrite` to handle visit property write.
     * @zh 执行 `visitPropertyWrite`，用于访问属性写入。
     * @param ast - ast parameter (`PropertyWrite`) / 抽象语法树参数（`PropertyWrite`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    visitPropertyWrite(ast: PropertyWrite, context) {
        ast.receiver.visit(this);
        ast.value.visit(this);
        return null;
    }
    /**
     * Executes `visitSafePropertyRead` to handle visit safe property read.
     * @zh 执行 `visitSafePropertyRead`，用于访问安全属性读取。
     * @param ast - ast parameter (`SafePropertyRead`) / 抽象语法树参数（`SafePropertyRead`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    visitSafePropertyRead(ast: SafePropertyRead, context) {
        ast.receiver.visit(this);
        return null;
    }
    /**
     * Executes `visitSafeMethodCall` to handle visit safe method call.
     * @zh 执行 `visitSafeMethodCall`，用于访问安全方法调用。
     * @param ast - ast parameter (`SafeMethodCall`) / 抽象语法树参数（`SafeMethodCall`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    visitSafeMethodCall(ast: SafeMethodCall, context) {
        ast.receiver.visit(this);
        return this.visitAll(ast.args, context);
    }
    /**
     * Executes `visitAll` to handle visit all.
     * @zh 执行 `visitAll`，用于访问全部。
     * @param asts - asts parameter (`AST[]`) / 抽象语法树参数（`AST[]`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    visitAll(asts: AST[], context) {
        asts.forEach(ast => ast.visit(this, context));
        return null;
    }
    /**
     * Executes `visitQuote` to handle visit quote.
     * @zh 执行 `visitQuote`，用于访问Quote。
     * @param ast - ast parameter (`Quote`) / 抽象语法树参数（`Quote`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    visitQuote(ast: Quote, context) { return null; }
}

/**
 * Class `AstTransformer` encapsulating ast transformer data structures and logic in `src/core/angular2parse/angular/compiler`.
 * @zh 类 `AstTransformer`，封装 `src/core/angular2parse/angular/compiler` 中的抽象语法树转换器数据结构与处理逻辑。
 */
export class AstTransformer implements AstVisitor {
    /**
     * Executes `visitImplicitReceiver` to handle visit implicit receiver.
     * @zh 执行 `visitImplicitReceiver`，用于访问ImplicitReceiver。
     * @param ast - ast parameter (`ImplicitReceiver`) / 抽象语法树参数（`ImplicitReceiver`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `AST` / 类型为 `AST` 的返回值
     */
    visitImplicitReceiver(ast: ImplicitReceiver, context): AST { return ast; }

    /**
     * Executes `visitInterpolation` to handle visit interpolation.
     * @zh 执行 `visitInterpolation`，用于访问Interpolation。
     * @param ast - ast parameter (`Interpolation`) / 抽象语法树参数（`Interpolation`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `AST` / 类型为 `AST` 的返回值
     */
    visitInterpolation(ast: Interpolation, context): AST {
        return new Interpolation(ast.span, ast.strings, this.visitAll(ast.expressions));
    }

    /**
     * Executes `visitLiteralPrimitive` to handle visit literal primitive.
     * @zh 执行 `visitLiteralPrimitive`，用于访问LiteralPrimitive。
     * @param ast - ast parameter (`LiteralPrimitive`) / 抽象语法树参数（`LiteralPrimitive`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `AST` / 类型为 `AST` 的返回值
     */
    visitLiteralPrimitive(ast: LiteralPrimitive, context): AST {
        return new LiteralPrimitive(ast.span, ast.value);
    }

    /**
     * Executes `visitPropertyRead` to handle visit property read.
     * @zh 执行 `visitPropertyRead`，用于访问属性读取。
     * @param ast - ast parameter (`PropertyRead`) / 抽象语法树参数（`PropertyRead`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `AST` / 类型为 `AST` 的返回值
     */
    visitPropertyRead(ast: PropertyRead, context): AST {
        return new PropertyRead(ast.span, ast.receiver.visit(this), ast.name);
    }

    /**
     * Executes `visitPropertyWrite` to handle visit property write.
     * @zh 执行 `visitPropertyWrite`，用于访问属性写入。
     * @param ast - ast parameter (`PropertyWrite`) / 抽象语法树参数（`PropertyWrite`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `AST` / 类型为 `AST` 的返回值
     */
    visitPropertyWrite(ast: PropertyWrite, context): AST {
        return new PropertyWrite(ast.span, ast.receiver.visit(this), ast.name, ast.value);
    }

    /**
     * Executes `visitSafePropertyRead` to handle visit safe property read.
     * @zh 执行 `visitSafePropertyRead`，用于访问安全属性读取。
     * @param ast - ast parameter (`SafePropertyRead`) / 抽象语法树参数（`SafePropertyRead`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `AST` / 类型为 `AST` 的返回值
     */
    visitSafePropertyRead(ast: SafePropertyRead, context): AST {
        return new SafePropertyRead(ast.span, ast.receiver.visit(this), ast.name);
    }

    /**
     * Executes `visitMethodCall` to handle visit method call.
     * @zh 执行 `visitMethodCall`，用于访问方法调用。
     * @param ast - ast parameter (`MethodCall`) / 抽象语法树参数（`MethodCall`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `AST` / 类型为 `AST` 的返回值
     */
    visitMethodCall(ast: MethodCall, context): AST {
        return new MethodCall(ast.span, ast.receiver.visit(this), ast.name, this.visitAll(ast.args));
    }

    /**
     * Executes `visitSafeMethodCall` to handle visit safe method call.
     * @zh 执行 `visitSafeMethodCall`，用于访问安全方法调用。
     * @param ast - ast parameter (`SafeMethodCall`) / 抽象语法树参数（`SafeMethodCall`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `AST` / 类型为 `AST` 的返回值
     */
    visitSafeMethodCall(ast: SafeMethodCall, context): AST {
        return new SafeMethodCall(
            ast.span, ast.receiver.visit(this), ast.name, this.visitAll(ast.args));
    }

    /**
     * Executes `visitFunctionCall` to handle visit function call.
     * @zh 执行 `visitFunctionCall`，用于访问函数调用。
     * @param ast - ast parameter (`FunctionCall`) / 抽象语法树参数（`FunctionCall`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `AST` / 类型为 `AST` 的返回值
     */
    visitFunctionCall(ast: FunctionCall, context): AST {
        return Reflect.construct(FunctionCall, [ast.span, ast.target.visit(this), this.visitAll(ast.args)]) as FunctionCall;
    }

    /**
     * Executes `visitLiteralArray` to handle visit literal array.
     * @zh 执行 `visitLiteralArray`，用于访问Literal数组。
     * @param ast - ast parameter (`LiteralArray`) / 抽象语法树参数（`LiteralArray`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `AST` / 类型为 `AST` 的返回值
     */
    visitLiteralArray(ast: LiteralArray, context): AST {
        return new LiteralArray(ast.span, this.visitAll(ast.expressions));
    }

    /**
     * Executes `visitLiteralMap` to handle visit literal map.
     * @zh 执行 `visitLiteralMap`，用于访问Literal映射表。
     * @param ast - ast parameter (`LiteralMap`) / 抽象语法树参数（`LiteralMap`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `AST` / 类型为 `AST` 的返回值
     */
    visitLiteralMap(ast: LiteralMap, context): AST {
        return new LiteralMap(ast.span, ast.keys, this.visitAll(ast.values));
    }

    /**
     * Executes `visitBinary` to handle visit binary.
     * @zh 执行 `visitBinary`，用于访问Binary。
     * @param ast - ast parameter (`Binary`) / 抽象语法树参数（`Binary`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `AST` / 类型为 `AST` 的返回值
     */
    visitBinary(ast: Binary, context): AST {
        return new Binary(ast.span, ast.operation, ast.left.visit(this), ast.right.visit(this));
    }

    /**
     * Executes `visitPrefixNot` to handle visit prefix not.
     * @zh 执行 `visitPrefixNot`，用于访问前缀Not。
     * @param ast - ast parameter (`PrefixNot`) / 抽象语法树参数（`PrefixNot`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `AST` / 类型为 `AST` 的返回值
     */
    visitPrefixNot(ast: PrefixNot, context): AST {
        return new PrefixNot(ast.span, ast.expression.visit(this));
    }

    /**
     * Executes `visitConditional` to handle visit conditional.
     * @zh 执行 `visitConditional`，用于访问Conditional。
     * @param ast - ast parameter (`Conditional`) / 抽象语法树参数（`Conditional`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `AST` / 类型为 `AST` 的返回值
     */
    visitConditional(ast: Conditional, context): AST {
        return new Conditional(
            ast.span, ast.condition.visit(this), ast.trueExp.visit(this), ast.falseExp.visit(this));
    }

    /**
     * Executes `visitPipe` to handle visit pipe.
     * @zh 执行 `visitPipe`，用于访问管道。
     * @param ast - ast parameter (`BindingPipe`) / 抽象语法树参数（`BindingPipe`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `AST` / 类型为 `AST` 的返回值
     */
    visitPipe(ast: BindingPipe, context): AST {
        return new BindingPipe(ast.span, ast.exp.visit(this), ast.name, this.visitAll(ast.args));
    }

    /**
     * Executes `visitKeyedRead` to handle visit keyed read.
     * @zh 执行 `visitKeyedRead`，用于访问已键读取。
     * @param ast - ast parameter (`KeyedRead`) / 抽象语法树参数（`KeyedRead`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `AST` / 类型为 `AST` 的返回值
     */
    visitKeyedRead(ast: KeyedRead, context): AST {
        return new KeyedRead(ast.span, ast.obj.visit(this), ast.key.visit(this));
    }

    /**
     * Executes `visitKeyedWrite` to handle visit keyed write.
     * @zh 执行 `visitKeyedWrite`，用于访问已键写入。
     * @param ast - ast parameter (`KeyedWrite`) / 抽象语法树参数（`KeyedWrite`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `AST` / 类型为 `AST` 的返回值
     */
    visitKeyedWrite(ast: KeyedWrite, context): AST {
        return new KeyedWrite(
            ast.span, ast.obj.visit(this), ast.key.visit(this), ast.value.visit(this));
    }

    /**
     * Executes `visitAll` to handle visit all.
     * @zh 执行 `visitAll`，用于访问全部。
     * @param asts - asts parameter (`any`) / 抽象语法树参数（`any`）
     * @returns Result of type `any[]` / 类型为 `any[]` 的返回值
     */
    visitAll(asts) {
        const res = new Array(asts.length);
        for (let i = 0; i < asts.length; ++i) {
            res[i] = asts[i].visit(this);
        }
        return res;
    }

    /**
     * Executes `visitChain` to handle visit chain.
     * @zh 执行 `visitChain`，用于访问Chain。
     * @param ast - ast parameter (`Chain`) / 抽象语法树参数（`Chain`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `AST` / 类型为 `AST` 的返回值
     */
    visitChain(ast: Chain, context): AST {
        return new Chain(ast.span, this.visitAll(ast.expressions));
    }

    /**
     * Executes `visitQuote` to handle visit quote.
     * @zh 执行 `visitQuote`，用于访问Quote。
     * @param ast - ast parameter (`Quote`) / 抽象语法树参数（`Quote`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `AST` / 类型为 `AST` 的返回值
     */
    visitQuote(ast: Quote, context): AST {
        return new Quote(ast.span, ast.prefix, ast.uninterpretedExpression, ast.location);
    }
}