/**
 * @fileoverview Module `src/core/angular2parse/visitors/parse-visitor-resolver.ts` providing parse visitor resolver definitions and implementation.
 * @zh 模块文件 `src/core/angular2parse/visitors/parse-visitor-resolver.ts`，提供解析访问器解析器相关的定义与实现。
 */

import {
    AST,
    RecursiveAstVisitor,
    PropertyRead,
    MethodCall,
    KeyedRead,
    ImplicitReceiver,
    LiteralPrimitive,
    Binary,
    Chain,
    Conditional,
    BindingPipe,
    FunctionCall,
    Interpolation,
    KeyedWrite,
    LiteralArray,
    LiteralMap,
    PrefixNot,
    PropertyWrite,
    SafePropertyRead,
    SafeMethodCall,
    Quote,
    isPresent,isJsObject
} from '../angular';
import * as util from '../util';

import { BinaryOperations } from '../util/binary-operations';

/**
 * Class `ParseVisitorResolver` encapsulating parse visitor resolver data structures and logic in `src/core/angular2parse/visitors`.
 * @zh 类 `ParseVisitorResolver`，封装 `src/core/angular2parse/visitors` 中的解析访问器解析器数据结构与处理逻辑。
 */
export class ParseVisitorResolver extends RecursiveAstVisitor {

    /**
     * Creates an instance of `ParseVisitorResolver` and initializes its dependencies and internal state.
     * @zh 创建 `ParseVisitorResolver` 实例，并初始化其依赖项与内部状态。
     * @param pipes - Injected or initial pipes (`Map<string, any>`) / 注入或传入的管道（`Map<string, any>`）
     */
    constructor(private pipes) {
        super();
    };

    /**
     * Executes `visitBinary` to handle visit binary.
     * @zh 执行 `visitBinary`，用于访问Binary。
     * @param ast - ast parameter (`Binary`) / 抽象语法树参数（`Binary`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visitBinary(ast: Binary, context) {
        const execFn = BinaryOperations.get(ast.operation);

        if (!execFn) {
            throw new Error(`Parse ERROR: on visitBinary, unknown operator ${ast.operation}`);
        }

        return execFn(ast.left.visit(this, context), ast.right.visit(this, context));
    }

    // TODO
    /**
     * Executes `visitChain` to handle visit chain.
     * @zh 执行 `visitChain`，用于访问Chain。
     * @param ast - ast parameter (`Chain`) / 抽象语法树参数（`Chain`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visitChain(ast: Chain, context) {
        return this.visitAll(ast.expressions, context);
    }

    /**
     * Executes `visitConditional` to handle visit conditional.
     * @zh 执行 `visitConditional`，用于访问Conditional。
     * @param ast - ast parameter (`Conditional`) / 抽象语法树参数（`Conditional`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visitConditional(ast: Conditional, context) {
        if (ast.condition.visit(this, context)) {
            return ast.trueExp.visit(this, context);
        }
        else if (isPresent(ast.falseExp)) {
            return ast.falseExp.visit(this, context);
        }

        return null;
    }

    /**
     * Executes `visitPipe` to handle visit pipe.
     * @zh 执行 `visitPipe`，用于访问管道。
     * @param ast - ast parameter (`BindingPipe`) / 抽象语法树参数（`BindingPipe`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visitPipe(ast: BindingPipe, context) {
        const pipe = this.pipes.get(ast.name);

        if (!pipe) {
            throw new Error(`pipe ${ast.name} not found.`);
        }

        if (!pipe.transform) {
            throw new Error(`Parse ERROR: on visitPipe, transform method doesn't exist on pipe ${ast.name}.`);
        }

        const value = ast.exp.visit(this, context);
        const pipeArgs = this.visitAll(ast.args, context);

        pipeArgs.unshift(value);

        return pipe.transform.apply(null, pipeArgs);
    }

    // TODO
    /**
     * Executes `visitFunctionCall` to handle visit function call.
     * @zh 执行 `visitFunctionCall`，用于访问函数调用。
     * @param ast - ast parameter (`FunctionCall`) / 抽象语法树参数（`FunctionCall`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visitFunctionCall(ast: FunctionCall, context) {
        const target = ast.target.visit(this, context);

        if (!util.isFunction(target)) {
            throw new Error(`Parse ERROR: on visitFunctionCall, target is not a function.`);
        }

        const args = this.visitAll(ast.args, context);
        return target.apply(target, args);
    }

    /**
     * Executes `visitImplicitReceiver` to handle visit implicit receiver.
     * @zh 执行 `visitImplicitReceiver`，用于访问ImplicitReceiver。
     * @param ast - ast parameter (`ImplicitReceiver`) / 抽象语法树参数（`ImplicitReceiver`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visitImplicitReceiver(ast: ImplicitReceiver, context) {
        return context;
    }

    /**
     * Executes `visitInterpolation` to handle visit interpolation.
     * @zh 执行 `visitInterpolation`，用于访问Interpolation。
     * @param ast - ast parameter (`Interpolation`) / 抽象语法树参数（`Interpolation`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visitInterpolation(ast: Interpolation, context) {
        return this.visitAll(ast.expressions, context)[0];
    }

    /**
     * Executes `visitKeyedRead` to handle visit keyed read.
     * @zh 执行 `visitKeyedRead`，用于访问已键读取。
     * @param ast - ast parameter (`KeyedRead`) / 抽象语法树参数（`KeyedRead`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visitKeyedRead(ast: KeyedRead, context) {
        const obj = ast.obj.visit(this, context);
        const key = ast.key.visit(this, context);
        return obj[key];
    }

    /**
     * Executes `visitKeyedWrite` to handle visit keyed write.
     * @zh 执行 `visitKeyedWrite`，用于访问已键写入。
     * @param ast - ast parameter (`KeyedWrite`) / 抽象语法树参数（`KeyedWrite`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visitKeyedWrite(ast: KeyedWrite, context) {
        const obj = ast.obj.visit(this, context);
        const key = ast.key.visit(this, context);
        const value = ast.value.visit(this, context);
        obj[key] = value;
        return null;
    }

    /**
     * Executes `visitLiteralArray` to handle visit literal array.
     * @zh 执行 `visitLiteralArray`，用于访问Literal数组。
     * @param ast - ast parameter (`LiteralArray`) / 抽象语法树参数（`LiteralArray`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visitLiteralArray(ast: LiteralArray, context) {
        return this.visitAll(ast.expressions, context);
    }

    /**
     * Executes `visitLiteralMap` to handle visit literal map.
     * @zh 执行 `visitLiteralMap`，用于访问Literal映射表。
     * @param ast - ast parameter (`LiteralMap`) / 抽象语法树参数（`LiteralMap`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visitLiteralMap(ast: LiteralMap, context) {
        const result: Record<string, unknown> = {};
        const keys = ast.keys;
        const values = this.visitAll(ast.values, context);

        for (let i = 0, length = keys.length; i < length; i++) {
            result[keys[i]] = values[i];
        }

        return result;
    }

    /**
     * Executes `visitLiteralPrimitive` to handle visit literal primitive.
     * @zh 执行 `visitLiteralPrimitive`，用于访问LiteralPrimitive。
     * @param ast - ast parameter (`LiteralPrimitive`) / 抽象语法树参数（`LiteralPrimitive`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visitLiteralPrimitive(ast: LiteralPrimitive, context) {
        return ast.value;
    }

    /**
     * Executes `visitMethodCall` to handle visit method call.
     * @zh 执行 `visitMethodCall`，用于访问方法调用。
     * @param ast - ast parameter (`MethodCall`) / 抽象语法树参数（`MethodCall`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visitMethodCall(ast: MethodCall, context) {
        const receiver = ast.receiver.visit(this, context);

        if (!isJsObject(receiver)) {
            throw new Error(`Parse ERROR: on visitMethodCall, invalid method receiver.`);
        }

        const method = receiver[ast.name];

        if (!util.isFunction(method)) {
            throw new Error(`Parse ERROR: on visitMethodCall, method ${ast.name} doesn't exist on receiver.`);
        }

        const args = this.visitAll(ast.args, context);
        return method.apply(receiver, args);
    }

    /**
     * Executes `visitPrefixNot` to handle visit prefix not.
     * @zh 执行 `visitPrefixNot`，用于访问前缀Not。
     * @param ast - ast parameter (`PrefixNot`) / 抽象语法树参数（`PrefixNot`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visitPrefixNot(ast: PrefixNot, context) {
        return ast.expression.visit(this, context);
    }

    /**
     * Executes `visitPropertyRead` to handle visit property read.
     * @zh 执行 `visitPropertyRead`，用于访问属性读取。
     * @param ast - ast parameter (`PropertyRead`) / 抽象语法树参数（`PropertyRead`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visitPropertyRead(ast: PropertyRead, context) {
        const receiver = ast.receiver.visit(this, context);

        if (!isJsObject(receiver)) {
            throw new Error(`Parse ERROR: on visitPropertyRead, invalid property receiver.`);
        }

        return receiver[ast.name];
    }

    /**
     * Executes `visitPropertyWrite` to handle visit property write.
     * @zh 执行 `visitPropertyWrite`，用于访问属性写入。
     * @param ast - ast parameter (`PropertyWrite`) / 抽象语法树参数（`PropertyWrite`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visitPropertyWrite(ast: PropertyWrite, context) {
        const receiver = ast.receiver.visit(this, context);

        if (!isJsObject(receiver)) {
            throw new Error(`Parse ERROR: on visitPropertyRead, invalid property receiver.`);
        }

        receiver[ast.name] = ast.value.visit(this, context);
        return null;
    }

    /**
     * Executes `visitSafePropertyRead` to handle visit safe property read.
     * @zh 执行 `visitSafePropertyRead`，用于访问安全属性读取。
     * @param ast - ast parameter (`SafePropertyRead`) / 抽象语法树参数（`SafePropertyRead`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visitSafePropertyRead(ast: SafePropertyRead, context) {
        const receiver = ast.receiver.visit(this, context);

        if (!isJsObject(receiver)) {
            throw new Error(`Parse ERROR: on visitSafePropertyRead, invalid property receiver.`);
        }

        return receiver[ast.name];
    }

    /**
     * Executes `visitSafeMethodCall` to handle visit safe method call.
     * @zh 执行 `visitSafeMethodCall`，用于访问安全方法调用。
     * @param ast - ast parameter (`SafeMethodCall`) / 抽象语法树参数（`SafeMethodCall`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visitSafeMethodCall(ast: SafeMethodCall, context) {
        const receiver = ast.receiver.visit(this, context);

        if (!isJsObject(receiver)) {
            throw new Error(`Parse ERROR: on visitSafeMethodCall, invalid method receiver.`);
        }

        const method = receiver[ast.name];

        if (!util.isFunction(method)) {
            throw new Error(`Parse ERROR: on visitSafeMethodCall, method ${ast.name} doesn't exist on receiver.`);
        }

        const args = this.visitAll(ast.args, context);
        return method.apply(receiver, args);
    }

    /**
     * Executes `visitAll` to handle visit all.
     * @zh 执行 `visitAll`，用于访问全部。
     * @param asts - asts parameter (`AST[]`) / 抽象语法树参数（`AST[]`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visitAll(asts: AST[], context) {
        return asts.map(ast => ast.visit(this, context));
    }

    /**
     * Executes `visitQuote` to handle visit quote.
     * @zh 执行 `visitQuote`，用于访问Quote。
     * @param ast - ast parameter (`Quote`) / 抽象语法树参数（`Quote`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visitQuote(ast: Quote, context) {
        throw new Error(`Parse ERROR: on visitQuote, quote expression not allowed.`);
    }
}