/**
 * @fileoverview Safe, zero-eval recursive-descent expression & function-body parser/evaluator (`src/base/safe-expr.ts`).
 * Replaces dynamic code generation across DUI to guarantee CSP (`script-src 'self'` without `'unsafe-eval'`)
 * compliance while blocking prototype pollution (`__proto__`, `constructor`, `prototype`) and global escapes.
 * @zh 模块文件 `src/base/safe-expr.ts`，提供零动态代码生成的安全递归下降表达式与多语句函数体解析求值器，满足严格 CSP 策略并阻断原型链污染与全局对象逃逸。
 */

const BLOCKED_KEYS: ReadonlySet<string> = new Set<string>([
  '__proto__',
  'constructor',
  'prototype',
]);

const BLOCKED_GLOBALS: ReadonlySet<string> = new Set<string>([
  'window',
  'document',
  'globalThis',
  'self',
  'top',
  'parent',
  'frames',
  'Function',
  'eval',
  'setTimeout',
  'setInterval',
  'setImmediate',
  'Reflect',
  'Proxy',
  'process',
  'require',
  'importScripts',
]);

const BLOCKED_OBJECT_METHODS: ReadonlySet<string> = new Set<string>([
  'setPrototypeOf',
  'defineProperty',
  'defineProperties',
  '__defineGetter__',
  '__defineSetter__',
  '__lookupGetter__',
  '__lookupSetter__',
]);

const SAFE_BUILTINS: Readonly<Record<string, unknown>> = Object.freeze({
  Math,
  Number,
  String,
  Boolean,
  Array,
  Object,
  Date,
  JSON,
  parseInt,
  parseFloat,
  isNaN,
  isFinite,
  encodeURI,
  decodeURI,
  encodeURIComponent,
  decodeURIComponent,
});

const SAFE_CONSTRUCTORS: ReadonlySet<unknown> = new Set<unknown>([
  Date,
  Array,
  Object,
  Map,
  Set,
  Error,
]);

function isUnsafePropertyKey(key: unknown): boolean {
  const k = String(key);
  return BLOCKED_KEYS.has(k);
}

function isGlobalObject(val: unknown): boolean {
  if (val === null || val === undefined) {
    return false;
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

function isBlockedCallableOrTarget(val: unknown): boolean {
  if (val === Function || val === eval) {
    return true;
  }
  if (typeof setTimeout !== 'undefined' && val === setTimeout) {
    return true;
  }
  if (typeof setInterval !== 'undefined' && val === setInterval) {
    return true;
  }
  return isGlobalObject(val);
}

function assertSafeKey(key: unknown): string {
  const k = String(key);
  if (BLOCKED_KEYS.has(k)) {
    throw new Error(`Unsafe property access "${k}" is forbidden`);
  }
  return k;
}

function assertSafeValue(val: unknown): unknown {
  if (isBlockedCallableOrTarget(val)) {
    throw new Error('Unsafe runtime target access is forbidden');
  }
  return val;
}

function isObjectOrFunction(val: unknown): val is Record<string, unknown> {
  return (typeof val === 'object' && val !== null) || typeof val === 'function';
}

// ---------------------------------------------------------------------------
// Lexer
// ---------------------------------------------------------------------------

type TokenKind =
  | 'number'
  | 'string'
  | 'template'
  | 'ident'
  | 'punct'
  | 'op'
  | 'eof';

interface TemplatePart {
  isExpr: boolean;
  text: string;
}

interface Token {
  kind: TokenKind;
  value: string;
  numValue?: number;
  templateParts?: TemplatePart[];
  pos: number;
  hadNewlineBefore: boolean;
}

function isIdentStart(ch: number): boolean {
  return (
    (ch >= 65 && ch <= 90) || // A-Z
    (ch >= 97 && ch <= 122) || // a-z
    ch === 95 || // _
    ch === 36 || // $
    ch > 127
  );
}

function isIdentPart(ch: number): boolean {
  return isIdentStart(ch) || (ch >= 48 && ch <= 57);
}

function isDigit(ch: number): boolean {
  return ch >= 48 && ch <= 57;
}

function isHexDigit(ch: number): boolean {
  return (
    isDigit(ch) ||
    (ch >= 65 && ch <= 70) ||
    (ch >= 97 && ch <= 102)
  );
}

function readEscape(src: string, idx: number): { char: string; nextIdx: number } {
  if (idx >= src.length) {
    throw new SyntaxError('Unterminated escape sequence');
  }
  const ch = src[idx];
  switch (ch) {
    case 'n':
      return { char: '\n', nextIdx: idx + 1 };
    case 'r':
      return { char: '\r', nextIdx: idx + 1 };
    case 't':
      return { char: '\t', nextIdx: idx + 1 };
    case 'b':
      return { char: '\b', nextIdx: idx + 1 };
    case 'f':
      return { char: '\f', nextIdx: idx + 1 };
    case 'v':
      return { char: '\v', nextIdx: idx + 1 };
    case '0':
      return { char: '\0', nextIdx: idx + 1 };
    case '\\':
    case "'":
    case '"':
    case '`':
    case '$':
      return { char: ch, nextIdx: idx + 1 };
    case 'x': {
      const hex = src.slice(idx + 1, idx + 3);
      if (hex.length !== 2 || !/^[0-9a-fA-F]{2}$/.test(hex)) {
        throw new SyntaxError('Invalid hex escape sequence');
      }
      return { char: String.fromCharCode(parseInt(hex, 16)), nextIdx: idx + 3 };
    }
    case 'u': {
      if (src[idx + 1] === '{') {
        const close = src.indexOf('}', idx + 2);
        if (close === -1) {
          throw new SyntaxError('Unterminated unicode escape');
        }
        const hex = src.slice(idx + 2, close);
        if (!/^[0-9a-fA-F]+$/.test(hex)) {
          throw new SyntaxError('Invalid unicode codepoint escape');
        }
        return { char: String.fromCodePoint(parseInt(hex, 16)), nextIdx: close + 1 };
      }
      const hex = src.slice(idx + 1, idx + 5);
      if (hex.length !== 4 || !/^[0-9a-fA-F]{4}$/.test(hex)) {
        throw new SyntaxError('Invalid unicode escape sequence');
      }
      return { char: String.fromCharCode(parseInt(hex, 16)), nextIdx: idx + 5 };
    }
    default:
      return { char: ch, nextIdx: idx + 1 };
  }
}

function tokenize(src: string): Token[] {
  const tokens: Token[] = [];
  const len = src.length;
  let i = 0;
  let hadNewline = false;

  while (i < len) {
    const code = src.charCodeAt(i);
    // Whitespace
    if (code === 32 || code === 9 || code === 11 || code === 12 || code === 160) {
      i++;
      continue;
    }
    if (code === 10 || code === 13) {
      hadNewline = true;
      i++;
      continue;
    }
    // Single-line comment
    if (code === 47 && src.charCodeAt(i + 1) === 47) {
      i += 2;
      while (i < len && src.charCodeAt(i) !== 10 && src.charCodeAt(i) !== 13) {
        i++;
      }
      continue;
    }
    // Multi-line comment
    if (code === 47 && src.charCodeAt(i + 1) === 42) {
      i += 2;
      let closed = false;
      while (i < len) {
        if (src.charCodeAt(i) === 10 || src.charCodeAt(i) === 13) {
          hadNewline = true;
        }
        if (src.charCodeAt(i) === 42 && src.charCodeAt(i + 1) === 47) {
          i += 2;
          closed = true;
          break;
        }
        i++;
      }
      if (!closed) {
        throw new SyntaxError('Unterminated block comment');
      }
      continue;
    }

    const start = i;
    const nl = hadNewline;
    hadNewline = false;

    // Strings (' or ")
    if (code === 39 || code === 34) {
      const quote = src[i++];
      let out = '';
      let closed = false;
      while (i < len) {
        const ch = src[i];
        if (ch === quote) {
          i++;
          closed = true;
          break;
        }
        if (ch === '\n' || ch === '\r') {
          throw new SyntaxError('Unterminated string literal');
        }
        if (ch === '\\') {
          const esc = readEscape(src, i + 1);
          out += esc.char;
          i = esc.nextIdx;
        } else {
          out += ch;
          i++;
        }
      }
      if (!closed) {
        throw new SyntaxError('Unterminated string literal');
      }
      tokens.push({ kind: 'string', value: out, pos: start, hadNewlineBefore: nl });
      continue;
    }

    // Template literal (`...`)
    if (code === 96) {
      i++;
      const parts: TemplatePart[] = [];
      let buf = '';
      let closed = false;
      while (i < len) {
        const ch = src[i];
        if (ch === '`') {
          i++;
          closed = true;
          break;
        }
        if (ch === '\\') {
          const esc = readEscape(src, i + 1);
          buf += esc.char;
          i = esc.nextIdx;
        } else if (ch === '$' && src[i + 1] === '{') {
          if (buf.length > 0) {
            parts.push({ isExpr: false, text: buf });
            buf = '';
          }
          i += 2;
          let depth = 1;
          let exprStart = i;
          while (i < len && depth > 0) {
            const c = src[i];
            if (c === "'" || c === '"' || c === '`') {
              const q = c;
              i++;
              while (i < len && src[i] !== q) {
                if (src[i] === '\\') {
                  i += 2;
                } else {
                  i++;
                }
              }
              i++;
              continue;
            }
            if (c === '{') {
              depth++;
            } else if (c === '}') {
              depth--;
              if (depth === 0) {
                break;
              }
            }
            i++;
          }
          if (depth !== 0) {
            throw new SyntaxError('Unterminated template interpolation');
          }
          parts.push({ isExpr: true, text: src.slice(exprStart, i) });
          i++; // skip '}'
        } else {
          buf += ch;
          i++;
        }
      }
      if (!closed) {
        throw new SyntaxError('Unterminated template literal');
      }
      if (buf.length > 0 || parts.length === 0) {
        parts.push({ isExpr: false, text: buf });
      }
      tokens.push({
        kind: 'template',
        value: '',
        templateParts: parts,
        pos: start,
        hadNewlineBefore: nl,
      });
      continue;
    }

    // Numbers
    if (isDigit(code) || (code === 46 && isDigit(src.charCodeAt(i + 1)))) {
      if (code === 48 && (src[i + 1] === 'x' || src[i + 1] === 'X')) {
        i += 2;
        const hexStart = i;
        while (i < len && isHexDigit(src.charCodeAt(i))) {
          i++;
        }
        if (i === hexStart) {
          throw new SyntaxError('Invalid hexadecimal literal');
        }
        const rawHex = src.slice(start, i);
        tokens.push({
          kind: 'number',
          value: rawHex,
          numValue: parseInt(rawHex.slice(2), 16),
          pos: start,
          hadNewlineBefore: nl,
        });
        continue;
      }
      while (i < len && isDigit(src.charCodeAt(i))) {
        i++;
      }
      if (src[i] === '.') {
        i++;
        while (i < len && isDigit(src.charCodeAt(i))) {
          i++;
        }
      }
      if (src[i] === 'e' || src[i] === 'E') {
        i++;
        if (src[i] === '+' || src[i] === '-') {
          i++;
        }
        const expStart = i;
        while (i < len && isDigit(src.charCodeAt(i))) {
          i++;
        }
        if (i === expStart) {
          throw new SyntaxError('Invalid exponential number literal');
        }
      }
      const rawNum = src.slice(start, i);
      tokens.push({
        kind: 'number',
        value: rawNum,
        numValue: Number(rawNum),
        pos: start,
        hadNewlineBefore: nl,
      });
      continue;
    }

    // Identifiers / keywords
    if (isIdentStart(code)) {
      i++;
      while (i < len && isIdentPart(src.charCodeAt(i))) {
        i++;
      }
      tokens.push({
        kind: 'ident',
        value: src.slice(start, i),
        pos: start,
        hadNewlineBefore: nl,
      });
      continue;
    }

    // Multi-char operators & punctuation
    const three = src.slice(i, i + 3);
    if (three === '===' || three === '!==' || three === '...') {
      i += 3;
      tokens.push({
        kind: three === '...' ? 'punct' : 'op',
        value: three,
        pos: start,
        hadNewlineBefore: nl,
      });
      continue;
    }

    const two = src.slice(i, i + 2);
    if (two === '?.') {
      // Distinguish `a?.b` / `a?.[k]` / `a?.()` from `a ? .5 : 0`
      const after = src.charCodeAt(i + 2);
      if (!isDigit(after)) {
        i += 2;
        tokens.push({ kind: 'punct', value: '?.', pos: start, hadNewlineBefore: nl });
        continue;
      }
    }
    if (
      two === '==' ||
      two === '!=' ||
      two === '<=' ||
      two === '>=' ||
      two === '&&' ||
      two === '||' ||
      two === '??' ||
      two === '=>' ||
      two === '++' ||
      two === '--' ||
      two === '+=' ||
      two === '-=' ||
      two === '*=' ||
      two === '/=' ||
      two === '%=' ||
      two === '**'
    ) {
      i += 2;
      tokens.push({
        kind: two === '=>' ? 'punct' : 'op',
        value: two,
        pos: start,
        hadNewlineBefore: nl,
      });
      continue;
    }

    const one = src[i];
    if ('()[]{};:,.?'.includes(one)) {
      i++;
      tokens.push({ kind: 'punct', value: one, pos: start, hadNewlineBefore: nl });
      continue;
    }
    if ('+-*/%!<>=&|^~'.includes(one)) {
      i++;
      tokens.push({ kind: 'op', value: one, pos: start, hadNewlineBefore: nl });
      continue;
    }

    throw new SyntaxError(`Unexpected character "${one}" at position ${i}`);
  }

  tokens.push({ kind: 'eof', value: '', pos: len, hadNewlineBefore: hadNewline });
  return tokens;
}

// ---------------------------------------------------------------------------
// AST Definitions
// ---------------------------------------------------------------------------

interface ArrayElement {
  spread: boolean;
  expr: ExprNode;
}

interface ObjectProp {
  spread: boolean;
  computed: boolean;
  key?: string;
  keyExpr?: ExprNode;
  value: ExprNode;
}

type PostfixStep =
  | { kind: 'prop'; name: string; optional: boolean }
  | { kind: 'index'; index: ExprNode; optional: boolean }
  | { kind: 'call'; args: ArrayElement[]; optional: boolean };

type ExprNode =
  | { kind: 'literal'; value: unknown }
  | { kind: 'this' }
  | { kind: 'ident'; name: string }
  | { kind: 'template'; parts: Array<{ isExpr: boolean; text?: string; expr?: ExprNode }> }
  | { kind: 'array'; elements: ArrayElement[] }
  | { kind: 'object'; properties: ObjectProp[] }
  | { kind: 'chain'; base: ExprNode; steps: PostfixStep[]; hasOptional: boolean }
  | { kind: 'new'; callee: ExprNode; args: ArrayElement[] }
  | { kind: 'unary'; op: string; argument: ExprNode }
  | { kind: 'update'; op: '++' | '--'; prefix: boolean; argument: ExprNode }
  | { kind: 'binary'; op: string; left: ExprNode; right: ExprNode }
  | { kind: 'logical'; op: '&&' | '||' | '??'; left: ExprNode; right: ExprNode }
  | { kind: 'conditional'; test: ExprNode; consequent: ExprNode; alternate: ExprNode }
  | { kind: 'assign'; op: string; left: ExprNode; right: ExprNode }
  | { kind: 'arrow'; params: string[]; body: ExprNode | StmtNode[] };

interface VarDeclItem {
  name: string;
  init?: ExprNode;
}

type StmtNode =
  | { kind: 'empty' }
  | { kind: 'expr'; expr: ExprNode }
  | { kind: 'block'; body: StmtNode[] }
  | { kind: 'var'; declKind: 'const' | 'let' | 'var'; declarations: VarDeclItem[] }
  | { kind: 'if'; test: ExprNode; consequent: StmtNode; alternate?: StmtNode }
  | { kind: 'return'; argument?: ExprNode };

// ---------------------------------------------------------------------------
// Recursive-Descent Parser
// ---------------------------------------------------------------------------

const RESERVED_WORDS: ReadonlySet<string> = new Set<string>([
  'true',
  'false',
  'null',
  'undefined',
  'this',
  'if',
  'else',
  'return',
  'const',
  'let',
  'var',
  'typeof',
  'void',
  'in',
  'instanceof',
  'new',
  'function',
]);

class SafeParser {
  private readonly tokens: Token[];
  private pos: number = 0;

  constructor(src: string) {
    this.tokens = tokenize(src);
  }

  private peek(offset: number = 0): Token {
    const idx = this.pos + offset;
    return idx < this.tokens.length ? this.tokens[idx] : this.tokens[this.tokens.length - 1];
  }

  private next(): Token {
    const tok = this.peek(0);
    if (tok.kind !== 'eof') {
      this.pos++;
    }
    return tok;
  }

  private match(kind: TokenKind, value?: string): boolean {
    const tok = this.peek(0);
    if (tok.kind !== kind) {
      return false;
    }
    if (value !== undefined && tok.value !== value) {
      return false;
    }
    this.pos++;
    return true;
  }

  private expect(kind: TokenKind, value?: string): Token {
    const tok = this.peek(0);
    if (tok.kind !== kind || (value !== undefined && tok.value !== value)) {
      throw new SyntaxError(
        `Expected ${value ?? kind} but found "${tok.value || tok.kind}" at position ${tok.pos}`
      );
    }
    return this.next();
  }

  public parseSingleExpression(): ExprNode {
    const expr = this.parseExpression();
    // Allow optional trailing semicolon (legacy `return ${expression};`)
    while (this.match('punct', ';')) {
      // consume trailing ';'
    }
    if (this.peek().kind !== 'eof') {
      const tok = this.peek();
      throw new SyntaxError(`Unexpected token "${tok.value}" at position ${tok.pos}`);
    }
    return expr;
  }

  public parseProgram(): StmtNode[] {
    const body: StmtNode[] = [];
    while (this.peek().kind !== 'eof') {
      body.push(this.parseStatement());
    }
    return body;
  }

  private consumeSemicolonOrAutomaticEnd(): void {
    if (this.match('punct', ';')) {
      return;
    }
    const tok = this.peek();
    if (tok.kind === 'eof' || (tok.kind === 'punct' && tok.value === '}') || tok.hadNewlineBefore) {
      return;
    }
    throw new SyntaxError(`Expected ";" before "${tok.value}" at position ${tok.pos}`);
  }

  private parseStatement(): StmtNode {
    const tok = this.peek();
    if (tok.kind === 'punct' && tok.value === ';') {
      this.next();
      return { kind: 'empty' };
    }
    if (tok.kind === 'punct' && tok.value === '{') {
      return this.parseBlockStatement();
    }
    if (tok.kind === 'ident') {
      if (tok.value === 'if') {
        return this.parseIfStatement();
      }
      if (tok.value === 'return') {
        return this.parseReturnStatement();
      }
      if (tok.value === 'const' || tok.value === 'let' || tok.value === 'var') {
        return this.parseVarDeclaration(tok.value);
      }
    }
    const expr = this.parseExpression();
    this.consumeSemicolonOrAutomaticEnd();
    return { kind: 'expr', expr };
  }

  private parseBlockStatement(): StmtNode {
    this.expect('punct', '{');
    const body: StmtNode[] = [];
    while (this.peek().kind !== 'eof' && !(this.peek().kind === 'punct' && this.peek().value === '}')) {
      body.push(this.parseStatement());
    }
    this.expect('punct', '}');
    return { kind: 'block', body };
  }

  private parseIfStatement(): StmtNode {
    this.expect('ident', 'if');
    this.expect('punct', '(');
    const test = this.parseExpression();
    this.expect('punct', ')');
    const consequent = this.parseStatement();
    let alternate: StmtNode | undefined;
    if (this.peek().kind === 'ident' && this.peek().value === 'else') {
      this.next();
      alternate = this.parseStatement();
    }
    return { kind: 'if', test, consequent, alternate };
  }

  private parseReturnStatement(): StmtNode {
    this.expect('ident', 'return');
    const tok = this.peek();
    if (
      tok.kind === 'eof' ||
      (tok.kind === 'punct' && (tok.value === ';' || tok.value === '}')) ||
      tok.hadNewlineBefore
    ) {
      this.match('punct', ';');
      return { kind: 'return' };
    }
    const argument = this.parseExpression();
    this.consumeSemicolonOrAutomaticEnd();
    return { kind: 'return', argument };
  }

  private parseVarDeclaration(declKind: 'const' | 'let' | 'var'): StmtNode {
    this.next();
    const declarations: VarDeclItem[] = [];
    do {
      const idTok = this.expect('ident');
      if (RESERVED_WORDS.has(idTok.value) || BLOCKED_KEYS.has(idTok.value) || BLOCKED_GLOBALS.has(idTok.value)) {
        throw new SyntaxError(`Invalid variable identifier "${idTok.value}"`);
      }
      let init: ExprNode | undefined;
      if (this.match('op', '=')) {
        init = this.parseAssignment();
      } else if (declKind === 'const') {
        throw new SyntaxError(`Missing initializer in const declaration "${idTok.value}"`);
      }
      declarations.push({ name: idTok.value, init });
    } while (this.match('punct', ','));
    this.consumeSemicolonOrAutomaticEnd();
    return { kind: 'var', declKind, declarations };
  }

  public parseExpression(): ExprNode {
    return this.parseAssignment();
  }

  private tryParseArrowParams(): string[] | null {
    const saved = this.pos;
    // Single param: `x => ...`
    if (
      this.peek(0).kind === 'ident' &&
      !RESERVED_WORDS.has(this.peek(0).value) &&
      this.peek(1).kind === 'punct' &&
      this.peek(1).value === '=>' &&
      !this.peek(1).hadNewlineBefore
    ) {
      const param = this.next().value;
      this.next(); // '=>'
      if (BLOCKED_KEYS.has(param) || BLOCKED_GLOBALS.has(param)) {
        throw new SyntaxError(`Invalid arrow parameter "${param}"`);
      }
      return [param];
    }
    // Parenthesized params: `(a, b) => ...` or `() => ...`
    if (this.peek(0).kind === 'punct' && this.peek(0).value === '(') {
      this.next(); // '('
      const params: string[] = [];
      if (!(this.peek().kind === 'punct' && this.peek().value === ')')) {
        while (true) {
          const pTok = this.peek();
          if (pTok.kind !== 'ident' || RESERVED_WORDS.has(pTok.value)) {
            this.pos = saved;
            return null;
          }
          this.next();
          if (BLOCKED_KEYS.has(pTok.value) || BLOCKED_GLOBALS.has(pTok.value)) {
            throw new SyntaxError(`Invalid arrow parameter "${pTok.value}"`);
          }
          params.push(pTok.value);
          if (this.match('punct', ',')) {
            if (this.peek().kind === 'punct' && this.peek().value === ')') {
              break;
            }
            continue;
          }
          break;
        }
      }
      if (!this.match('punct', ')')) {
        this.pos = saved;
        return null;
      }
      if (this.peek().kind === 'punct' && this.peek().value === '=>' && !this.peek().hadNewlineBefore) {
        this.next(); // '=>'
        return params;
      }
      this.pos = saved;
      return null;
    }
    return null;
  }

  private parseAssignment(): ExprNode {
    const arrowParams = this.tryParseArrowParams();
    if (arrowParams !== null) {
      if (this.peek().kind === 'punct' && this.peek().value === '{') {
        const block = this.parseBlockStatement();
        return {
          kind: 'arrow',
          params: arrowParams,
          body: block.kind === 'block' ? block.body : [block],
        };
      }
      const bodyExpr = this.parseAssignment();
      return { kind: 'arrow', params: arrowParams, body: bodyExpr };
    }

    const left = this.parseConditional();
    const tok = this.peek();
    if (
      tok.kind === 'op' &&
      (tok.value === '=' ||
        tok.value === '+=' ||
        tok.value === '-=' ||
        tok.value === '*=' ||
        tok.value === '/=' ||
        tok.value === '%=')
    ) {
      this.next();
      const right = this.parseAssignment();
      return { kind: 'assign', op: tok.value, left, right };
    }
    return left;
  }

  private parseConditional(): ExprNode {
    const test = this.parseNullish();
    if (this.match('punct', '?')) {
      const consequent = this.parseAssignment();
      this.expect('punct', ':');
      const alternate = this.parseAssignment();
      return { kind: 'conditional', test, consequent, alternate };
    }
    return test;
  }

  private parseNullish(): ExprNode {
    let left = this.parseLogicalOr();
    while (this.peek().kind === 'op' && this.peek().value === '??') {
      this.next();
      const right = this.parseLogicalOr();
      left = { kind: 'logical', op: '??', left, right };
    }
    return left;
  }

  private parseLogicalOr(): ExprNode {
    let left = this.parseLogicalAnd();
    while (this.peek().kind === 'op' && this.peek().value === '||') {
      this.next();
      const right = this.parseLogicalAnd();
      left = { kind: 'logical', op: '||', left, right };
    }
    return left;
  }

  private parseLogicalAnd(): ExprNode {
    let left = this.parseBitwiseOr();
    while (this.peek().kind === 'op' && this.peek().value === '&&') {
      this.next();
      const right = this.parseBitwiseOr();
      left = { kind: 'logical', op: '&&', left, right };
    }
    return left;
  }

  private parseBitwiseOr(): ExprNode {
    let left = this.parseBitwiseXor();
    while (this.peek().kind === 'op' && this.peek().value === '|') {
      this.next();
      const right = this.parseBitwiseXor();
      left = { kind: 'binary', op: '|', left, right };
    }
    return left;
  }

  private parseBitwiseXor(): ExprNode {
    let left = this.parseBitwiseAnd();
    while (this.peek().kind === 'op' && this.peek().value === '^') {
      this.next();
      const right = this.parseBitwiseAnd();
      left = { kind: 'binary', op: '^', left, right };
    }
    return left;
  }

  private parseBitwiseAnd(): ExprNode {
    let left = this.parseEquality();
    while (this.peek().kind === 'op' && this.peek().value === '&') {
      this.next();
      const right = this.parseEquality();
      left = { kind: 'binary', op: '&', left, right };
    }
    return left;
  }

  private parseEquality(): ExprNode {
    let left = this.parseRelational();
    while (
      this.peek().kind === 'op' &&
      (this.peek().value === '==' ||
        this.peek().value === '!=' ||
        this.peek().value === '===' ||
        this.peek().value === '!==')
    ) {
      const op = this.next().value;
      const right = this.parseRelational();
      left = { kind: 'binary', op, left, right };
    }
    return left;
  }

  private parseRelational(): ExprNode {
    let left = this.parseAdditive();
    while (true) {
      const tok = this.peek();
      if (
        tok.kind === 'op' &&
        (tok.value === '<' || tok.value === '<=' || tok.value === '>' || tok.value === '>=')
      ) {
        const op = this.next().value;
        const right = this.parseAdditive();
        left = { kind: 'binary', op, left, right };
        continue;
      }
      if (tok.kind === 'ident' && (tok.value === 'in' || tok.value === 'instanceof')) {
        const op = this.next().value;
        const right = this.parseAdditive();
        left = { kind: 'binary', op, left, right };
        continue;
      }
      break;
    }
    return left;
  }

  private parseAdditive(): ExprNode {
    let left = this.parseMultiplicative();
    while (this.peek().kind === 'op' && (this.peek().value === '+' || this.peek().value === '-')) {
      const op = this.next().value;
      const right = this.parseMultiplicative();
      left = { kind: 'binary', op, left, right };
    }
    return left;
  }

  private parseMultiplicative(): ExprNode {
    let left = this.parseExponentiation();
    while (
      this.peek().kind === 'op' &&
      (this.peek().value === '*' || this.peek().value === '/' || this.peek().value === '%')
    ) {
      const op = this.next().value;
      const right = this.parseExponentiation();
      left = { kind: 'binary', op, left, right };
    }
    return left;
  }

  private parseExponentiation(): ExprNode {
    const left = this.parseUnary();
    if (this.peek().kind === 'op' && this.peek().value === '**') {
      this.next();
      const right = this.parseExponentiation();
      return { kind: 'binary', op: '**', left, right };
    }
    return left;
  }

  private parseUnary(): ExprNode {
    const tok = this.peek();
    if (tok.kind === 'op' && (tok.value === '++' || tok.value === '--')) {
      const op = this.next().value as '++' | '--';
      const argument = this.parseUnary();
      return { kind: 'update', op, prefix: true, argument };
    }
    if (tok.kind === 'op' && (tok.value === '!' || tok.value === '+' || tok.value === '-' || tok.value === '~')) {
      const op = this.next().value;
      const argument = this.parseUnary();
      return { kind: 'unary', op, argument };
    }
    if (tok.kind === 'ident' && (tok.value === 'typeof' || tok.value === 'void')) {
      const op = this.next().value;
      const argument = this.parseUnary();
      return { kind: 'unary', op, argument };
    }
    return this.parsePostfix();
  }

  private parsePostfix(): ExprNode {
    let expr = this.parseLeftHandSide();
    const tok = this.peek();
    if (
      !tok.hadNewlineBefore &&
      tok.kind === 'op' &&
      (tok.value === '++' || tok.value === '--')
    ) {
      const op = this.next().value as '++' | '--';
      expr = { kind: 'update', op, prefix: false, argument: expr };
    }
    return expr;
  }

  private parseArgumentList(): ArrayElement[] {
    this.expect('punct', '(');
    const args: ArrayElement[] = [];
    if (!(this.peek().kind === 'punct' && this.peek().value === ')')) {
      while (true) {
        const spread = this.match('punct', '...');
        const argExpr = this.parseAssignment();
        args.push({ spread, expr: argExpr });
        if (this.match('punct', ',')) {
          if (this.peek().kind === 'punct' && this.peek().value === ')') {
            break;
          }
          continue;
        }
        break;
      }
    }
    this.expect('punct', ')');
    return args;
  }

  private parseLeftHandSide(): ExprNode {
    if (this.peek().kind === 'ident' && this.peek().value === 'new') {
      this.next();
      const callee = this.parseMemberBaseOnly();
      const args =
        this.peek().kind === 'punct' && this.peek().value === '('
          ? this.parseArgumentList()
          : [];
      const newExpr: ExprNode = { kind: 'new', callee, args };
      return this.parsePostfixSteps(newExpr);
    }
    const base = this.parsePrimary();
    return this.parsePostfixSteps(base);
  }

  private parseMemberBaseOnly(): ExprNode {
    const base = this.parsePrimary();
    const steps: PostfixStep[] = [];
    while (this.peek().kind === 'punct' && (this.peek().value === '.' || this.peek().value === '[')) {
      if (this.match('punct', '.')) {
        const prop = this.expect('ident');
        steps.push({ kind: 'prop', name: prop.value, optional: false });
      } else if (this.match('punct', '[')) {
        const index = this.parseExpression();
        this.expect('punct', ']');
        steps.push({ kind: 'index', index, optional: false });
      }
    }
    return steps.length > 0 ? { kind: 'chain', base, steps, hasOptional: false } : base;
  }

  private parsePostfixSteps(base: ExprNode): ExprNode {
    const steps: PostfixStep[] = [];
    let hasOptional = false;

    while (true) {
      const tok = this.peek();
      if (tok.kind === 'punct' && tok.value === '.') {
        this.next();
        const prop = this.expect('ident');
        steps.push({ kind: 'prop', name: prop.value, optional: false });
        continue;
      }
      if (tok.kind === 'punct' && tok.value === '?.') {
        this.next();
        hasOptional = true;
        if (this.match('punct', '[')) {
          const index = this.parseExpression();
          this.expect('punct', ']');
          steps.push({ kind: 'index', index, optional: true });
        } else if (this.peek().kind === 'punct' && this.peek().value === '(') {
          const args = this.parseArgumentList();
          steps.push({ kind: 'call', args, optional: true });
        } else {
          const prop = this.expect('ident');
          steps.push({ kind: 'prop', name: prop.value, optional: true });
        }
        continue;
      }
      if (tok.kind === 'punct' && tok.value === '[' && !tok.hadNewlineBefore) {
        this.next();
        const index = this.parseExpression();
        this.expect('punct', ']');
        steps.push({ kind: 'index', index, optional: false });
        continue;
      }
      if (tok.kind === 'punct' && tok.value === '(' && !tok.hadNewlineBefore) {
        const args = this.parseArgumentList();
        steps.push({ kind: 'call', args, optional: false });
        continue;
      }
      break;
    }

    if (steps.length === 0) {
      return base;
    }
    return { kind: 'chain', base, steps, hasOptional };
  }

  private parsePrimary(): ExprNode {
    const tok = this.peek();

    if (tok.kind === 'number') {
      this.next();
      return { kind: 'literal', value: tok.numValue ?? 0 };
    }
    if (tok.kind === 'string') {
      this.next();
      return { kind: 'literal', value: tok.value };
    }
    if (tok.kind === 'template') {
      this.next();
      const compiledParts: Array<{ isExpr: boolean; text?: string; expr?: ExprNode }> = (
        tok.templateParts ?? []
      ).map((part: TemplatePart) => {
        if (!part.isExpr) {
          return { isExpr: false, text: part.text };
        }
        const subParser = new SafeParser(part.text);
        return { isExpr: true, expr: subParser.parseSingleExpression() };
      });
      return { kind: 'template', parts: compiledParts };
    }

    if (tok.kind === 'ident') {
      switch (tok.value) {
        case 'true':
          this.next();
          return { kind: 'literal', value: true };
        case 'false':
          this.next();
          return { kind: 'literal', value: false };
        case 'null':
          this.next();
          return { kind: 'literal', value: null };
        case 'undefined':
          this.next();
          return { kind: 'literal', value: undefined };
        case 'NaN':
          this.next();
          return { kind: 'literal', value: Number.NaN };
        case 'Infinity':
          this.next();
          return { kind: 'literal', value: Number.POSITIVE_INFINITY };
        case 'this':
          this.next();
          return { kind: 'this' };
        case 'function':
          return this.parseFunctionExpression();
        default:
          if (RESERVED_WORDS.has(tok.value)) {
            throw new SyntaxError(`Unexpected keyword "${tok.value}" at position ${tok.pos}`);
          }
          this.next();
          return { kind: 'ident', name: tok.value };
      }
    }

    if (tok.kind === 'punct' && tok.value === '(') {
      this.next();
      const inner = this.parseExpression();
      this.expect('punct', ')');
      // Wrap optional chains in parentheses by forcing non-merged evaluation
      if (inner.kind === 'chain' && inner.hasOptional) {
        return { kind: 'chain', base: inner, steps: [], hasOptional: false };
      }
      return inner;
    }

    if (tok.kind === 'punct' && tok.value === '[') {
      return this.parseArrayLiteral();
    }

    if (tok.kind === 'punct' && tok.value === '{') {
      return this.parseObjectLiteral();
    }

    throw new SyntaxError(`Unexpected token "${tok.value || tok.kind}" at position ${tok.pos}`);
  }

  private parseFunctionExpression(): ExprNode {
    this.expect('ident', 'function');
    // Optional function name (ignored for anonymous closure)
    if (this.peek().kind === 'ident') {
      const fnName = this.next().value;
      if (BLOCKED_KEYS.has(fnName) || BLOCKED_GLOBALS.has(fnName)) {
        throw new SyntaxError(`Invalid function name "${fnName}"`);
      }
    }
    this.expect('punct', '(');
    const params: string[] = [];
    if (!(this.peek().kind === 'punct' && this.peek().value === ')')) {
      while (true) {
        const pTok = this.expect('ident');
        if (RESERVED_WORDS.has(pTok.value) || BLOCKED_KEYS.has(pTok.value) || BLOCKED_GLOBALS.has(pTok.value)) {
          throw new SyntaxError(`Invalid parameter "${pTok.value}"`);
        }
        params.push(pTok.value);
        if (this.match('punct', ',')) {
          if (this.peek().kind === 'punct' && this.peek().value === ')') {
            break;
          }
          continue;
        }
        break;
      }
    }
    this.expect('punct', ')');
    const block = this.parseBlockStatement();
    return {
      kind: 'arrow',
      params,
      body: block.kind === 'block' ? block.body : [block],
    };
  }

  private parseArrayLiteral(): ExprNode {
    this.expect('punct', '[');
    const elements: ArrayElement[] = [];
    while (this.peek().kind !== 'eof' && !(this.peek().kind === 'punct' && this.peek().value === ']')) {
      if (this.match('punct', ',')) {
        elements.push({ spread: false, expr: { kind: 'literal', value: undefined } });
        continue;
      }
      const spread = this.match('punct', '...');
      const expr = this.parseAssignment();
      elements.push({ spread, expr });
      if (!this.match('punct', ',')) {
        break;
      }
    }
    this.expect('punct', ']');
    return { kind: 'array', elements };
  }

  private parseObjectLiteral(): ExprNode {
    this.expect('punct', '{');
    const properties: ObjectProp[] = [];
    while (this.peek().kind !== 'eof' && !(this.peek().kind === 'punct' && this.peek().value === '}')) {
      if (this.match('punct', '...')) {
        const expr = this.parseAssignment();
        properties.push({ spread: true, computed: false, value: expr });
      } else if (this.match('punct', '[')) {
        const keyExpr = this.parseAssignment();
        this.expect('punct', ']');
        this.expect('punct', ':');
        const value = this.parseAssignment();
        properties.push({ spread: false, computed: true, keyExpr, value });
      } else {
        const keyTok = this.peek();
        let keyName: string;
        if (keyTok.kind === 'ident' || keyTok.kind === 'string' || keyTok.kind === 'number') {
          this.next();
          keyName = keyTok.value;
        } else {
          throw new SyntaxError(`Invalid object property key "${keyTok.value}" at position ${keyTok.pos}`);
        }
        if (BLOCKED_KEYS.has(keyName)) {
          throw new SyntaxError(`Unsafe object literal key "${keyName}" is forbidden`);
        }
        if (this.match('punct', ':')) {
          const value = this.parseAssignment();
          properties.push({ spread: false, computed: false, key: keyName, value });
        } else if (keyTok.kind === 'ident') {
          properties.push({
            spread: false,
            computed: false,
            key: keyName,
            value: { kind: 'ident', name: keyName },
          });
        } else {
          throw new SyntaxError(`Expected ":" after object property "${keyName}"`);
        }
      }
      if (!this.match('punct', ',')) {
        break;
      }
    }
    this.expect('punct', '}');
    return { kind: 'object', properties };
  }
}

// ---------------------------------------------------------------------------
// Evaluator & Lexical Scope
// ---------------------------------------------------------------------------

interface BindingCell {
  value: unknown;
  mutable: boolean;
}

class EvalScope {
  private readonly bindings: Map<string, BindingCell> = new Map<string, BindingCell>();

  constructor(
    public readonly thisArg: unknown,
    private readonly parent: EvalScope | null = null,
    public readonly isFunctionRoot: boolean = false
  ) {}

  public declare(name: string, value: unknown, mutable: boolean, hoistToFunction: boolean = false): void {
    assertSafeKey(name);
    if (BLOCKED_GLOBALS.has(name)) {
      throw new Error(`Declaration of restricted identifier "${name}" is forbidden`);
    }
    if (hoistToFunction && !this.isFunctionRoot && this.parent) {
      this.parent.declare(name, value, mutable, true);
      return;
    }
    this.bindings.set(name, { value, mutable });
  }

  public hasBinding(name: string): boolean {
    if (this.bindings.has(name)) {
      return true;
    }
    return this.parent ? this.parent.hasBinding(name) : false;
  }

  public lookup(name: string, forTypeof: boolean = false): unknown {
    if (BLOCKED_KEYS.has(name) || BLOCKED_GLOBALS.has(name)) {
      throw new Error(`Access to unsafe identifier "${name}" is forbidden`);
    }
    const local = this.bindings.get(name);
    if (local !== undefined) {
      return assertSafeValue(local.value);
    }
    if (this.parent) {
      return this.parent.lookup(name, forTypeof);
    }
    if (Object.prototype.hasOwnProperty.call(SAFE_BUILTINS, name)) {
      return SAFE_BUILTINS[name];
    }
    if (forTypeof) {
      return undefined;
    }
    throw new ReferenceError(`${name} is not defined`);
  }

  public assign(name: string, value: unknown): unknown {
    if (BLOCKED_KEYS.has(name) || BLOCKED_GLOBALS.has(name)) {
      throw new Error(`Assignment to unsafe identifier "${name}" is forbidden`);
    }
    const local = this.bindings.get(name);
    if (local !== undefined) {
      if (!local.mutable) {
        throw new TypeError(`Assignment to constant variable "${name}"`);
      }
      local.value = value;
      return value;
    }
    if (this.parent) {
      return this.parent.assign(name, value);
    }
    throw new ReferenceError(`${name} is not defined`);
  }
}

interface ReturnSignal {
  readonly returned: true;
  readonly value: unknown;
}

function toJsPrimitive(
  val: unknown,
  preferString: boolean = false
): string | number | bigint | boolean | symbol | null | undefined {
  if (val === null) {
    return null;
  }
  if (val === undefined) {
    return undefined;
  }
  if (
    typeof val === 'string' ||
    typeof val === 'number' ||
    typeof val === 'boolean' ||
    typeof val === 'bigint' ||
    typeof val === 'symbol'
  ) {
    return val;
  }
  if (val instanceof Date) {
    return preferString ? val.toString() : val.valueOf();
  }
  if (typeof val === 'object' || typeof val === 'function') {
    if (preferString) {
      return String(val);
    }
    const vo: unknown = val.valueOf();
    if (vo === null) {
      return null;
    }
    if (vo === undefined) {
      return undefined;
    }
    if (
      typeof vo === 'string' ||
      typeof vo === 'number' ||
      typeof vo === 'boolean' ||
      typeof vo === 'bigint' ||
      typeof vo === 'symbol'
    ) {
      return vo;
    }
    return String(val);
  }
  return undefined;
}

function evalPlus(left: unknown, right: unknown): string | number {
  const pl = toJsPrimitive(left, left instanceof Date);
  const pr = toJsPrimitive(right, right instanceof Date);
  if (typeof pl === 'string' || typeof pr === 'string') {
    return String(pl) + String(pr);
  }
  return Number(pl) + Number(pr);
}

function evalRelational(op: string, left: unknown, right: unknown): boolean {
  const pl = toJsPrimitive(left, false);
  const pr = toJsPrimitive(right, false);
  if (typeof pl === 'string' && typeof pr === 'string') {
    switch (op) {
      case '<':
        return pl < pr;
      case '<=':
        return pl <= pr;
      case '>':
        return pl > pr;
      case '>=':
        return pl >= pr;
    }
  }
  const nl = Number(pl);
  const nr = Number(pr);
  switch (op) {
    case '<':
      return nl < nr;
    case '<=':
      return nl <= nr;
    case '>':
      return nl > nr;
    case '>=':
      return nl >= nr;
    default:
      return false;
  }
}

function applyCompoundOp(op: string, current: unknown, right: unknown): unknown {
  switch (op) {
    case '=':
      return right;
    case '+=':
      return evalPlus(current, right);
    case '-=':
      return Number(current) - Number(right);
    case '*=':
      return Number(current) * Number(right);
    case '/=':
      return Number(current) / Number(right);
    case '%=':
      return Number(current) % Number(right);
    default:
      throw new Error(`Unsupported assignment operator "${op}"`);
  }
}

function evaluateArgs(argNodes: ArrayElement[], scope: EvalScope): unknown[] {
  const args: unknown[] = [];
  for (const item of argNodes) {
    const val = evalExpr(item.expr, scope);
    if (item.spread) {
      if (!Array.isArray(val)) {
        throw new TypeError('Spread argument must be an array');
      }
      const spreadArr: ReadonlyArray<unknown> = val;
      for (const el of spreadArr) {
        args.push(el);
      }
    } else {
      args.push(val);
    }
  }
  return args;
}

function safeReadProperty(target: unknown, key: unknown): unknown {
  const k = assertSafeKey(key);
  if (target === null || target === undefined) {
    throw new TypeError(`Cannot read properties of ${String(target)} (reading '${k}')`);
  }
  if (isGlobalObject(target)) {
    throw new Error('Unsafe global property read is forbidden');
  }
  // Box primitives safely for `.length`, `.trim`, `.toFixed`, etc.
  const obj: Record<string, unknown> = isObjectOrFunction(target)
    ? target
    : (Object(target) as Record<string, unknown>);
  const val = obj[k];
  return assertSafeValue(val);
}

function safeInvoke(fnVal: unknown, receiver: unknown, propName: string | null, args: unknown[]): unknown {
  if (isBlockedCallableOrTarget(fnVal) || isGlobalObject(receiver)) {
    throw new Error('Unsafe function call is forbidden');
  }
  if (receiver === Object && propName !== null && BLOCKED_OBJECT_METHODS.has(propName)) {
    throw new Error(`Object.${propName} is forbidden in safe expressions`);
  }
  if (typeof fnVal !== 'function') {
    throw new TypeError(`${propName ?? 'Expression'} is not a function`);
  }
  const result: unknown = Reflect.apply(fnVal, receiver, args);
  return assertSafeValue(result);
}

function resolveAssignTarget(
  targetNode: ExprNode,
  scope: EvalScope
): { kind: 'var'; name: string } | { kind: 'prop'; obj: Record<string, unknown>; key: string } {
  if (targetNode.kind === 'ident') {
    return { kind: 'var', name: targetNode.name };
  }
  if (targetNode.kind === 'chain' && targetNode.steps.length > 0 && !targetNode.hasOptional) {
    let cur: unknown = evalExpr(targetNode.base, scope);
    for (let i = 0; i < targetNode.steps.length - 1; i++) {
      const step = targetNode.steps[i];
      if (step.kind === 'prop') {
        cur = safeReadProperty(cur, step.name);
      } else if (step.kind === 'index') {
        const k = evalExpr(step.index, scope);
        cur = safeReadProperty(cur, k);
      } else {
        const args = evaluateArgs(step.args, scope);
        cur = safeInvoke(cur, undefined, null, args);
      }
    }
    const last = targetNode.steps[targetNode.steps.length - 1];
    if (last.kind !== 'prop' && last.kind !== 'index') {
      throw new SyntaxError('Invalid left-hand side in assignment');
    }
    const rawKey = last.kind === 'prop' ? last.name : evalExpr(last.index, scope);
    const safeKey = assertSafeKey(rawKey);
    if (!isObjectOrFunction(cur) || isGlobalObject(cur)) {
      throw new TypeError(`Cannot set properties of ${String(cur)} (setting '${safeKey}')`);
    }
    return { kind: 'prop', obj: cur, key: safeKey };
  }
  throw new SyntaxError('Invalid left-hand side in assignment');
}

function evalExpr(node: ExprNode, scope: EvalScope): unknown {
  switch (node.kind) {
    case 'literal':
      return node.value;

    case 'this':
      return isGlobalObject(scope.thisArg) ? undefined : scope.thisArg;

    case 'ident':
      return scope.lookup(node.name, false);

    case 'template': {
      let out = '';
      for (const part of node.parts) {
        if (!part.isExpr) {
          out += part.text ?? '';
        } else if (part.expr) {
          out += String(evalExpr(part.expr, scope));
        }
      }
      return out;
    }

    case 'array': {
      const result: unknown[] = [];
      for (const el of node.elements) {
        const val = evalExpr(el.expr, scope);
        if (el.spread) {
          if (!Array.isArray(val)) {
            throw new TypeError('Spread element in array literal must be an array');
          }
          const spreadItems: ReadonlyArray<unknown> = val;
          for (const item of spreadItems) {
            result.push(item);
          }
        } else {
          result.push(val);
        }
      }
      return result;
    }

    case 'object': {
      const obj: Record<string, unknown> = {};
      for (const prop of node.properties) {
        if (prop.spread) {
          const src = evalExpr(prop.value, scope);
          if (src !== null && src !== undefined && typeof src === 'object') {
            for (const [k, v] of Object.entries(src as Record<string, unknown>)) {
              if (!isUnsafePropertyKey(k)) {
                obj[k] = v;
              }
            }
          }
        } else {
          const rawKey = prop.computed && prop.keyExpr ? evalExpr(prop.keyExpr, scope) : prop.key;
          const k = assertSafeKey(rawKey);
          obj[k] = evalExpr(prop.value, scope);
        }
      }
      return obj;
    }

    case 'new': {
      const ctor = evalExpr(node.callee, scope);
      if (!SAFE_CONSTRUCTORS.has(ctor) || typeof ctor !== 'function') {
        throw new Error('Constructor invocation is restricted to safe built-in types');
      }
      const args = evaluateArgs(node.args, scope);
      return Reflect.construct(ctor, args);
    }

    case 'chain': {
      let cur: unknown = evalExpr(node.base, scope);
      let receiver: unknown = undefined;
      let lastPropName: string | null = null;

      for (const step of node.steps) {
        if (step.optional && (cur === null || cur === undefined)) {
          return undefined;
        }
        if (step.kind === 'prop') {
          receiver = cur;
          lastPropName = step.name;
          cur = safeReadProperty(cur, step.name);
        } else if (step.kind === 'index') {
          const idxVal = evalExpr(step.index, scope);
          receiver = cur;
          lastPropName = String(idxVal);
          cur = safeReadProperty(cur, idxVal);
        } else {
          const args = evaluateArgs(step.args, scope);
          cur = safeInvoke(cur, receiver, lastPropName, args);
          receiver = undefined;
          lastPropName = null;
        }
      }
      return cur;
    }

    case 'unary': {
      if (node.op === 'typeof') {
        if (node.argument.kind === 'ident') {
          return typeof scope.lookup(node.argument.name, true);
        }
        return typeof evalExpr(node.argument, scope);
      }
      const val = evalExpr(node.argument, scope);
      switch (node.op) {
        case '!':
          return !val;
        case '+':
          return +Number(val);
        case '-':
          return -Number(val);
        case '~':
          return ~Number(val);
        case 'void':
          return undefined;
        default:
          throw new Error(`Unknown unary operator "${node.op}"`);
      }
    }

    case 'update': {
      const target = resolveAssignTarget(node.argument, scope);
      const prev =
        target.kind === 'var'
          ? Number(scope.lookup(target.name))
          : Number(safeReadProperty(target.obj, target.key));
      const next = node.op === '++' ? prev + 1 : prev - 1;
      if (target.kind === 'var') {
        scope.assign(target.name, next);
      } else {
        target.obj[target.key] = next;
      }
      return node.prefix ? next : prev;
    }

    case 'logical': {
      const left = evalExpr(node.left, scope);
      if (node.op === '&&') {
        return left ? evalExpr(node.right, scope) : left;
      }
      if (node.op === '||') {
        return left ? left : evalExpr(node.right, scope);
      }
      return left !== null && left !== undefined ? left : evalExpr(node.right, scope);
    }

    case 'binary': {
      const left = evalExpr(node.left, scope);
      const right = evalExpr(node.right, scope);
      switch (node.op) {
        case '==':
          // eslint-disable-next-line eqeqeq
          return left == right;
        case '!=':
          // eslint-disable-next-line eqeqeq
          return left != right;
        case '===':
          return left === right;
        case '!==':
          return left !== right;
        case '<':
        case '<=':
        case '>':
        case '>=':
          return evalRelational(node.op, left, right);
        case '+':
          return evalPlus(left, right);
        case '-':
          return Number(left) - Number(right);
        case '*':
          return Number(left) * Number(right);
        case '/':
          return Number(left) / Number(right);
        case '%':
          return Number(left) % Number(right);
        case '**':
          return Number(left) ** Number(right);
        case '|':
          return Number(left) | Number(right);
        case '^':
          return Number(left) ^ Number(right);
        case '&':
          return Number(left) & Number(right);
        case 'in': {
          const k = assertSafeKey(left);
          if (!isObjectOrFunction(right) || isGlobalObject(right)) {
            throw new TypeError('Cannot use "in" operator on non-object or restricted target');
          }
          return k in right;
        }
        case 'instanceof': {
          if (typeof right !== 'function' || isBlockedCallableOrTarget(right)) {
            throw new TypeError('Right-hand side of "instanceof" is not a safe constructor');
          }
          return left instanceof right;
        }
        default:
          throw new Error(`Unknown binary operator "${node.op}"`);
      }
    }

    case 'conditional':
      return evalExpr(node.test, scope)
        ? evalExpr(node.consequent, scope)
        : evalExpr(node.alternate, scope);

    case 'assign': {
      const target = resolveAssignTarget(node.left, scope);
      const rightVal = evalExpr(node.right, scope);
      if (target.kind === 'var') {
        const curVal = node.op === '=' ? undefined : scope.lookup(target.name);
        const nextVal = applyCompoundOp(node.op, curVal, rightVal);
        return scope.assign(target.name, nextVal);
      }
      const curPropVal = node.op === '=' ? undefined : safeReadProperty(target.obj, target.key);
      const nextPropVal = applyCompoundOp(node.op, curPropVal, rightVal);
      target.obj[target.key] = nextPropVal;
      return nextPropVal;
    }

    case 'arrow': {
      const capturedThis = scope.thisArg;
      return (...callArgs: unknown[]): unknown => {
        const fnScope = new EvalScope(capturedThis, scope, true);
        for (let i = 0; i < node.params.length; i++) {
          fnScope.declare(node.params[i], callArgs[i], true);
        }
        if (Array.isArray(node.body)) {
          const res = evalStatements(node.body, fnScope);
          return res ? res.value : undefined;
        }
        return evalExpr(node.body, fnScope);
      };
    }
  }
}

function evalStatements(stmts: StmtNode[], scope: EvalScope): ReturnSignal | null {
  for (const stmt of stmts) {
    const res = evalStatement(stmt, scope);
    if (res !== null) {
      return res;
    }
  }
  return null;
}

function evalStatement(stmt: StmtNode, scope: EvalScope): ReturnSignal | null {
  switch (stmt.kind) {
    case 'empty':
      return null;

    case 'expr':
      evalExpr(stmt.expr, scope);
      return null;

    case 'block': {
      const blockScope = new EvalScope(scope.thisArg, scope, false);
      return evalStatements(stmt.body, blockScope);
    }

    case 'var': {
      const mutable = stmt.declKind !== 'const';
      const hoist = stmt.declKind === 'var';
      for (const decl of stmt.declarations) {
        const initVal = decl.init ? evalExpr(decl.init, scope) : undefined;
        scope.declare(decl.name, initVal, mutable, hoist);
      }
      return null;
    }

    case 'if': {
      if (evalExpr(stmt.test, scope)) {
        return evalStatement(stmt.consequent, scope);
      }
      if (stmt.alternate) {
        return evalStatement(stmt.alternate, scope);
      }
      return null;
    }

    case 'return': {
      const val = stmt.argument ? evalExpr(stmt.argument, scope) : undefined;
      return { returned: true, value: val };
    }
  }
}

// ---------------------------------------------------------------------------
// Public Compilation Helpers + AST Cache
// ---------------------------------------------------------------------------

const EXPR_AST_CACHE: Map<string, ExprNode> = new Map<string, ExprNode>();
const BODY_AST_CACHE: Map<string, StmtNode[]> = new Map<string, StmtNode[]>();
const MAX_AST_CACHE_SIZE = 2048;

function validateArgNames(argNames: ReadonlyArray<string>): void {
  for (const arg of argNames) {
    if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(arg)) {
      throw new SyntaxError(`Invalid argument name "${arg}"`);
    }
    if (BLOCKED_KEYS.has(arg) || BLOCKED_GLOBALS.has(arg) || RESERVED_WORDS.has(arg)) {
      throw new SyntaxError(`Restricted argument name "${arg}"`);
    }
  }
}

function createRootScope(
  thisArg: unknown,
  argNames: ReadonlyArray<string>,
  args: ReadonlyArray<unknown>
): EvalScope {
  const safeThis = isGlobalObject(thisArg) ? undefined : thisArg;
  const scope = new EvalScope(safeThis, null, true);
  for (let i = 0; i < argNames.length; i++) {
    scope.declare(argNames[i], args[i], true);
  }
  return scope;
}

/**
 * Compiles a single JavaScript expression string into a reusable, CSP-safe evaluator function without dynamic code evaluation.
 * @zh 将单条表达式字符串编译为可复用的无动态代码执行安全求值函数。
 * @param expression - expression parameter (`string`) / 表达式字符串参数（`string`）
 * @param argNames - argNames parameter (`readonly string[]`) / 形参名称列表（`readonly string[]`）
 * @returns Result of type `(...args: unknown[]) => unknown` / 类型为 `(...args: unknown[]) => unknown` 的返回值
 */
export function compileSafeExpression(
  expression: string,
  argNames: ReadonlyArray<string>
): (...args: unknown[]) => unknown {
  if (typeof expression !== 'string') {
    throw new TypeError('Expression must be a string');
  }
  validateArgNames(argNames);
  const trimmed = expression.trim();
  if (trimmed === '') {
    return function emptyExpr(): undefined {
      return undefined;
    };
  }

  let ast = EXPR_AST_CACHE.get(trimmed);
  if (!ast) {
    const parser = new SafeParser(trimmed);
    ast = parser.parseSingleExpression();
    if (EXPR_AST_CACHE.size >= MAX_AST_CACHE_SIZE) {
      EXPR_AST_CACHE.clear();
    }
    EXPR_AST_CACHE.set(trimmed, ast);
  }

  const compiledAst = ast;
  const names = Array.from(argNames);
  return function evaluateSafeExpression(this: unknown, ...args: unknown[]): unknown {
    const scope = createRootScope(this, names, args);
    return evalExpr(compiledAst, scope);
  };
}

/**
 * Compiles a multi-statement function body (`return`, `if/else`, `const/let/var`, safe assignments, method calls) without dynamic code evaluation.
 * @zh 将多语句函数体字符串编译为无动态代码执行的安全执行函数。
 * @param body - body parameter (`string`) / 函数体代码字符串（`string`）
 * @param argNames - argNames parameter (`readonly string[]`) / 形参名称列表（`readonly string[]`）
 * @returns Result of type `(...args: unknown[]) => unknown` / 类型为 `(...args: unknown[]) => unknown` 的返回值
 */
export function compileSafeFunctionBody(
  body: string,
  argNames: ReadonlyArray<string>
): (...args: unknown[]) => unknown {
  if (typeof body !== 'string') {
    throw new TypeError('Function body must be a string');
  }
  validateArgNames(argNames);
  const trimmed = body.trim();
  if (trimmed === '') {
    return function emptyBody(): undefined {
      return undefined;
    };
  }

  let stmts = BODY_AST_CACHE.get(trimmed);
  if (!stmts) {
    const parser = new SafeParser(trimmed);
    stmts = parser.parseProgram();
    if (BODY_AST_CACHE.size >= MAX_AST_CACHE_SIZE) {
      BODY_AST_CACHE.clear();
    }
    BODY_AST_CACHE.set(trimmed, stmts);
  }

  const compiledStmts = stmts;
  const names = Array.from(argNames);
  return function evaluateSafeBody(this: unknown, ...args: unknown[]): unknown {
    const scope = createRootScope(this, names, args);
    const res = evalStatements(compiledStmts, scope);
    return res ? res.value : undefined;
  };
}

type SetterStep =
  | { kind: 'prop'; name: string }
  | { kind: 'index'; expr: ExprNode };

function extractSetterPath(
  ast: ExprNode
): { rootKind: 'this' | 'ident'; rootName: string; steps: SetterStep[] } | null {
  if (ast.kind === 'ident') {
    if (BLOCKED_KEYS.has(ast.name) || BLOCKED_GLOBALS.has(ast.name)) {
      return null;
    }
    return { rootKind: 'ident', rootName: ast.name, steps: [] };
  }
  if (ast.kind === 'chain' && !ast.hasOptional && ast.steps.length > 0) {
    if (ast.base.kind !== 'this' && ast.base.kind !== 'ident') {
      return null;
    }
    const rootKind = ast.base.kind;
    const rootName = ast.base.kind === 'ident' ? ast.base.name : 'this';
    if (rootKind === 'ident' && (BLOCKED_KEYS.has(rootName) || BLOCKED_GLOBALS.has(rootName))) {
      return null;
    }
    const setterSteps: SetterStep[] = [];
    for (const s of ast.steps) {
      if (s.kind === 'prop') {
        if (BLOCKED_KEYS.has(s.name)) {
          return null;
        }
        setterSteps.push({ kind: 'prop', name: s.name });
      } else if (s.kind === 'index') {
        if (s.index.kind === 'literal' && isUnsafePropertyKey(s.index.value)) {
          return null;
        }
        setterSteps.push({ kind: 'index', expr: s.index });
      } else {
        return null;
      }
    }
    return { rootKind, rootName, steps: setterSteps };
  }
  return null;
}

function resolveImplicitSetterReceiver(
  rootName: string,
  thisArg: unknown,
  argMap: Map<string, unknown>,
  argNames: ReadonlyArray<string>,
  args: ReadonlyArray<unknown>
): Record<string, unknown> | null {
  const safeThis =
    isObjectOrFunction(thisArg) && !isGlobalObject(thisArg) ? thisArg : null;

  // 1. If `thisArg` explicitly carries `rootName` (and isn't just `{ comp }` wrapper for another prop)
  if (safeThis && rootName in safeThis) {
    const keys = Object.keys(safeThis);
    const isCompWrapperOnly = keys.length === 1 && keys[0] === 'comp' && rootName !== 'comp';
    if (!isCompWrapperOnly) {
      return safeThis;
    }
  }

  // 2. Standard DUI `['expressionValue', 'comp', 'owner']` or `['expressionValue', 'field', ...]`
  const compArg = argMap.get('comp');
  if (isObjectOrFunction(compArg) && !isGlobalObject(compArg)) {
    return compArg;
  }
  const fieldArg = argMap.get('field');
  if (isObjectOrFunction(fieldArg) && !isGlobalObject(fieldArg)) {
    return fieldArg;
  }
  if (argNames[0] === 'expressionValue' && args.length >= 2) {
    const secondArg = args[1];
    if (isObjectOrFunction(secondArg) && !isGlobalObject(secondArg)) {
      return secondArg;
    }
  }

  // 3. Fallback to `thisArg.comp` wrapper or `thisArg` itself (never `window` / `globalThis`)
  if (safeThis) {
    const wrappedComp = safeThis['comp'];
    if (isObjectOrFunction(wrappedComp) && !isGlobalObject(wrappedComp)) {
      return wrappedComp;
    }
    return safeThis;
  }

  return null;
}

/**
 * Compiles a safe property-path setter (`comp.disable`, `comp.hidden`, `props.checked`, `disabled`, etc.)
 * without dynamic code evaluation, never writing to `window`/`globalThis` and blocking prototype pollution keys.
 * @zh 编译安全的属性路径赋值函数（支持 `comp.disable`、`comp.hidden`、`props.checked`、`disabled` 等全部形态），零动态代码执行、零全局变量污染并阻断原型链键写入。
 * @param expression - expression parameter (`string`) / 目标属性路径表达式（`string`）
 * @param argNames - argNames parameter (`readonly string[]`) / 形参名称列表（`readonly string[]`）
 * @returns Result of type `(...args: unknown[]) => void` / 类型为 `(...args: unknown[]) => void` 的返回值
 */
export function compileSafeValueSetter(
  expression: string,
  argNames: ReadonlyArray<string>
): (...args: unknown[]) => void {
  const noop = (): void => {};
  if (typeof expression !== 'string') {
    return noop;
  }
  const trimmed = expression.trim();
  if (!trimmed) {
    return noop;
  }

  try {
    validateArgNames(argNames);
    const parser = new SafeParser(trimmed);
    const ast = parser.parseSingleExpression();
    const extracted = extractSetterPath(ast);
    if (!extracted) {
      return noop;
    }

    const names = Array.from(argNames);
    const valueArgIdx = names.indexOf('expressionValue');

    return function applySafeSetter(this: unknown, ...args: unknown[]): void {
      const assignedValue: unknown = valueArgIdx >= 0 ? args[valueArgIdx] : args[0];
      const argMap = new Map<string, unknown>();
      for (let i = 0; i < names.length; i++) {
        argMap.set(names[i], args[i]);
      }

      let current: unknown;
      let pathSteps: SetterStep[];

      if (extracted.rootKind === 'this') {
        if (!isObjectOrFunction(this) || isGlobalObject(this) || extracted.steps.length === 0) {
          return;
        }
        current = this;
        pathSteps = extracted.steps;
      } else if (argMap.has(extracted.rootName)) {
        if (extracted.steps.length === 0) {
          // Bare parameter name (e.g. `expressionValue = expressionValue`) has no external target
          return;
        }
        current = argMap.get(extracted.rootName);
        pathSteps = extracted.steps;
      } else {
        // Single identifier (`disabled`, `hidden`) or implicit property path (`props.checked`) not in `argNames`:
        // route safely to the target component/field object without polluting `window`!
        const implicitTarget = resolveImplicitSetterReceiver(
          extracted.rootName,
          this,
          argMap,
          names,
          args
        );
        if (!implicitTarget) {
          return;
        }
        current = implicitTarget;
        pathSteps = [{ kind: 'prop', name: extracted.rootName }, ...extracted.steps];
      }

      const scope = createRootScope(this, names, args);
      for (let i = 0; i < pathSteps.length - 1; i++) {
        if (!isObjectOrFunction(current) || isGlobalObject(current)) {
          return;
        }
        const step = pathSteps[i];
        const keyVal = step.kind === 'prop' ? step.name : evalExpr(step.expr, scope);
        if (isUnsafePropertyKey(keyVal)) {
          return;
        }
        current = current[String(keyVal)];
      }

      if (!isObjectOrFunction(current) || isGlobalObject(current)) {
        return;
      }
      const finalStep = pathSteps[pathSteps.length - 1];
      const finalKeyVal =
        finalStep.kind === 'prop' ? finalStep.name : evalExpr(finalStep.expr, scope);
      if (isUnsafePropertyKey(finalKeyVal)) {
        return;
      }
      const finalKey = String(finalKeyVal);
      if (BLOCKED_GLOBALS.has(finalKey) && current === SAFE_BUILTINS) {
        return;
      }
      current[finalKey] = assignedValue;
    };
  } catch {
    return noop;
  }
}
