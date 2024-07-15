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

export class ParseVisitorCompiler extends RecursiveAstVisitor {

    override visitBinary(ast: Binary): any {
        const left = ast.left.visit(this);
        const right = ast.right.visit(this);

        return `${left} ${ast.operation} ${right}`;
    }

    // TODO
    override visitChain(ast: Chain): any {
        return compileToJSON(this.visitAll(ast.expressions));
    }

    override visitConditional(ast: Conditional): any {
        const condition = ast.condition.visit(this);
        const trueExp = ast.trueExp.visit(this);
        const falseExp = ast.falseExp.visit(this);

        return `${condition} ? ${trueExp} : ${falseExp}`;
    }

    override visitPipe(ast: BindingPipe): any {
        const pipe = ast.name;
        const args = this.visitAll(ast.args);
        const value = ast.exp.visit(this);
        args.unshift(value);

        return `pipesCache.get('${pipe}').transform.apply(null, ${compileToJSON(args)})`;
    }

    // TODO
    override visitFunctionCall(ast: FunctionCall): any {
        const target = ast.target.visit(this);
        const args = compileToJSON(this.visitAll(ast.args));

        return `${target}.apply(${target}, ${args})`;
    }

    override visitImplicitReceiver(ast: ImplicitReceiver): any {
        return `context`;
    }

    override visitInterpolation(ast: Interpolation): any {
        return this.visitAll(ast.expressions)[0];
    }

    override visitKeyedRead(ast: KeyedRead): any {
        const obj = ast.obj.visit(this);
        const key = ast.key.visit(this);

        return `${obj}[${key}]`;
    }

    override visitKeyedWrite(ast: KeyedWrite): any {
        return null;
    }

    override visitLiteralArray(ast: LiteralArray): any {
        return compileToJSON(this.visitAll(ast.expressions));
    }

    override visitLiteralMap(ast: LiteralMap): any {
        const result = {};
        const keys = ast.keys;
        const values = this.visitAll(ast.values);

        for (let i = 0, length = keys.length; i < length; i++) {
            result[keys[i]] = values[i];
        }

        return compileToJSON(result);
    }

    override visitLiteralPrimitive(ast: LiteralPrimitive): any {
        return typeof ast.value === 'string' ? `'${ast.value}'` : ast.value;
    }

    override visitMethodCall(ast: MethodCall): any {
        const methodName = ast.name;
        const receiver = ast.receiver.visit(this);
        const args = compileToJSON(this.visitAll(ast.args));

        return `${receiver}['${methodName}'].apply(${receiver}, ${args})`;
    }

    override visitPrefixNot(ast: PrefixNot): any {
        return ast.expression.visit(this);
    }

    override visitPropertyRead(ast: PropertyRead): any {
        const property = ast.name;
        const receiver = ast.receiver.visit(this);

        return `${receiver}['${property}']`;
    }

    override visitPropertyWrite(ast: PropertyWrite): any {
        return null;
    }

    override visitSafePropertyRead(ast: SafePropertyRead): any {
        const property = ast.name;
        const receiver = ast.receiver.visit(this);

        return `${receiver}['${property}']`;
    }

    override visitSafeMethodCall(ast: SafeMethodCall): any {
        const methodName = ast.name;
        const receiver = ast.receiver.visit(this);
        const args = compileToJSON(this.visitAll(ast.args));

        return `${receiver}['${methodName}'].apply(${receiver}, ${args})`;
    }

    override visitAll(asts: AST[]): any {
        return asts.map(ast => ast.visit(this));
    }

    override visitQuote(ast: Quote): any {
        return null;
    }
}