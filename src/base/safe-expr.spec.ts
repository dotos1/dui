/**
 * @fileoverview Comprehensive unit tests for `src/base/safe-expr.ts`, `DuiBase` expression evaluators,
 * `field-expression/utils.ts`, and XSS hardening (`MatCarouselSlideComponent`, `PrintDirective`, `SafeurlPipe`).
 * @zh `safe-expr` 零 `eval` 安全表达式求值器、`DuiBase` 表达式兼容层与 XSS 安全加固完整单元测试。
 */

import { SecurityContext } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { MatCarouselSlideComponent } from '../common/carousel/carousel-slide/carousel-slide.component';
import { PrintDirective } from '../common/print/print.directive';
import { SafeurlPipe } from '../core/dynamic/safeurl.pipe';
import { evalStringExpression as formEvalStringExpression } from '../core/form/extensions/field-expression/utils';
import { DuiBase } from './duibase';
import {
  compileSafeExpression,
  compileSafeFunctionBody,
  compileSafeValueSetter,
} from './safe-expr';

describe('safe-expr & DuiBase CSP-safe expression evaluation', () => {
  describe('operators, precedence, literals, and JS loose-equality semantics', () => {
    it('evaluates arithmetic, unary, bitwise, relational, and ternary operators with exact JS precedence', () => {
      const fn = compileSafeExpression('2 + 3 * 4 - 10 / 2 + (7 % 4) + 2 ** 3', []);
      expect(fn()).toBe(2 + 3 * 4 - 10 / 2 + (7 % 4) + 2 ** 3);

      expect(compileSafeExpression('-5 + +("3")', [])()).toBe(-2);
      expect(compileSafeExpression('!false && !!1 && !0', [])()).toBe(true);
      expect(compileSafeExpression('typeof undeclaredSomething === "undefined"', [])()).toBe(true);
      expect(compileSafeExpression('typeof 42', [])()).toBe('number');
      expect(compileSafeExpression('void (1 + 2)', [])()).toBeUndefined();
      expect(compileSafeExpression('(5 | 2) + (6 & 3) + (5 ^ 1) + (~0)', [])()).toBe(
        (5 | 2) + (6 & 3) + (5 ^ 1) + ~0
      );
      expect(compileSafeExpression('score >= 90 ? "A" : score >= 60 ? "B" : "C"', ['score'])(75)).toBe('B');
    });

    it('preserves exact JS loose equality (model.renderType=="1") and strict equality', () => {
      const loose = DuiBase.evalStringExpression('model.renderType=="1"', ['model'])!;
      expect(loose({ renderType: 1 })).toBe(true);
      expect(loose({ renderType: '1' })).toBe(true);
      expect(loose({ renderType: 2 })).toBe(false);

      const strict = DuiBase.evalStringExpression('model.renderType==="1"', ['model'])!;
      expect(strict({ renderType: 1 })).toBe(false);
      expect(strict({ renderType: '1' })).toBe(true);

      expect(compileSafeExpression('a == null', ['a'])(undefined)).toBe(true);
      expect(compileSafeExpression('a == null', ['a'])(null)).toBe(true);
      expect(compileSafeExpression('a == null', ['a'])(0)).toBe(false);
      expect(compileSafeExpression('a != "0"', ['a'])(0)).toBe(false);
      expect(compileSafeExpression('a !== "0"', ['a'])(0)).toBe(true);
    });

    it('short-circuits logical &&, ||, and nullish coalescing ?? properly', () => {
      let sideEffect = 0;
      const ctx = {
        bump(): number {
          sideEffect++;
          return 99;
        },
      };
      expect(compileSafeExpression('false && ctx.bump()', ['ctx'])(ctx)).toBe(false);
      expect(compileSafeExpression('true || ctx.bump()', ['ctx'])(ctx)).toBe(true);
      expect(compileSafeExpression('0 ?? ctx.bump()', ['ctx'])(ctx)).toBe(0);
      expect(compileSafeExpression('"" ?? ctx.bump()', ['ctx'])(ctx)).toBe('');
      expect(sideEffect).toBe(0);

      expect(compileSafeExpression('null ?? "fallback"', [])()).toBe('fallback');
      expect(compileSafeExpression('undefined ?? "fallback"', [])()).toBe('fallback');
      expect(compileSafeExpression('0 || "fallback"', [])()).toBe('fallback');
    });

    it('supports array/object literals, spread, template strings, "in", "instanceof", and safe built-ins', () => {
      const fn = compileSafeExpression(
        'JSON.stringify({ list: [1, ...extra], sum: Math.max(10, parseInt("25", 10)), ok: "k" in meta, label: `v=${extra.length}` })',
        ['extra', 'meta']
      );
      expect(fn([2, 3], { k: true })).toBe(
        JSON.stringify({ list: [1, 2, 3], sum: 25, ok: true, label: 'v=2' })
      );

      expect(compileSafeExpression('new Date(0) instanceof Date', [])()).toBe(true);
      expect(compileSafeExpression('isNaN(NaN) && isFinite(3.14) && !isFinite(Infinity)', [])()).toBe(true);
    });
  });

  describe('member access, optional chaining, method calls, and field-expression/utils', () => {
    it('evaluates nested calls like owner.getForm().form.value and optional chaining short-circuits', () => {
      const expr = DuiBase.evalStringExpression(
        'owner.getForm().form.value.status === "READY"',
        ['comp', 'owner']
      )!;
      const owner = {
        getForm: () => ({
          form: { value: { status: 'READY' } },
        }),
      };
      expect(DuiBase.evalExpression(expr, { comp: {} }, [{}, owner])).toBe(true);

      const optExpr = DuiBase.evalStringExpression(
        'owner?.getForm()?.form?.value?.missing ?? "DEFAULT"',
        ['comp', 'owner']
      )!;
      expect(optExpr({}, null)).toBe('DEFAULT');
      expect(optExpr({}, { getForm: () => null })).toBe('DEFAULT');

      // Short-circuits entire optional chain `owner?.getForm().form.value` when `owner` is nullish
      const fullChainOpt = compileSafeExpression('owner?.getForm().form.value', ['owner']);
      expect(fullChainOpt(undefined)).toBeUndefined();
      expect(fullChainOpt(null)).toBeUndefined();
    });

    it('supports string and array methods including arrow callbacks (.map, .filter, .some, .every, .find)', () => {
      const expr = compileSafeExpression(
        'items.filter(x => x.active).map((x, i) => `${i}:${x.name.trim().toUpperCase()}`).join(",")',
        ['items']
      );
      expect(
        expr([
          { name: ' alpha ', active: true },
          { name: 'beta', active: false },
          { name: ' gamma ', active: true },
        ])
      ).toBe('0:ALPHA,1:GAMMA');

      expect(
        compileSafeExpression(
          'str.startsWith("dot") && str.endsWith("ui") && str.includes("tos") && str.slice(0, 5) === "dotos"',
          ['str']
        )('dotos-dui')
      ).toBe(true);

      expect(
        compileSafeExpression(
          'list.some(v => v > 10) && list.every(v => v > 0) && list.find(v => v % 2 === 0) === 12',
          ['list']
        )([3, 12, 5])
      ).toBe(true);
    });

    it('supports `this` binding and form field-expression evalStringExpression', () => {
      const fn = DuiBase.evalStringExpression('this.comp.count + model.delta', ['model'])!;
      expect(DuiBase.evalExpression(fn, { comp: { count: 10 } }, [{ delta: 5 }])).toBe(15);

      const formFn = formEvalStringExpression(
        'model.age >= 18 && formState.editable && !field.disabled',
        ['model', 'formState', 'field']
      )!;
      expect(formFn.call({ field: { disabled: false } }, { age: 20 }, { editable: true }, { disabled: false })).toBe(
        true
      );
    });
  });

  describe('evalExpressionValueSetter across all target key shapes without window pollution', () => {
    it('handles comp.disable, comp.hidden, props.checked, and single-identifier disabled / hidden', () => {
      const comp: {
        disable: boolean;
        hidden: boolean;
        disabled: boolean;
        props: { checked: boolean };
      } = {
        disable: false,
        hidden: false,
        disabled: false,
        props: { checked: false },
      };
      const owner = {};
      const argNames = ['expressionValue', 'comp', 'owner'];

      const setCompDisable = DuiBase.evalExpressionValueSetter('comp.disable', argNames);
      DuiBase.evalExpression(setCompDisable, { comp }, [true, comp, owner]);
      expect(comp.disable).toBe(true);

      const setCompHidden = DuiBase.evalExpressionValueSetter('comp.hidden', argNames);
      DuiBase.evalExpression(setCompHidden, { comp }, [true, comp, owner]);
      expect(comp.hidden).toBe(true);

      const setPropsChecked = DuiBase.evalExpressionValueSetter('props.checked', argNames);
      DuiBase.evalExpression(setPropsChecked, { comp }, [true, comp, owner]);
      expect(comp.props.checked).toBe(true);

      const globalRec = globalThis as Record<string, unknown>;
      delete globalRec['disabled'];
      const setBareDisabled = DuiBase.evalExpressionValueSetter('disabled', argNames);
      DuiBase.evalExpression(setBareDisabled, { comp }, [true, comp, owner]);
      expect(comp.disabled).toBe(true);
      expect(globalRec['disabled']).toBeUndefined();

      // Direct call with `this.comp.disable`
      const setThisCompDisable = compileSafeValueSetter('this.comp.disable', argNames);
      setThisCompDisable.call({ comp }, false, comp, owner);
      expect(comp.disable).toBe(false);
    });
  });

  describe('multi-statement evalFunctionExpression', () => {
    it('executes multi-statement bodies with const/let/var, if/else, property mutations, method calls, and return', () => {
      const body = `
        const prefix = "BTN:";
        let count = btn.clicks || 0;
        count += 1;
        btn.clicks = count;
        if (count >= 2) {
          var status = prefix + "MULTI";
          owner.record(status);
          return status;
        } else {
          owner.record(prefix + "FIRST");
          return prefix + "FIRST";
        }
      `;
      const fn = DuiBase.evalFunctionExpression(body, ['btn', 'owner'])!;
      expect(typeof fn).toBe('function');

      const recorded: string[] = [];
      const btn: { clicks?: number } = {};
      const owner = {
        record(val: string): void {
          recorded.push(val);
        },
      };

      expect(fn(btn, owner)).toBe('BTN:FIRST');
      expect(btn.clicks).toBe(1);
      expect(fn(btn, owner)).toBe('BTN:MULTI');
      expect(btn.clicks).toBe(2);
      expect(recorded).toEqual(['BTN:FIRST', 'BTN:MULTI']);
    });

    it('returns undefined on invalid syntax instead of throwing out of DuiBase helpers', () => {
      const origError = console.error;
      console.error = (): void => {};
      try {
        expect(DuiBase.evalStringExpression('1 + * 2', ['a'])).toBeUndefined();
        expect(DuiBase.evalFunctionExpression('if (a { return 1;', ['a'])).toBeUndefined();
      } finally {
        console.error = origError;
      }
    });
  });

  describe('security blocks against prototype pollution and sandbox escapes', () => {
    it('blocks __proto__, constructor.constructor("return process")(), prototype, window, document, globalThis, Function, and eval', () => {
      const cleanProbe: Record<string, unknown> = {};

      // Setter blocks static and dynamic prototype pollution
      const protoSetter = DuiBase.evalExpressionValueSetter('__proto__.polluted', [
        'expressionValue',
        'comp',
      ]);
      protoSetter('yes', {});
      const compProtoSetter = DuiBase.evalExpressionValueSetter('comp.__proto__.polluted', [
        'expressionValue',
        'comp',
      ]);
      compProtoSetter('yes', {});
      const dynKeySetter = DuiBase.evalExpressionValueSetter('comp[badKey].polluted', [
        'expressionValue',
        'comp',
        'badKey',
      ]);
      dynKeySetter('yes', {}, '__proto__');
      const winSetter = DuiBase.evalExpressionValueSetter('window.hacked', [
        'expressionValue',
        'comp',
      ]);
      winSetter(true, {});

      expect(cleanProbe['polluted']).toBeUndefined();
      expect((globalThis as Record<string, unknown>)['hacked']).toBeUndefined();

      // Expression blocks constructor/prototype/global escapes
      const escapePayloads = [
        'comp.__proto__',
        'comp["__proto__"]',
        'comp["con" + "structor"]',
        '({}).constructor.constructor("return process")()',
        'comp.prototype',
        'window.location',
        'document.cookie',
        'globalThis.Function',
        'Function("return 1")()',
        'eval("1+1")',
        'setTimeout("alert(1)", 0)',
        'Object.setPrototypeOf({}, null)',
        'Object.defineProperty({}, "x", { value: 1 })',
      ];

      for (const payload of escapePayloads) {
        expect(() => {
          const compiled = compileSafeExpression(payload, ['comp']);
          compiled({});
        }).toThrow();
      }

      // Multi-statement body blocks assignment to __proto__ / constructor
      const badBody = compileSafeFunctionBody('comp["__proto__"].polluted = 1;', ['comp']);
      expect(() => badBody({})).toThrow();
      expect(cleanProbe['polluted']).toBeUndefined();
    });
  });
});

describe('XSS & Sanitizer Hardening', () => {
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    sanitizer = TestBed.inject(DomSanitizer);
  });

  it('MatCarouselSlideComponent escapes CSS url() breakout characters and blocks javascript: URLs', () => {
    const slideJs = new MatCarouselSlideComponent(sanitizer);
    slideJs.image = '  java\tscript:alert(1)  ';
    slideJs.ngOnInit();
    expect(String(slideJs.image)).toContain('none');
    expect(String(slideJs.image)).not.toContain('javascript');

    const slideBreakout = new MatCarouselSlideComponent(sanitizer);
    slideBreakout.image = 'https://example.com/a"b)c\\d\ne.png';
    slideBreakout.ngOnInit();
    const rendered = (slideBreakout.image as { changingThisBreaksApplicationSecurity?: string })
      .changingThisBreaksApplicationSecurity ?? '';
    expect(rendered).toBe('url("https://example.com/a\\"b\\)c\\\\de.png")');
  });

  it('PrintDirective HTML-escapes printTitle and blocks unsafe styleSheetFile hrefs', () => {
    const dir = new PrintDirective();
    dir.printTitle = '</title><script>window.__xss=1</script>';
    dir.styleSheetFile = 'javascript:alert(1),/assets/ok.css" onload="alert(1)';

    const writtenChunks: string[] = [];
    const origOpen = window.open;
    window.open = (() =>
      ({
        document: {
          open: (): void => {},
          write: (html: string): void => {
            writtenChunks.push(html);
          },
          close: (): void => {},
        },
      }) as unknown as Window) as typeof window.open;
    try {
      dir.print();
      const html = writtenChunks.join('');
      expect(html).toContain('&lt;/title&gt;&lt;script&gt;window.__xss=1&lt;/script&gt;');
      expect(html).not.toContain('</title><script>');
      expect(html).not.toContain('javascript:alert');
      expect(html).toContain('&quot; onload=&quot;alert(1)');
    } finally {
      window.open = origOpen;
    }
  });

  it('SafeurlPipe blocks javascript:/vbscript:/data:text/html in url/resourceUrl and forbids script', () => {
    const pipe = new SafeurlPipe(sanitizer);

    expect(() => pipe.transform('alert(1)', 'script')).toThrow(/forbidden/);

    const blockedUrl = pipe.transform('  JaVa\nScRiPt:alert(1)', 'url');
    expect(sanitizer.sanitize(SecurityContext.URL, blockedUrl)).toBe('');

    const blockedRes = pipe.transform('data:text/html,<script>alert(1)</script>', 'resourceUrl');
    expect(
      (blockedRes as { changingThisBreaksApplicationSecurity?: string })
        .changingThisBreaksApplicationSecurity
    ).toBe('');

    const blockedVb = pipe.transform('vbscript:msgbox(1)', 'url');
    expect(sanitizer.sanitize(SecurityContext.URL, blockedVb)).toBe('');

    const validUrl = pipe.transform('https://dotos.com/docs', 'url');
    expect(sanitizer.sanitize(SecurityContext.URL, validUrl)).toBe('https://dotos.com/docs');
  });
});
