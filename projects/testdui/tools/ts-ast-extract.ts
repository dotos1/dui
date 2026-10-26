/**
 * @fileoverview Module `projects/testdui/tools/ts-ast-extract.ts` providing ts ast extract definitions and implementation.
 * @zh 模块文件 `projects/testdui/tools/ts-ast-extract.ts`，提供ts抽象语法树extract相关的定义与实现。
 */

import * as ts from 'typescript';

/**
 * Type alias `ApiExportKind` representing api export kind (`| 'component' | 'directive' | 'service' | 'pipe' | 'module' | 'class'...`).
 * @zh 类型别名 `ApiExportKind`，表示API接口导出种类（`| 'component' | 'directive' | 'service' | 'pipe' | 'module' | 'class'...`）。
 */
export type ApiExportKind =
  | 'component'
  | 'directive'
  | 'service'
  | 'pipe'
  | 'module'
  | 'class'
  | 'interface'
  | 'enum'
  | 'constant'
  | 'function'
  | 'type';

/**
 * Interface `ApiInput` defining the contract and properties for api input.
 * @zh 接口 `ApiInput`，定义API接口输入属性的数据结构契约与属性规范。
 */
export interface ApiInput {
  /**
   * Property `name` (`string`) storing name.
   * @zh 属性 `name`（类型：`string`），用于存储或配置名称。
   */
  name: string;
  /**
   * Property `alias` (`string`) storing alias.
   * @zh 属性 `alias`（类型：`string`），用于存储或配置alias。
   */
  alias?: string;
  /**
   * Property `type` (`string`) storing type.
   * @zh 属性 `type`（类型：`string`），用于存储或配置类型。
   */
  type: string;
  /**
   * Property `default` (`string`) storing default.
   * @zh 属性 `default`（类型：`string`），用于存储或配置默认。
   */
  default?: string;
  /**
   * Property `description` (`string | null`) storing description.
   * @zh 属性 `description`（类型：`string | null`），用于存储或配置描述。
   */
  description: string | null;
  /**
   * Property `descriptionZh` (`string | null`) storing description zh.
   * @zh 属性 `descriptionZh`（类型：`string | null`），用于存储或配置描述Zh。
   */
  descriptionZh: string | null;
}

/**
 * Interface `ApiOutput` defining the contract and properties for api output.
 * @zh 接口 `ApiOutput`，定义API接口输出事件的数据结构契约与属性规范。
 */
export interface ApiOutput {
  /**
   * Property `name` (`string`) storing name.
   * @zh 属性 `name`（类型：`string`），用于存储或配置名称。
   */
  name: string;
  /**
   * Property `type` (`string`) storing type.
   * @zh 属性 `type`（类型：`string`），用于存储或配置类型。
   */
  type: string;
  /**
   * Property `description` (`string | null`) storing description.
   * @zh 属性 `description`（类型：`string | null`），用于存储或配置描述。
   */
  description: string | null;
  /**
   * Property `descriptionZh` (`string | null`) storing description zh.
   * @zh 属性 `descriptionZh`（类型：`string | null`），用于存储或配置描述Zh。
   */
  descriptionZh: string | null;
}

/**
 * Interface `ApiMethod` defining the contract and properties for api method.
 * @zh 接口 `ApiMethod`，定义API接口方法的数据结构契约与属性规范。
 */
export interface ApiMethod {
  /**
   * Property `name` (`string`) storing name.
   * @zh 属性 `name`（类型：`string`），用于存储或配置名称。
   */
  name: string;
  /**
   * Property `params` (`Array<{ name: string; type: string }>`) storing params.
   * @zh 属性 `params`（类型：`Array<{ name: string; type: string }>`），用于存储或配置参数集合。
   */
  params: Array<{ name: string; type: string }>;
  /**
   * Property `returnType` (`string`) storing return type.
   * @zh 属性 `returnType`（类型：`string`），用于存储或配置return类型。
   */
  returnType: string;
  /**
   * Property `description` (`string | null`) storing description.
   * @zh 属性 `description`（类型：`string | null`），用于存储或配置描述。
   */
  description: string | null;
  /**
   * Property `descriptionZh` (`string | null`) storing description zh.
   * @zh 属性 `descriptionZh`（类型：`string | null`），用于存储或配置描述Zh。
   */
  descriptionZh: string | null;
}

/**
 * Interface `ApiProperty` defining the contract and properties for api property.
 * @zh 接口 `ApiProperty`，定义API接口属性的数据结构契约与属性规范。
 */
export interface ApiProperty {
  /**
   * Property `name` (`string`) storing name.
   * @zh 属性 `name`（类型：`string`），用于存储或配置名称。
   */
  name: string;
  /**
   * Property `type` (`string`) storing type.
   * @zh 属性 `type`（类型：`string`），用于存储或配置类型。
   */
  type: string;
  /**
   * Property `default` (`string`) storing default.
   * @zh 属性 `default`（类型：`string`），用于存储或配置默认。
   */
  default?: string;
  /**
   * Property `description` (`string | null`) storing description.
   * @zh 属性 `description`（类型：`string | null`），用于存储或配置描述。
   */
  description: string | null;
  /**
   * Property `descriptionZh` (`string | null`) storing description zh.
   * @zh 属性 `descriptionZh`（类型：`string | null`），用于存储或配置描述Zh。
   */
  descriptionZh: string | null;
}

/**
 * Interface `ApiExport` defining the contract and properties for api export.
 * @zh 接口 `ApiExport`，定义API接口导出的数据结构契约与属性规范。
 */
export interface ApiExport {
  /**
   * Property `name` (`string`) storing name.
   * @zh 属性 `name`（类型：`string`），用于存储或配置名称。
   */
  name: string;
  /**
   * Property `kind` (`ApiExportKind`) storing kind.
   * @zh 属性 `kind`（类型：`ApiExportKind`），用于存储或配置种类。
   */
  kind: ApiExportKind;
  /**
   * Property `selector` (`string`) storing selector.
   * @zh 属性 `selector`（类型：`string`），用于存储或配置选择器。
   */
  selector?: string;
  /**
   * Property `pipeName` (`string`) storing pipe name.
   * @zh 属性 `pipeName`（类型：`string`），用于存储或配置管道名称。
   */
  pipeName?: string;
  /**
   * Property `summary` (`string | null`) storing summary.
   * @zh 属性 `summary`（类型：`string | null`），用于存储或配置汇总。
   */
  summary: string | null;
  /**
   * Property `summaryZh` (`string | null`) storing summary zh.
   * @zh 属性 `summaryZh`（类型：`string | null`），用于存储或配置汇总Zh。
   */
  summaryZh: string | null;
  /**
   * Property `inputs` (`ApiInput[]`) storing inputs.
   * @zh 属性 `inputs`（类型：`ApiInput[]`），用于存储或配置输入属性。
   */
  inputs: ApiInput[];
  /**
   * Property `outputs` (`ApiOutput[]`) storing outputs.
   * @zh 属性 `outputs`（类型：`ApiOutput[]`），用于存储或配置输出事件。
   */
  outputs: ApiOutput[];
  /**
   * Property `methods` (`ApiMethod[]`) storing methods.
   * @zh 属性 `methods`（类型：`ApiMethod[]`），用于存储或配置方法。
   */
  methods: ApiMethod[];
  /**
   * Property `properties` (`ApiProperty[]`) storing properties.
   * @zh 属性 `properties`（类型：`ApiProperty[]`），用于存储或配置属性列表。
   */
  properties: ApiProperty[];
  /**
   * Property `sourceFile` (`string`) storing source file.
   * @zh 属性 `sourceFile`（类型：`string`），用于存储或配置源文件。
   */
  sourceFile: string;
}

/**
 * Constant/variable `LIFECYCLE_METHOD_NAMES` defining lifecycle method names in `projects/testdui/tools`.
 * @zh 常量/变量 `LIFECYCLE_METHOD_NAMES`，定义 `projects/testdui/tools` 中的LIFECYCLE方法名称列表。
 */
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

/**
 * Executes `commentText` to handle comment text.
 * @zh 执行 `commentText`，用于comment文本。
 * @param comment - comment parameter (`string | ts.NodeArray<ts.JSDocComment> | undefined`) / comment参数（`string | ts.NodeArray<ts.JSDocComment> | undefined`）
 * @returns Result of type `string | null` / 类型为 `string | null` 的返回值
 */
function commentText(comment: string | ts.NodeArray<ts.JSDocComment> | undefined): string | null {
  const text = typeof comment === 'string' ? comment : comment ? ts.getTextOfJSDocComment(comment) : undefined;
  const trimmed = text?.trim();
  return trimmed || null;
}

/**
 * Extracts the main (English) JSDoc description for a node.
 * @zh 执行 `getJsDocDescription`，用于获取Js文档描述。
 */
function getJsDocDescription(node: ts.Node): string | null {
  const jsDocs = ts.getJSDocCommentsAndTags(node);
  for (const doc of jsDocs) {
    if (ts.isJSDoc(doc) && doc.comment) {
      const text = commentText(doc.comment);
      if (text) return text;
    }
  }
  return null;
}

/**
 * Extracts the `@zh` custom JSDoc tag (Chinese translation of the description), if present.
 * @zh 执行 `getJsDocZhDescription`，用于获取Js文档Zh描述。
 */
function getJsDocZhDescription(node: ts.Node): string | null {
  const jsDocs = ts.getJSDocCommentsAndTags(node);
  for (const doc of jsDocs) {
    if (ts.isJSDocUnknownTag(doc) && doc.tagName?.text === 'zh') {
      const text = commentText(doc.comment);
      if (text) return text;
    }
    if (ts.isJSDoc(doc) && doc.tags) {
      for (const tag of doc.tags) {
        if (ts.isJSDocUnknownTag(tag) && tag.tagName?.text === 'zh') {
          const text = commentText(tag.comment);
          if (text) return text;
        }
      }
    }
  }
  return null;
}

/**
 * Executes `getDecorator` to handle get decorator.
 * @zh 执行 `getDecorator`，用于获取Decorator。
 * @param node - node parameter (`ts.HasDecorators | undefined`) / 节点参数（`ts.HasDecorators | undefined`）
 * @param name - name parameter (`string`) / 名称参数（`string`）
 * @returns Result of type `ts.Decorator | undefined` / 类型为 `ts.Decorator | undefined` 的返回值
 */
function getDecorator(node: ts.HasDecorators | undefined, name: string): ts.Decorator | undefined {
  if (!node) return undefined;
  const decorators = ts.getDecorators?.(node as ts.Node & ts.HasDecorators);
  return decorators?.find((d) => {
    const expr = d.expression;
    const callee = ts.isCallExpression(expr) ? expr.expression : expr;
    return ts.isIdentifier(callee) && callee.text === name;
  });
}

/**
 * Executes `getDecoratorArgObject` to handle get decorator arg object.
 * @zh 执行 `getDecoratorArgObject`，用于获取Decorator参数对象。
 * @param decorator - decorator parameter (`ts.Decorator | undefined`) / decorator参数（`ts.Decorator | undefined`）
 * @returns Result of type `ts.ObjectLiteralExpression | undefined` / 类型为 `ts.ObjectLiteralExpression | undefined` 的返回值
 */
function getDecoratorArgObject(decorator: ts.Decorator | undefined): ts.ObjectLiteralExpression | undefined {
  if (!decorator || !ts.isCallExpression(decorator.expression)) return undefined;
  const arg = decorator.expression.arguments[0];
  return arg && ts.isObjectLiteralExpression(arg) ? arg : undefined;
}

/**
 * Executes `getStringProp` to handle get string prop.
 * @zh 执行 `getStringProp`，用于获取字符串属性。
 * @param obj - obj parameter (`ts.ObjectLiteralExpression | undefined`) / 对象参数（`ts.ObjectLiteralExpression | undefined`）
 * @param key - key parameter (`string`) / 键参数（`string`）
 * @returns Result of type `string | undefined` / 类型为 `string | undefined` 的返回值
 */
function getStringProp(obj: ts.ObjectLiteralExpression | undefined, key: string): string | undefined {
  if (!obj) return undefined;
  const prop = obj.properties.find(
    (p): p is ts.PropertyAssignment => ts.isPropertyAssignment(p) && p.name.getText() === key
  );
  if (!prop) return undefined;
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

/**
 * Executes `getDecoratorFirstArgText` to handle get decorator first arg text.
 * @zh 执行 `getDecoratorFirstArgText`，用于获取Decorator首个参数文本。
 * @param decorator - decorator parameter (`ts.Decorator | undefined`) / decorator参数（`ts.Decorator | undefined`）
 * @returns Result of type `string | undefined` / 类型为 `string | undefined` 的返回值
 */
function getDecoratorFirstArgText(decorator: ts.Decorator | undefined): string | undefined {
  if (!decorator || !ts.isCallExpression(decorator.expression)) return undefined;
  const arg = decorator.expression.arguments[0];
  if (!arg) return undefined;
  if (ts.isStringLiteralLike(arg)) return arg.text;
  return undefined;
}

/**
 * Executes `printType` to handle print type.
 * @zh 执行 `printType`，用于打印类型。
 * @param node - node parameter (`ts.TypeNode | undefined`) / 节点参数（`ts.TypeNode | undefined`）
 * @returns Result of type `string` / 类型为 `string` 的返回值
 */
function printType(node: ts.TypeNode | undefined): string {
  if (!node) return 'any';
  return node.getText().replace(/\s+/g, ' ').trim();
}

/**
 * Executes `unwrapEventEmitterType` to handle unwrap event emitter type.
 * @zh 执行 `unwrapEventEmitterType`，用于解包事件发射器类型。
 * @param node - node parameter (`ts.TypeNode | undefined`) / 节点参数（`ts.TypeNode | undefined`）
 * @returns Result of type `string` / 类型为 `string` 的返回值
 */
function unwrapEventEmitterType(node: ts.TypeNode | undefined): string {
  if (
    node &&
    ts.isTypeReferenceNode(node) &&
    (node.typeName.getText() === 'EventEmitter' ||
      node.typeName.getText() === 'OutputEmitterRef' ||
      node.typeName.getText() === 'InputSignal' ||
      node.typeName.getText() === 'ModelSignal')
  ) {
    const typeArg = node.typeArguments?.[0];
    return typeArg ? printType(typeArg) : 'void';
  }
  return printType(node);
}

/**
 * Detects whether a class property initializer is an Angular signal-based input/model/output call.
 * @zh 检测类属性初始化表达式是否为 Angular 信号输入（`input`/`model`）或输出（`output`/`outputFromObservable`）调用。
 * @param member - member parameter (`ts.ClassElement`) / 成员参数（`ts.ClassElement`）
 * @returns Result of type `'input' | 'output' | null` / 类型为 `'input' | 'output' | null` 的返回值
 */
function detectSignalMemberKind(member: ts.ClassElement): 'input' | 'output' | null {
  if (!ts.isPropertyDeclaration(member) || !member.initializer || !ts.isCallExpression(member.initializer)) {
    return null;
  }
  const callee = member.initializer.expression;
  if (ts.isIdentifier(callee)) {
    if (callee.text === 'input' || callee.text === 'model') return 'input';
    if (callee.text === 'output' || callee.text === 'outputFromObservable') return 'output';
  } else if (ts.isPropertyAccessExpression(callee) && ts.isIdentifier(callee.expression)) {
    if ((callee.expression.text === 'input' || callee.expression.text === 'model') && callee.name.text === 'required') {
      return 'input';
    }
  }
  return null;
}

/**
 * Executes `classifyMember` to handle classify member.
 * @zh 执行 `classifyMember`，用于classify成员。
 * @param member - member parameter (`ts.ClassElement`) / 成员参数（`ts.ClassElement`）
 * @returns Result of type `{ kind: 'input' | 'output' | 'method' | 'property'; decorato...` / 类型为 `{ kind: 'input' | 'output' | 'method' | 'property'; decorato...` 的返回值
 */
function classifyMember(
  member: ts.ClassElement
): { kind: 'input' | 'output' | 'method' | 'property'; decorator?: ts.Decorator } | null {
  if (!ts.canHaveModifiers(member)) return null;
  const modifiers = ts.getModifiers(member);
  const isPrivateOrProtected = modifiers?.some(
    (m) => m.kind === ts.SyntaxKind.PrivateKeyword || m.kind === ts.SyntaxKind.ProtectedKeyword
  );
  if (isPrivateOrProtected) return null;

  const inputDecorator = getDecorator(member as any, 'Input');
  if (inputDecorator) return { kind: 'input', decorator: inputDecorator };

  const outputDecorator = getDecorator(member as any, 'Output');
  if (outputDecorator) return { kind: 'output', decorator: outputDecorator };

  const signalKind = detectSignalMemberKind(member);
  if (signalKind) return { kind: signalKind };

  if (ts.isMethodDeclaration(member) && member.name) {
    const name = member.name.getText();
    if (LIFECYCLE_METHOD_NAMES.has(name) || name.startsWith('_') || name.startsWith('ng')) {
      return null;
    }
    return { kind: 'method' };
  }

  if ((ts.isPropertyDeclaration(member) || ts.isGetAccessorDeclaration(member) || ts.isSetAccessorDeclaration(member)) && member.name) {
    const name = member.name.getText();
    if (name.startsWith('_')) return null;
    return { kind: 'property' };
  }

  return null;
}

/**
 * Executes `extractInput` to handle extract input.
 * @zh 执行 `extractInput`，用于extract输入属性。
 * @param member - member parameter (`ts.ClassElement`) / 成员参数（`ts.ClassElement`）
 * @param decorator - decorator parameter (`ts.Decorator | undefined`) / decorator参数（`ts.Decorator | undefined`）
 * @returns Result of type `ApiInput | null` / 类型为 `ApiInput | null` 的返回值
 */
function extractInput(member: ts.ClassElement, decorator?: ts.Decorator): ApiInput | null {
  if (!(ts.isPropertyDeclaration(member) || ts.isGetAccessorDeclaration(member) || ts.isSetAccessorDeclaration(member)) || !member.name) {
    return null;
  }
  const name = member.name.getText();
  if (!decorator && ts.isPropertyDeclaration(member) && member.initializer && ts.isCallExpression(member.initializer)) {
    const callExpr = member.initializer;
    const typeArg = callExpr.typeArguments?.[0];
    const typeText = typeArg ? printType(typeArg) : unwrapEventEmitterType(member.type);
    const isRequired =
      ts.isPropertyAccessExpression(callExpr.expression) && callExpr.expression.name.text === 'required';
    const firstArg = callExpr.arguments[0];
    const secondArg = callExpr.arguments[1];
    const optionsArg = isRequired
      ? firstArg && ts.isObjectLiteralExpression(firstArg)
        ? firstArg
        : undefined
      : secondArg && ts.isObjectLiteralExpression(secondArg)
      ? secondArg
      : undefined;
    const alias = getStringProp(optionsArg, 'alias');
    const defaultText = !isRequired && firstArg ? firstArg.getText() : undefined;
    return {
      name,
      alias: alias && alias !== name ? alias : undefined,
      type: typeText,
      default: defaultText,
      description: getJsDocDescription(member),
      descriptionZh: getJsDocZhDescription(member),
    };
  }
  const alias = getDecoratorFirstArgText(decorator);
  const typeNode = ts.isPropertyDeclaration(member)
    ? member.type
    : ts.isSetAccessorDeclaration(member)
    ? member.parameters[0]?.type
    : (member as ts.GetAccessorDeclaration).type;
  const defaultText =
    ts.isPropertyDeclaration(member) && member.initializer ? member.initializer.getText() : undefined;
  return {
    name,
    alias: alias && alias !== name ? alias : undefined,
    type: printType(typeNode),
    default: defaultText,
    description: getJsDocDescription(member),
    descriptionZh: getJsDocZhDescription(member),
  };
}

/**
 * Executes `extractOutput` to handle extract output.
 * @zh 执行 `extractOutput`，用于extract输出事件。
 * @param member - member parameter (`ts.ClassElement`) / 成员参数（`ts.ClassElement`）
 * @returns Result of type `ApiOutput | null` / 类型为 `ApiOutput | null` 的返回值
 */
function extractOutput(member: ts.ClassElement): ApiOutput | null {
  if (!ts.isPropertyDeclaration(member) || !member.name) return null;
  let typeText = unwrapEventEmitterType(member.type);
  if (!member.type && member.initializer && ts.isCallExpression(member.initializer)) {
    const typeArg = member.initializer.typeArguments?.[0];
    typeText = typeArg ? printType(typeArg) : 'void';
  }
  return {
    name: member.name.getText(),
    type: typeText,
    description: getJsDocDescription(member),
    descriptionZh: getJsDocZhDescription(member),
  };
}

/**
 * Executes `extractMethod` to handle extract method.
 * @zh 执行 `extractMethod`，用于extract方法。
 * @param member - member parameter (`ts.ClassElement`) / 成员参数（`ts.ClassElement`）
 * @returns Result of type `ApiMethod | null` / 类型为 `ApiMethod | null` 的返回值
 */
function extractMethod(member: ts.ClassElement): ApiMethod | null {
  if (!ts.isMethodDeclaration(member) || !member.name) return null;
  return {
    name: member.name.getText(),
    params: member.parameters.map((p) => ({ name: p.name.getText(), type: printType(p.type) })),
    returnType: printType(member.type),
    description: getJsDocDescription(member),
    descriptionZh: getJsDocZhDescription(member),
  };
}

/**
 * Executes `extractProperty` to handle extract property.
 * @zh 执行 `extractProperty`，用于extract属性。
 * @param member - member parameter (`ts.ClassElement`) / 成员参数（`ts.ClassElement`）
 * @returns Result of type `ApiProperty | null` / 类型为 `ApiProperty | null` 的返回值
 */
function extractProperty(member: ts.ClassElement): ApiProperty | null {
  if (!member.name) return null;
  const name = member.name.getText();
  const typeNode = ts.isPropertyDeclaration(member)
    ? member.type
    : ts.isGetAccessorDeclaration(member)
    ? member.type
    : undefined;
  const defaultText =
    ts.isPropertyDeclaration(member) && member.initializer ? member.initializer.getText() : undefined;
  return {
    name,
    type: printType(typeNode),
    default: defaultText,
    description: getJsDocDescription(member),
    descriptionZh: getJsDocZhDescription(member),
  };
}

/**
 * Executes `extractClassMembers` to handle extract class members.
 * @zh 执行 `extractClassMembers`，用于extract类名成员列表。
 * @param classDecl - class decl parameter (`ts.ClassDeclaration`) / 类名Decl参数（`ts.ClassDeclaration`）
 */
function extractClassMembers(classDecl: ts.ClassDeclaration) {
  const inputs: ApiInput[] = [];
  const outputs: ApiOutput[] = [];
  const methods: ApiMethod[] = [];
  const properties: ApiProperty[] = [];

  for (const member of classDecl.members) {
    const classification = classifyMember(member);
    if (!classification) continue;
    try {
      if (classification.kind === 'input') {
        const input = extractInput(member, classification.decorator);
        if (input) inputs.push(input);
      } else if (classification.kind === 'output') {
        const output = extractOutput(member);
        if (output) outputs.push(output);
      } else if (classification.kind === 'method') {
        const method = extractMethod(member);
        if (method) methods.push(method);
      } else if (classification.kind === 'property') {
        const prop = extractProperty(member);
        if (prop) properties.push(prop);
      }
    } catch {
      // Defensive: a single malformed member should never abort the whole extraction.
    }
  }

  return { inputs, outputs, methods, properties };
}

/**
 * Executes `relativeSourceFile` to handle relative source file.
 * @zh 执行 `relativeSourceFile`，用于relative源文件。
 * @param sourceFile - source file parameter (`ts.SourceFile`) / 源文件参数（`ts.SourceFile`）
 * @param repoRoot - repo root parameter (`string`) / repo根节点参数（`string`）
 * @returns Result of type `string` / 类型为 `string` 的返回值
 */
function relativeSourceFile(sourceFile: ts.SourceFile, repoRoot: string): string {
  return sourceFile.fileName.startsWith(repoRoot)
    ? sourceFile.fileName.slice(repoRoot.length).replace(/^\/+/, '')
    : sourceFile.fileName;
}

/**
 * Resolves an exported symbol (possibly an alias created by `export * from`/`export { X }`)
 * down to its real declaration, classifies it, and extracts API metadata.
 * Returns null for symbols that don't correspond to something worth documenting
 * (e.g. re-exported third-party types with no local declaration).

 * @zh 执行 `extractExport`，用于extract导出。
 */
export function extractExport(
  symbol: ts.Symbol,
  checker: ts.TypeChecker,
  repoRoot: string
): ApiExport | null {
  let resolved = symbol;
  if (resolved.flags & ts.SymbolFlags.Alias) {
    resolved = checker.getAliasedSymbol(resolved);
  }

  const decl = resolved.valueDeclaration ?? resolved.declarations?.[0];
  if (!decl) return null;

  const sourceFile = decl.getSourceFile();
  if (!sourceFile.fileName.includes('/src/')) return null;

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
    const summaryZh = getJsDocZhDescription(decl);

    if (componentDecorator) {
      const selector = getStringProp(getDecoratorArgObject(componentDecorator), 'selector');
      return { name, kind: 'component', selector, summary, summaryZh, sourceFile: sourceFileRel, ...members };
    }
    if (directiveDecorator) {
      const selector = getStringProp(getDecoratorArgObject(directiveDecorator), 'selector');
      return { name, kind: 'directive', selector, summary, summaryZh, sourceFile: sourceFileRel, ...members };
    }
    if (pipeDecorator) {
      const pipeName = getStringProp(getDecoratorArgObject(pipeDecorator), 'name');
      return { name, kind: 'pipe', pipeName, summary, summaryZh, sourceFile: sourceFileRel, ...members };
    }
    if (ngModuleDecorator) {
      return { name, kind: 'module', summary, summaryZh, sourceFile: sourceFileRel, ...members };
    }
    const kind: ApiExportKind = injectableDecorator || name.endsWith('Service') ? 'service' : 'class';
    return { name, kind, summary, summaryZh, sourceFile: sourceFileRel, ...members };
  }

  if (ts.isInterfaceDeclaration(decl)) {
    const properties: ApiProperty[] = [];
    const methods: ApiMethod[] = [];
    for (const member of decl.members) {
      if (ts.isPropertySignature(member) && member.name) {
        properties.push({
          name: member.name.getText(),
          type: printType(member.type),
          description: getJsDocDescription(member),
          descriptionZh: getJsDocZhDescription(member),
        });
      } else if (ts.isMethodSignature(member) && member.name) {
        methods.push({
          name: member.name.getText(),
          params: member.parameters.map((p) => ({ name: p.name.getText(), type: printType(p.type) })),
          returnType: printType(member.type),
          description: getJsDocDescription(member),
          descriptionZh: getJsDocZhDescription(member),
        });
      }
    }
    return {
      name,
      kind: 'interface',
      summary: getJsDocDescription(decl),
      summaryZh: getJsDocZhDescription(decl),
      sourceFile: sourceFileRel,
      inputs: [],
      outputs: [],
      methods,
      properties,
    };
  }

  if (ts.isEnumDeclaration(decl)) {
    const properties: ApiProperty[] = decl.members.map((m) => ({
      name: m.name.getText(),
      type: 'enum-member',
      default: m.initializer ? m.initializer.getText() : undefined,
      description: getJsDocDescription(m),
      descriptionZh: getJsDocZhDescription(m),
    }));
    return {
      name,
      kind: 'enum',
      summary: getJsDocDescription(decl),
      summaryZh: getJsDocZhDescription(decl),
      sourceFile: sourceFileRel,
      inputs: [],
      outputs: [],
      methods: [],
      properties,
    };
  }

  if (ts.isTypeAliasDeclaration(decl)) {
    return {
      name,
      kind: 'type',
      summary: getJsDocDescription(decl),
      summaryZh: getJsDocZhDescription(decl),
      sourceFile: sourceFileRel,
      inputs: [],
      outputs: [],
      methods: [],
      properties: [],
    };
  }

  if (ts.isFunctionDeclaration(decl)) {
    const methods: ApiMethod[] = [
      {
        name,
        params: decl.parameters.map((p) => ({ name: p.name.getText(), type: printType(p.type) })),
        returnType: printType(decl.type),
        description: getJsDocDescription(decl),
        descriptionZh: getJsDocZhDescription(decl),
      },
    ];
    return {
      name,
      kind: 'function',
      summary: getJsDocDescription(decl),
      summaryZh: getJsDocZhDescription(decl),
      sourceFile: sourceFileRel,
      inputs: [],
      outputs: [],
      methods,
      properties: [],
    };
  }

  if (ts.isVariableDeclaration(decl)) {
    const declStatement = decl.parent?.parent;
    return {
      name,
      kind: 'constant',
      summary: declStatement ? getJsDocDescription(declStatement) : null,
      summaryZh: declStatement ? getJsDocZhDescription(declStatement) : null,
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
    summaryZh: null,
    sourceFile: sourceFileRel,
    inputs: [],
    outputs: [],
    methods: [],
    properties: [],
  };
}

/**
 * Executes `buildSuggestedUsageSnippet` to handle build suggested usage snippet.
 * @zh 执行 `buildSuggestedUsageSnippet`，用于构建SuggestedUsageSnippet。
 * @param importPath - import path parameter (`string`) / 导入路径参数（`string`）
 * @param exports - exports parameter (`ApiExport[]`) / 导出列表参数（`ApiExport[]`）
 * @returns Result of type `string` / 类型为 `string` 的返回值
 */
export function buildSuggestedUsageSnippet(importPath: string, exports: ApiExport[]): string {
  const component = exports.find((e) => e.kind === 'component' && e.selector);
  const moduleExport = exports.find((e) => e.kind === 'module');
  const importedNames = [component?.name, moduleExport?.name].filter(Boolean).join(', ');

  const lines: string[] = [];
  if (importedNames) {
    lines.push(`import { ${importedNames} } from '${importPath}';`);
  } else {
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
