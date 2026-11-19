/**
 * @fileoverview Unit tests for CSP-safe AST evaluation in `Parse` (`src/core/angular2parse/parse.ts`).
 * @zh 验证 `Parse.eval` 与 `Parse.calc` 基于 AST 的零 `new Function` 求值、管道缓存与原型链安全拦截。
 */

import { TestBed } from '@angular/core/testing';
import { Lexer, Parser } from './angular';
import { PIPES_CONFIG, Parse } from './parse';
import { ParseVisitorResolver } from './visitors';

class ShoutPipe {
  private readonly defaultSuffix = '!';
  transform(value: unknown, suffix?: string): string {
    return `${String(value ?? '').toUpperCase()}${suffix ?? this.defaultSuffix}`;
  }
}

describe('Parse (@dotos1/dui/core/angular2parse) AST evaluation without new Function', () => {
  let parse: Parse;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Parse,
        {
          provide: PIPES_CONFIG,
          multi: true,
          useValue: [{ pipeName: 'shout', pipeInstance: new ShoutPipe() }],
        },
      ],
    });
    parse = TestBed.inject(Parse);
  });

  it('evaluates property reads, keyed reads, literals, binary/unary operators, and loose equality', () => {
    const ctx = {
      model: { renderType: 1, count: 4, items: [10, 20, 30] },
      active: false,
    };

    expect(parse.eval('model.renderType == "1"')(ctx)).toBe(true);
    expect(parse.eval('model.renderType === "1"')(ctx)).toBe(false);
    expect(parse.eval('!active && model.count * 2 + model.items[1] === 28')(ctx)).toBe(true);
    expect(parse.eval('active ? "ON" : "OFF"')(ctx)).toBe('OFF');
    expect(parse.eval('[1, 2, model.count]')(ctx)).toEqual([1, 2, 4]);
    expect(parse.eval('{ a: 1, b: model.count }')(ctx)).toEqual({ a: 1, b: 4 });
  });

  it('short-circuits && and || and handles safe navigation (?.) without throwing on nullish receivers', () => {
    expect(parse.eval('missing && missing.deep.prop')({ missing: null })).toBeNull();
    expect(parse.eval('present || missing.deep.prop')({ present: 'OK', missing: null })).toBe('OK');
    expect(parse.eval('user?.profile?.email')({ user: null })).toBeUndefined();
    expect(parse.eval('user?.getName()')({ user: undefined })).toBeUndefined();
    expect(parse.eval('user?.getName()')({ user: { getName: () => 'Alice' } })).toBe('Alice');
  });

  it('evaluates interpolations, method calls, pipesCache pipes, and caches compiled evaluators', () => {
    const fn1 = parse.eval('{{ total }}');
    const fn2 = parse.eval('{{ total }}');
    expect(fn1).toBe(fn2);
    expect(fn1({ total: 99 })).toBe(99);

    expect(parse.eval('Hello {{ user.name }}!')({ user: { name: 'DotOS' } })).toBe('Hello DotOS!');
    expect(parse.eval('title | shout:"?"')({ title: 'ready' })).toBe('READY?');
    expect(parse.eval('title | shout')({ title: 'ready' })).toBe('READY!');
    expect(parse.calc('title.trim().toLowerCase()')({ title: '  DUI  ' })).toBe('dui');
  });

  it('blocks __proto__, constructor, prototype, Function, and global escapes', () => {
    const cleanProbe: Record<string, unknown> = {};
    const maliciousExpressions = [
      'obj.__proto__',
      'obj["__proto__"]',
      'obj.constructor',
      'obj["con" + "structor"]["constructor"]("return process")()',
      'obj.prototype',
    ];

    for (const expr of maliciousExpressions) {
      expect(() => parse.eval(expr)({ obj: {} })).toThrow();
      expect(() => parse.calc(expr)({ obj: {} })).toThrow();
    }

    // Binding parser rejects `=` into EmptyExpr, and action AST blocks PropertyWrite/KeyedWrite to __proto__
    parse.eval('obj.__proto__.polluted = "yes"')({ obj: {} });
    const rawParser = new Parser(new Lexer());
    const resolver = new ParseVisitorResolver(new Map());
    const writeAst = rawParser.parseAction('obj.__proto__.polluted = "yes"', 'spec');
    const keyedWriteAst = rawParser.parseAction('obj["constructor"]["prototype"].polluted = "yes"', 'spec');
    expect(() => writeAst.visit(resolver, { obj: {} })).toThrow();
    expect(() => keyedWriteAst.visit(resolver, { obj: {} })).toThrow();

    expect(cleanProbe['polluted']).toBeUndefined();
    expect(() => parse.eval('name')(globalThis)).toThrow();
  });
});
