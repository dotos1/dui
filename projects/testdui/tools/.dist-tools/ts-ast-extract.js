"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractExport = extractExport;
exports.buildSuggestedUsageSnippet = buildSuggestedUsageSnippet;
const ts = require("typescript");
const LIFECYCLE_METHOD_NAMES = new Set([
    'ngOnInit',
    'ngOnChanges',
    'ngDoCheck',
    'ngAfterContentInit',
    'ngAfterContentChecked',
    'ngAfterViewInit',
    'ngAfterViewChecked',
    'ngOnDestroy',
    'writeValue',
    'registerOnChange',
    'registerOnTouched',
    'setDisabledState',
    'constructor',
]);
function getJsDocDescription(node) {
    const jsDocs = ts.getJSDocCommentsAndTags(node);
    for (const doc of jsDocs) {
        if (ts.isJSDoc(doc) && doc.comment) {
            const text = typeof doc.comment === 'string' ? doc.comment : ts.getTextOfJSDocComment(doc.comment);
            const trimmed = text?.trim();
            if (trimmed) {
                return trimmed;
            }
        }
    }
    return null;
}
function getDecorator(node, name) {
    if (!node)
        return undefined;
    const decorators = ts.getDecorators?.(node);
    return decorators?.find((d) => {
        const expr = d.expression;
        const callee = ts.isCallExpression(expr) ? expr.expression : expr;
        return ts.isIdentifier(callee) && callee.text === name;
    });
}
function getDecoratorArgObject(decorator) {
    if (!decorator || !ts.isCallExpression(decorator.expression))
        return undefined;
    const arg = decorator.expression.arguments[0];
    return arg && ts.isObjectLiteralExpression(arg) ? arg : undefined;
}
function getStringProp(obj, key) {
    if (!obj)
        return undefined;
    const prop = obj.properties.find((p) => ts.isPropertyAssignment(p) && p.name.getText() === key);
    if (!prop)
        return undefined;
    const init = prop.initializer;
    if (ts.isStringLiteralLike(init)) {
        return init.text;
    }
    if (ts.isArrayLiteralExpression(init)) {
        return init.elements
            .filter(ts.isStringLiteralLike)
            .map((e) => e.text)
            .join(', ');
    }
    return undefined;
}
function getDecoratorFirstArgText(decorator) {
    if (!decorator || !ts.isCallExpression(decorator.expression))
        return undefined;
    const arg = decorator.expression.arguments[0];
    if (!arg)
        return undefined;
    if (ts.isStringLiteralLike(arg))
        return arg.text;
    return undefined;
}
function printType(node) {
    if (!node)
        return 'any';
    return node.getText().replace(/\s+/g, ' ').trim();
}
function unwrapEventEmitterType(node) {
    if (node && ts.isTypeReferenceNode(node) && node.typeName.getText() === 'EventEmitter') {
        const typeArg = node.typeArguments?.[0];
        return typeArg ? printType(typeArg) : 'void';
    }
    return printType(node);
}
function classifyMember(member) {
    if (!ts.canHaveModifiers(member))
        return null;
    const modifiers = ts.getModifiers(member);
    const isPrivateOrProtected = modifiers?.some((m) => m.kind === ts.SyntaxKind.PrivateKeyword || m.kind === ts.SyntaxKind.ProtectedKeyword);
    if (isPrivateOrProtected)
        return null;
    const inputDecorator = getDecorator(member, 'Input');
    if (inputDecorator)
        return { kind: 'input', decorator: inputDecorator };
    const outputDecorator = getDecorator(member, 'Output');
    if (outputDecorator)
        return { kind: 'output', decorator: outputDecorator };
    if (ts.isMethodDeclaration(member) && member.name) {
        const name = member.name.getText();
        if (LIFECYCLE_METHOD_NAMES.has(name) || name.startsWith('_') || name.startsWith('ng')) {
            return null;
        }
        return { kind: 'method' };
    }
    if ((ts.isPropertyDeclaration(member) || ts.isGetAccessorDeclaration(member) || ts.isSetAccessorDeclaration(member)) && member.name) {
        const name = member.name.getText();
        if (name.startsWith('_'))
            return null;
        return { kind: 'property' };
    }
    return null;
}
function extractInput(member, decorator) {
    if (!(ts.isPropertyDeclaration(member) || ts.isGetAccessorDeclaration(member) || ts.isSetAccessorDeclaration(member)) || !member.name) {
        return null;
    }
    const name = member.name.getText();
    const alias = getDecoratorFirstArgText(decorator);
    const typeNode = ts.isPropertyDeclaration(member)
        ? member.type
        : ts.isSetAccessorDeclaration(member)
            ? member.parameters[0]?.type
            : member.type;
    const defaultText = ts.isPropertyDeclaration(member) && member.initializer ? member.initializer.getText() : undefined;
    return {
        name,
        alias: alias && alias !== name ? alias : undefined,
        type: printType(typeNode),
        default: defaultText,
        description: getJsDocDescription(member),
    };
}
function extractOutput(member) {
    if (!ts.isPropertyDeclaration(member) || !member.name)
        return null;
    return {
        name: member.name.getText(),
        type: unwrapEventEmitterType(member.type),
        description: getJsDocDescription(member),
    };
}
function extractMethod(member) {
    if (!ts.isMethodDeclaration(member) || !member.name)
        return null;
    return {
        name: member.name.getText(),
        params: member.parameters.map((p) => ({ name: p.name.getText(), type: printType(p.type) })),
        returnType: printType(member.type),
        description: getJsDocDescription(member),
    };
}
function extractProperty(member) {
    if (!member.name)
        return null;
    const name = member.name.getText();
    const typeNode = ts.isPropertyDeclaration(member)
        ? member.type
        : ts.isGetAccessorDeclaration(member)
            ? member.type
            : undefined;
    const defaultText = ts.isPropertyDeclaration(member) && member.initializer ? member.initializer.getText() : undefined;
    return {
        name,
        type: printType(typeNode),
        default: defaultText,
        description: getJsDocDescription(member),
    };
}
function extractClassMembers(classDecl) {
    const inputs = [];
    const outputs = [];
    const methods = [];
    const properties = [];
    for (const member of classDecl.members) {
        const classification = classifyMember(member);
        if (!classification)
            continue;
        try {
            if (classification.kind === 'input') {
                const input = extractInput(member, classification.decorator);
                if (input)
                    inputs.push(input);
            }
            else if (classification.kind === 'output') {
                const output = extractOutput(member);
                if (output)
                    outputs.push(output);
            }
            else if (classification.kind === 'method') {
                const method = extractMethod(member);
                if (method)
                    methods.push(method);
            }
            else if (classification.kind === 'property') {
                const prop = extractProperty(member);
                if (prop)
                    properties.push(prop);
            }
        }
        catch {
            // Defensive: a single malformed member should never abort the whole extraction.
        }
    }
    return { inputs, outputs, methods, properties };
}
function relativeSourceFile(sourceFile, repoRoot) {
    return sourceFile.fileName.startsWith(repoRoot)
        ? sourceFile.fileName.slice(repoRoot.length).replace(/^\/+/, '')
        : sourceFile.fileName;
}
/**
 * Resolves an exported symbol (possibly an alias created by `export * from`/`export { X }`)
 * down to its real declaration, classifies it, and extracts API metadata.
 * Returns null for symbols that don't correspond to something worth documenting
 * (e.g. re-exported third-party types with no local declaration).
 */
function extractExport(symbol, checker, repoRoot) {
    let resolved = symbol;
    if (resolved.flags & ts.SymbolFlags.Alias) {
        resolved = checker.getAliasedSymbol(resolved);
    }
    const decl = resolved.valueDeclaration ?? resolved.declarations?.[0];
    if (!decl)
        return null;
    const sourceFile = decl.getSourceFile();
    if (!sourceFile.fileName.includes('/src/'))
        return null;
    const name = resolved.getName();
    const sourceFileRel = relativeSourceFile(sourceFile, repoRoot);
    if (ts.isClassDeclaration(decl)) {
        const componentDecorator = getDecorator(decl, 'Component');
        const directiveDecorator = getDecorator(decl, 'Directive');
        const pipeDecorator = getDecorator(decl, 'Pipe');
        const ngModuleDecorator = getDecorator(decl, 'NgModule');
        const injectableDecorator = getDecorator(decl, 'Injectable');
        const members = extractClassMembers(decl);
        const summary = getJsDocDescription(decl);
        if (componentDecorator) {
            const selector = getStringProp(getDecoratorArgObject(componentDecorator), 'selector');
            return { name, kind: 'component', selector, summary, sourceFile: sourceFileRel, ...members };
        }
        if (directiveDecorator) {
            const selector = getStringProp(getDecoratorArgObject(directiveDecorator), 'selector');
            return { name, kind: 'directive', selector, summary, sourceFile: sourceFileRel, ...members };
        }
        if (pipeDecorator) {
            const pipeName = getStringProp(getDecoratorArgObject(pipeDecorator), 'name');
            return { name, kind: 'pipe', pipeName, summary, sourceFile: sourceFileRel, ...members };
        }
        if (ngModuleDecorator) {
            return { name, kind: 'module', summary, sourceFile: sourceFileRel, ...members };
        }
        const kind = injectableDecorator || name.endsWith('Service') ? 'service' : 'class';
        return { name, kind, summary, sourceFile: sourceFileRel, ...members };
    }
    if (ts.isInterfaceDeclaration(decl)) {
        return {
            name,
            kind: 'interface',
            summary: getJsDocDescription(decl),
            sourceFile: sourceFileRel,
            inputs: [],
            outputs: [],
            methods: [],
            properties: [],
        };
    }
    if (ts.isEnumDeclaration(decl)) {
        return {
            name,
            kind: 'enum',
            summary: getJsDocDescription(decl),
            sourceFile: sourceFileRel,
            inputs: [],
            outputs: [],
            methods: [],
            properties: [],
        };
    }
    if (ts.isTypeAliasDeclaration(decl)) {
        return {
            name,
            kind: 'type',
            summary: getJsDocDescription(decl),
            sourceFile: sourceFileRel,
            inputs: [],
            outputs: [],
            methods: [],
            properties: [],
        };
    }
    if (ts.isFunctionDeclaration(decl)) {
        return {
            name,
            kind: 'function',
            summary: getJsDocDescription(decl),
            sourceFile: sourceFileRel,
            inputs: [],
            outputs: [],
            methods: [],
            properties: [],
        };
    }
    if (ts.isVariableDeclaration(decl)) {
        const declStatement = decl.parent?.parent;
        return {
            name,
            kind: 'constant',
            summary: declStatement ? getJsDocDescription(declStatement) : null,
            sourceFile: sourceFileRel,
            inputs: [],
            outputs: [],
            methods: [],
            properties: [],
        };
    }
    // Fallback: still report it as a bare "class" style record so nothing silently disappears.
    return {
        name,
        kind: 'class',
        summary: null,
        sourceFile: sourceFileRel,
        inputs: [],
        outputs: [],
        methods: [],
        properties: [],
    };
}
function buildSuggestedUsageSnippet(importPath, exports) {
    const component = exports.find((e) => e.kind === 'component' && e.selector);
    const moduleExport = exports.find((e) => e.kind === 'module');
    const importedNames = [component?.name, moduleExport?.name].filter(Boolean).join(', ');
    const lines = [];
    if (importedNames) {
        lines.push(`import { ${importedNames} } from '${importPath}';`);
    }
    else {
        lines.push(`import { /* ... */ } from '${importPath}';`);
    }
    if (component?.selector) {
        lines.push('');
        const inputsAttrs = component.inputs
            .slice(0, 3)
            .map((i) => `[${i.alias ?? i.name}]="..."`)
            .join(' ');
        const outputsAttrs = component.outputs
            .slice(0, 2)
            .map((o) => `(${o.name})="..."`)
            .join(' ');
        const attrs = [inputsAttrs, outputsAttrs].filter(Boolean).join(' ');
        lines.push(`<${component.selector}${attrs ? ' ' + attrs : ''}></${component.selector}>`);
    }
    return lines.join('\n');
}
