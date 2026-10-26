/**
 * @fileoverview Module `src/core/angular2parse/visitors/parse-visitor-compiler.ts` providing parse visitor compiler definitions and implementation.
 * @zh 模块文件 `src/core/angular2parse/visitors/parse-visitor-compiler.ts`，提供解析访问器compiler相关的定义与实现。
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
    Quote
} from '../angular';
import { compileToJSON } from '../util';

/**
 * Class `ParseVisitorCompiler` encapsulating parse visitor compiler data structures and logic in `src/core/angular2parse/visitors`.
 * @zh 类 `ParseVisitorCompiler`，封装 `src/core/angular2parse/visitors` 中的解析访问器Compiler数据结构与处理逻辑。
 */
export class ParseVisitorCompiler extends RecursiveAstVisitor {

    /**
     * Executes `visitBinary` to handle visit binary.
     * @zh 执行 `visitBinary`，用于访问Binary。
     * @param ast - ast parameter (`Binary`) / 抽象语法树参数（`Binary`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visitBinary(ast: Binary) {
        const left = ast.left.visit(this);
        const right = ast.right.visit(this);

        return `${left} ${ast.operation} ${right}`;
    }

    // TODO
    /**
     * Executes `visitChain` to handle visit chain.
     * @zh 执行 `visitChain`，用于访问Chain。
     * @param ast - ast parameter (`Chain`) / 抽象语法树参数（`Chain`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visitChain(ast: Chain) {
        return compileToJSON(this.visitAll(ast.expressions));
    }

    /**
     * Executes `visitConditional` to handle visit conditional.
     * @zh 执行 `visitConditional`，用于访问Conditional。
     * @param ast - ast parameter (`Conditional`) / 抽象语法树参数（`Conditional`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visitConditional(ast: Conditional) {
        const condition = ast.condition.visit(this);
        const trueExp = ast.trueExp.visit(this);
        const falseExp = ast.falseExp.visit(this);

        return `${condition} ? ${trueExp} : ${falseExp}`;
    }

    /**
     * Executes `visitPipe` to handle visit pipe.
     * @zh 执行 `visitPipe`，用于访问管道。
     * @param ast - ast parameter (`BindingPipe`) / 抽象语法树参数（`BindingPipe`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visitPipe(ast: BindingPipe) {
        const pipe = ast.name;
        const args = this.visitAll(ast.args);
        const value = ast.exp.visit(this);
        args.unshift(value);

        return `pipesCache.get('${pipe}').transform.apply(null, ${compileToJSON(args)})`;
    }

    // TODO
    /**
     * Executes `visitFunctionCall` to handle visit function call.
     * @zh 执行 `visitFunctionCall`，用于访问函数调用。
     * @param ast - ast parameter (`FunctionCall`) / 抽象语法树参数（`FunctionCall`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visitFunctionCall(ast: FunctionCall) {
        const target = ast.target.visit(this);
        const args = compileToJSON(this.visitAll(ast.args));

        return `${target}.apply(${target}, ${args})`;
    }

    /**
     * Executes `visitImplicitReceiver` to handle visit implicit receiver.
     * @zh 执行 `visitImplicitReceiver`，用于访问ImplicitReceiver。
     * @param ast - ast parameter (`ImplicitReceiver`) / 抽象语法树参数（`ImplicitReceiver`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visitImplicitReceiver(ast: ImplicitReceiver) {
        return `context`;
    }

    /**
     * Executes `visitInterpolation` to handle visit interpolation.
     * @zh 执行 `visitInterpolation`，用于访问Interpolation。
     * @param ast - ast parameter (`Interpolation`) / 抽象语法树参数（`Interpolation`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visitInterpolation(ast: Interpolation) {
        return this.visitAll(ast.expressions)[0];
    }

    /**
     * Executes `visitKeyedRead` to handle visit keyed read.
     * @zh 执行 `visitKeyedRead`，用于访问已键读取。
     * @param ast - ast parameter (`KeyedRead`) / 抽象语法树参数（`KeyedRead`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visitKeyedRead(ast: KeyedRead) {
        const obj = ast.obj.visit(this);
        const key = ast.key.visit(this);

        return `${obj}[${key}]`;
    }

    /**
     * Executes `visitKeyedWrite` to handle visit keyed write.
     * @zh 执行 `visitKeyedWrite`，用于访问已键写入。
     * @param ast - ast parameter (`KeyedWrite`) / 抽象语法树参数（`KeyedWrite`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visitKeyedWrite(ast: KeyedWrite) {
        return null;
    }

    /**
     * Executes `visitLiteralArray` to handle visit literal array.
     * @zh 执行 `visitLiteralArray`，用于访问Literal数组。
     * @param ast - ast parameter (`LiteralArray`) / 抽象语法树参数（`LiteralArray`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visitLiteralArray(ast: LiteralArray) {
        return compileToJSON(this.visitAll(ast.expressions));
    }

    /**
     * Executes `visitLiteralMap` to handle visit literal map.
     * @zh 执行 `visitLiteralMap`，用于访问Literal映射表。
     * @param ast - ast parameter (`LiteralMap`) / 抽象语法树参数（`LiteralMap`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visitLiteralMap(ast: LiteralMap) {
        const result = {};
        const keys = ast.keys;
        const values = this.visitAll(ast.values);

        for (let i = 0, length = keys.length; i < length; i++) {
            result[keys[i]] = values[i];
        }

        return compileToJSON(result);
    }

    /**
     * Executes `visitLiteralPrimitive` to handle visit literal primitive.
     * @zh 执行 `visitLiteralPrimitive`，用于访问LiteralPrimitive。
     * @param ast - ast parameter (`LiteralPrimitive`) / 抽象语法树参数（`LiteralPrimitive`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visitLiteralPrimitive(ast: LiteralPrimitive) {
        return typeof ast.value === 'string' ? `'${ast.value}'` : ast.value;
    }

    /**
     * Executes `visitMethodCall` to handle visit method call.
     * @zh 执行 `visitMethodCall`，用于访问方法调用。
     * @param ast - ast parameter (`MethodCall`) / 抽象语法树参数（`MethodCall`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visitMethodCall(ast: MethodCall) {
        const methodName = ast.name;
        const receiver = ast.receiver.visit(this);
        const args = compileToJSON(this.visitAll(ast.args));

        return `${receiver}['${methodName}'].apply(${receiver}, ${args})`;
    }

    /**
     * Executes `visitPrefixNot` to handle visit prefix not.
     * @zh 执行 `visitPrefixNot`，用于访问前缀Not。
     * @param ast - ast parameter (`PrefixNot`) / 抽象语法树参数（`PrefixNot`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visitPrefixNot(ast: PrefixNot) {
        return ast.expression.visit(this);
    }

    /**
     * Executes `visitPropertyRead` to handle visit property read.
     * @zh 执行 `visitPropertyRead`，用于访问属性读取。
     * @param ast - ast parameter (`PropertyRead`) / 抽象语法树参数（`PropertyRead`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visitPropertyRead(ast: PropertyRead) {
        const property = ast.name;
        const receiver = ast.receiver.visit(this);

        return `${receiver}['${property}']`;
    }

    /**
     * Executes `visitPropertyWrite` to handle visit property write.
     * @zh 执行 `visitPropertyWrite`，用于访问属性写入。
     * @param ast - ast parameter (`PropertyWrite`) / 抽象语法树参数（`PropertyWrite`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visitPropertyWrite(ast: PropertyWrite) {
        return null;
    }

    /**
     * Executes `visitSafePropertyRead` to handle visit safe property read.
     * @zh 执行 `visitSafePropertyRead`，用于访问安全属性读取。
     * @param ast - ast parameter (`SafePropertyRead`) / 抽象语法树参数（`SafePropertyRead`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visitSafePropertyRead(ast: SafePropertyRead) {
        const property = ast.name;
        const receiver = ast.receiver.visit(this);

        return `${receiver}['${property}']`;
    }

    /**
     * Executes `visitSafeMethodCall` to handle visit safe method call.
     * @zh 执行 `visitSafeMethodCall`，用于访问安全方法调用。
     * @param ast - ast parameter (`SafeMethodCall`) / 抽象语法树参数（`SafeMethodCall`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visitSafeMethodCall(ast: SafeMethodCall) {
        const methodName = ast.name;
        const receiver = ast.receiver.visit(this);
        const args = compileToJSON(this.visitAll(ast.args));

        return `${receiver}['${methodName}'].apply(${receiver}, ${args})`;
    }

    /**
     * Executes `visitAll` to handle visit all.
     * @zh 执行 `visitAll`，用于访问全部。
     * @param asts - asts parameter (`AST[]`) / 抽象语法树参数（`AST[]`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visitAll(asts: AST[]) {
        return asts.map(ast => ast.visit(this));
    }

    /**
     * Executes `visitQuote` to handle visit quote.
     * @zh 执行 `visitQuote`，用于访问Quote。
     * @param ast - ast parameter (`Quote`) / 抽象语法树参数（`Quote`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    override visitQuote(ast: Quote) {
        return null;
    }
}