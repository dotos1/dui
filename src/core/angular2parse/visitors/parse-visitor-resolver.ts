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
     * Checks whether a property key targets prototype chain internals.
     * @zh 检查属性键名是否指向危险原型链内部属性。
     * @param key - key parameter (`unknown`) / 属性键参数（`unknown`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    private static isUnsafeKey(key: unknown): boolean {
        const k = String(key);
        return k === '__proto__' || k === 'constructor' || k === 'prototype';
    }

    /**
     * Checks whether a runtime value is an unsafe global or dynamic code-execution target.
     * @zh 检查运行时目标值是否为受限全局对象或动态执行入口。
     * @param val - val parameter (`unknown`) / 运行时值参数（`unknown`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    private static isUnsafeTarget(val: unknown): boolean {
        if (val === Function || val === eval) {
            return true;
        }
        if (typeof globalThis !== 'undefined' && val === globalThis) {
            return true;
        }
        if (typeof window !== 'undefined' && val === window) {
            return true;
        }
        if (typeof document !== 'undefined' && val === document) {
            return true;
        }
        return false;
    }

    /**
     * Asserts that `key` is safe for property access or mutation.
     * @zh 断言属性键安全可访问，阻断原型污染键。
     * @param key - key parameter (`unknown`) / 属性键参数（`unknown`）
     * @returns Result of type `string` / 类型为 `string` 的返回值
     */
    private static assertSafeKey(key: unknown): string {
        const k = String(key);
        if (ParseVisitorResolver.isUnsafeKey(k)) {
            throw new Error(`Parse ERROR: unsafe property "${k}" is forbidden.`);
        }
        return k;
    }

    /**
     * Creates an instance of `ParseVisitorResolver` and initializes its dependencies and internal state.
     * @zh 创建 `ParseVisitorResolver` 实例，并初始化其依赖项与内部状态。
     * @param pipes - Injected or initial pipes (`any`) / 注入或传入的管道（`any`）
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
        if (ast.operation === '&&') {
            const left: unknown = ast.left.visit(this, context);
            return left ? ast.right.visit(this, context) : left;
        }
        if (ast.operation === '||') {
            const left: unknown = ast.left.visit(this, context);
            return left ? left : ast.right.visit(this, context);
        }

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
     * @returns Result of type `any[]` / 类型为 `any[]` 的返回值
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

        return pipe.transform.apply(pipe, pipeArgs);
    }

    // TODO
    /**
     * Executes `visitFunctionCall` to handle visit function call.
     * @zh 执行 `visitFunctionCall`，用于访问函数调用。
     * @param ast - ast parameter (`FunctionCall`) / 抽象语法树参数（`FunctionCall`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `unknown` / 类型为 `unknown` 的返回值
     */
    override visitFunctionCall(ast: FunctionCall, context) {
        const target = ast.target.visit(this, context);

        if (ParseVisitorResolver.isUnsafeTarget(target)) {
            throw new Error(`Parse ERROR: on visitFunctionCall, unsafe function target is forbidden.`);
        }

        if (!util.isFunction(target)) {
            throw new Error(`Parse ERROR: on visitFunctionCall, target is not a function.`);
        }

        const args = this.visitAll(ast.args, context);
        const res: unknown = target.apply(target, args);
        if (ParseVisitorResolver.isUnsafeTarget(res)) {
            throw new Error(`Parse ERROR: unsafe return target is forbidden.`);
        }
        return res;
    }

    /**
     * Executes `visitImplicitReceiver` to handle visit implicit receiver.
     * @zh 执行 `visitImplicitReceiver`，用于访问ImplicitReceiver。
     * @param ast - ast parameter (`ImplicitReceiver`) / 抽象语法树参数（`ImplicitReceiver`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visitImplicitReceiver(ast: ImplicitReceiver, context) {
        if (ParseVisitorResolver.isUnsafeTarget(context)) {
            throw new Error(`Parse ERROR: unsafe implicit receiver is forbidden.`);
        }
        return context;
    }

    /**
     * Executes `visitInterpolation` to handle visit interpolation.
     * @zh 执行 `visitInterpolation`，用于访问Interpolation。
     * @param ast - ast parameter (`Interpolation`) / 抽象语法树参数（`Interpolation`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `unknown` / 类型为 `unknown` 的返回值
     */
    override visitInterpolation(ast: Interpolation, context) {
        const values: unknown[] = this.visitAll(ast.expressions, context);
        const strs: string[] = Array.isArray(ast.strings) ? ast.strings : [];
        if (values.length === 1 && strs.every((s: string) => s === '')) {
            return values[0];
        }
        let result = strs[0] ?? '';
        for (let i = 0; i < values.length; i++) {
            const v: unknown = values[i];
            result += (v === null || v === undefined ? '' : String(v)) + (strs[i + 1] ?? '');
        }
        return result;
    }

    /**
     * Executes `visitKeyedRead` to handle visit keyed read.
     * @zh 执行 `visitKeyedRead`，用于访问已键读取。
     * @param ast - ast parameter (`KeyedRead`) / 抽象语法树参数（`KeyedRead`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `unknown` / 类型为 `unknown` 的返回值
     */
    override visitKeyedRead(ast: KeyedRead, context) {
        const obj = ast.obj.visit(this, context);
        const key = ParseVisitorResolver.assertSafeKey(ast.key.visit(this, context));
        if (obj === null || obj === undefined || ParseVisitorResolver.isUnsafeTarget(obj)) {
            throw new Error(`Parse ERROR: on visitKeyedRead, invalid keyed receiver.`);
        }
        const val: unknown = obj[key];
        if (ParseVisitorResolver.isUnsafeTarget(val)) {
            throw new Error(`Parse ERROR: unsafe keyed property target is forbidden.`);
        }
        return val;
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
        const key = ParseVisitorResolver.assertSafeKey(ast.key.visit(this, context));
        if (!isJsObject(obj) || ParseVisitorResolver.isUnsafeTarget(obj)) {
            throw new Error(`Parse ERROR: on visitKeyedWrite, invalid keyed receiver.`);
        }
        const value = ast.value.visit(this, context);
        obj[key] = value;
        return null;
    }

    /**
     * Executes `visitLiteralArray` to handle visit literal array.
     * @zh 执行 `visitLiteralArray`，用于访问Literal数组。
     * @param ast - ast parameter (`LiteralArray`) / 抽象语法树参数（`LiteralArray`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any[]` / 类型为 `any[]` 的返回值
     */
    override visitLiteralArray(ast: LiteralArray, context) {
        return this.visitAll(ast.expressions, context);
    }

    /**
     * Executes `visitLiteralMap` to handle visit literal map.
     * @zh 执行 `visitLiteralMap`，用于访问Literal映射表。
     * @param ast - ast parameter (`LiteralMap`) / 抽象语法树参数（`LiteralMap`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `Record<string, unknown>` / 类型为 `Record<string, unknown>` 的返回值
     */
    override visitLiteralMap(ast: LiteralMap, context) {
        const result: Record<string, unknown> = {};
        const keys = ast.keys;
        const values = this.visitAll(ast.values, context);

        for (let i = 0, length = keys.length; i < length; i++) {
            const safeKey = ParseVisitorResolver.assertSafeKey(keys[i]);
            result[safeKey] = values[i];
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
     * @returns Result of type `unknown` / 类型为 `unknown` 的返回值
     */
    override visitMethodCall(ast: MethodCall, context) {
        const methodName = ParseVisitorResolver.assertSafeKey(ast.name);
        const receiver = ast.receiver.visit(this, context);

        if (receiver === null || receiver === undefined || ParseVisitorResolver.isUnsafeTarget(receiver)) {
            throw new Error(`Parse ERROR: on visitMethodCall, invalid method receiver.`);
        }

        const method = receiver[methodName];

        if (ParseVisitorResolver.isUnsafeTarget(method) || !util.isFunction(method)) {
            throw new Error(`Parse ERROR: on visitMethodCall, method ${methodName} doesn't exist on receiver.`);
        }

        const args = this.visitAll(ast.args, context);
        const res: unknown = method.apply(receiver, args);
        if (ParseVisitorResolver.isUnsafeTarget(res)) {
            throw new Error(`Parse ERROR: unsafe return target is forbidden.`);
        }
        return res;
    }

    /**
     * Executes `visitPrefixNot` to handle visit prefix not.
     * @zh 执行 `visitPrefixNot`，用于访问前缀Not。
     * @param ast - ast parameter (`PrefixNot`) / 抽象语法树参数（`PrefixNot`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    override visitPrefixNot(ast: PrefixNot, context) {
        return !ast.expression.visit(this, context);
    }

    /**
     * Executes `visitPropertyRead` to handle visit property read.
     * @zh 执行 `visitPropertyRead`，用于访问属性读取。
     * @param ast - ast parameter (`PropertyRead`) / 抽象语法树参数（`PropertyRead`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `unknown` / 类型为 `unknown` 的返回值
     */
    override visitPropertyRead(ast: PropertyRead, context) {
        const propName = ParseVisitorResolver.assertSafeKey(ast.name);
        const receiver = ast.receiver.visit(this, context);

        if (receiver === null || receiver === undefined || ParseVisitorResolver.isUnsafeTarget(receiver)) {
            throw new Error(`Parse ERROR: on visitPropertyRead, invalid property receiver.`);
        }

        const val: unknown = receiver[propName];
        if (ParseVisitorResolver.isUnsafeTarget(val)) {
            throw new Error(`Parse ERROR: unsafe property target is forbidden.`);
        }
        return val;
    }

    /**
     * Executes `visitPropertyWrite` to handle visit property write.
     * @zh 执行 `visitPropertyWrite`，用于访问属性写入。
     * @param ast - ast parameter (`PropertyWrite`) / 抽象语法树参数（`PropertyWrite`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visitPropertyWrite(ast: PropertyWrite, context) {
        const propName = ParseVisitorResolver.assertSafeKey(ast.name);
        const receiver = ast.receiver.visit(this, context);

        if (!isJsObject(receiver) || ParseVisitorResolver.isUnsafeTarget(receiver)) {
            throw new Error(`Parse ERROR: on visitPropertyRead, invalid property receiver.`);
        }

        receiver[propName] = ast.value.visit(this, context);
        return null;
    }

    /**
     * Executes `visitSafePropertyRead` to handle visit safe property read.
     * @zh 执行 `visitSafePropertyRead`，用于访问安全属性读取。
     * @param ast - ast parameter (`SafePropertyRead`) / 抽象语法树参数（`SafePropertyRead`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `unknown` / 类型为 `unknown` 的返回值
     */
    override visitSafePropertyRead(ast: SafePropertyRead, context) {
        const propName = ParseVisitorResolver.assertSafeKey(ast.name);
        const receiver = ast.receiver.visit(this, context);

        if (receiver === null || receiver === undefined) {
            return undefined;
        }
        if (ParseVisitorResolver.isUnsafeTarget(receiver)) {
            throw new Error(`Parse ERROR: on visitSafePropertyRead, invalid property receiver.`);
        }

        const val: unknown = receiver[propName];
        if (ParseVisitorResolver.isUnsafeTarget(val)) {
            throw new Error(`Parse ERROR: unsafe property target is forbidden.`);
        }
        return val;
    }

    /**
     * Executes `visitSafeMethodCall` to handle visit safe method call.
     * @zh 执行 `visitSafeMethodCall`，用于访问安全方法调用。
     * @param ast - ast parameter (`SafeMethodCall`) / 抽象语法树参数（`SafeMethodCall`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `unknown` / 类型为 `unknown` 的返回值
     */
    override visitSafeMethodCall(ast: SafeMethodCall, context) {
        const methodName = ParseVisitorResolver.assertSafeKey(ast.name);
        const receiver = ast.receiver.visit(this, context);

        if (receiver === null || receiver === undefined) {
            return undefined;
        }
        if (ParseVisitorResolver.isUnsafeTarget(receiver)) {
            throw new Error(`Parse ERROR: on visitSafeMethodCall, invalid method receiver.`);
        }

        const method = receiver[methodName];

        if (ParseVisitorResolver.isUnsafeTarget(method) || !util.isFunction(method)) {
            throw new Error(`Parse ERROR: on visitSafeMethodCall, method ${methodName} doesn't exist on receiver.`);
        }

        const args = this.visitAll(ast.args, context);
        const res: unknown = method.apply(receiver, args);
        if (ParseVisitorResolver.isUnsafeTarget(res)) {
            throw new Error(`Parse ERROR: unsafe return target is forbidden.`);
        }
        return res;
    }

    /**
     * Executes `visitAll` to handle visit all.
     * @zh 执行 `visitAll`，用于访问全部。
     * @param asts - asts parameter (`AST[]`) / 抽象语法树参数（`AST[]`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `any[]` / 类型为 `any[]` 的返回值
     */
    override visitAll(asts: AST[], context) {
        return asts.map(ast => ast.visit(this, context));
    }

    /**
     * Executes `visitQuote` to handle visit quote.
     * @zh 执行 `visitQuote`，用于访问Quote。
     * @param ast - ast parameter (`Quote`) / 抽象语法树参数（`Quote`）
     * @param context - context parameter (`any`) / 上下文参数（`any`）
     * @returns Result of type `void` / 类型为 `void` 的返回值
     */
    override visitQuote(ast: Quote, context) {
        throw new Error(`Parse ERROR: on visitQuote, quote expression not allowed.`);
    }
}