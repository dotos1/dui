import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

declare const jest: any;

setupZoneTestEnv();

interface JasmineCallInfo {
  args: unknown[];
  object: unknown;
  returnValue: unknown;
}

function enhanceJestMockWithJasmineApi<T extends (...args: any[]) => any>(
  mockFn: any,
  originalFn?: T,
  targetObj?: unknown,
): any {
  if (mockFn.__jasmineEnhanced) {
    return mockFn;
  }
  Object.defineProperty(mockFn, '__jasmineEnhanced', { value: true, enumerable: false });

  const andApi = {
    returnValue(val: unknown) {
      mockFn.mockReturnValue(val);
      return mockFn;
    },
    returnValues(...vals: unknown[]) {
      for (const v of vals) {
        mockFn.mockReturnValueOnce(v);
      }
      return mockFn;
    },
    callFake(fn: (...args: unknown[]) => unknown) {
      mockFn.mockImplementation(fn);
      return mockFn;
    },
    callThrough() {
      if (originalFn) {
        mockFn.mockImplementation(function (this: unknown, ...args: unknown[]) {
          return originalFn.apply(this ?? targetObj, args);
        });
      }
      return mockFn;
    },
    stub() {
      mockFn.mockImplementation(() => undefined);
      return mockFn;
    },
    throwError(err: string | Error) {
      const errorObj = typeof err === 'string' ? new Error(err) : err;
      mockFn.mockImplementation(() => {
        throw errorObj;
      });
      return mockFn;
    },
    resolveTo(val?: unknown) {
      mockFn.mockResolvedValue(val);
      return mockFn;
    },
    rejectWith(err?: unknown) {
      mockFn.mockRejectedValue(err);
      return mockFn;
    },
  };

  const callsApi = {
    count(): number {
      return mockFn.mock.calls.length;
    },
    any(): boolean {
      return mockFn.mock.calls.length > 0;
    },
    argsFor(index: number): unknown[] {
      return mockFn.mock.calls[index] ?? [];
    },
    allArgs(): unknown[][] {
      return mockFn.mock.calls;
    },
    all(): JasmineCallInfo[] {
      return mockFn.mock.calls.map((args: unknown[], idx: number) => ({
        args,
        object: mockFn.mock.contexts ? mockFn.mock.contexts[idx] : undefined,
        returnValue: mockFn.mock.results[idx]?.value,
      }));
    },
    mostRecent(): JasmineCallInfo | undefined {
      const len = mockFn.mock.calls.length;
      if (len === 0) {
        return undefined;
      }
      const idx = len - 1;
      return {
        args: mockFn.mock.calls[idx],
        object: mockFn.mock.contexts ? mockFn.mock.contexts[idx] : undefined,
        returnValue: mockFn.mock.results[idx]?.value,
      };
    },
    first(): JasmineCallInfo | undefined {
      if (mockFn.mock.calls.length === 0) {
        return undefined;
      }
      return {
        args: mockFn.mock.calls[0],
        object: mockFn.mock.contexts ? mockFn.mock.contexts[0] : undefined,
        returnValue: mockFn.mock.results[0]?.value,
      };
    },
    reset(): void {
      mockFn.mockClear();
    },
  };

  Object.defineProperty(mockFn, 'and', { value: andApi, configurable: true });
  Object.defineProperty(mockFn, 'calls', { value: callsApi, configurable: true });
  return mockFn;
}

const g: any = globalThis;
const jestExpect: any = expect;

if (typeof window !== 'undefined') {
  if (typeof window.matchMedia !== 'function') {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      }),
    });
  }
}

if (typeof g.ResizeObserver === 'undefined') {
  g.ResizeObserver = class MockResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  };
}

g.spyOn = function spyOnCompat(target: any, methodName: string): any {
  const original = typeof target[methodName] === 'function' ? target[methodName] : undefined;
  const spy: any = jest.spyOn(target, methodName);
  spy.mockImplementation(() => undefined);
  return enhanceJestMockWithJasmineApi(spy, original, target);
};

g.fail = function failCompat(reason?: string | Error): never {
  throw typeof reason === 'string' ? new Error(reason) : (reason ?? new Error('Test failed via fail()'));
};

g.jasmine = {
  ...(g.jasmine ?? {}),
  createSpy(name?: string, originalFn?: (...args: any[]) => any) {
    const fn: any = jest.fn();
    if (name) {
      fn.mockName(name);
    }
    return enhanceJestMockWithJasmineApi(fn, originalFn);
  },
  createSpyObj(
    baseNameOrMethodNames: string | ReadonlyArray<string>,
    methodNamesOrProps?: ReadonlyArray<string> | Record<string, unknown>,
    propertyNames?: ReadonlyArray<string> | Record<string, unknown>,
  ) {
    const obj: any = {};
    const methods = Array.isArray(baseNameOrMethodNames)
      ? baseNameOrMethodNames
      : methodNamesOrProps;
    const props = Array.isArray(baseNameOrMethodNames) ? methodNamesOrProps : propertyNames;

    if (Array.isArray(methods)) {
      for (const m of methods) {
        obj[m] = g.jasmine.createSpy(m);
      }
    } else if (methods && typeof methods === 'object') {
      for (const [k, v] of Object.entries(methods)) {
        const spy = g.jasmine.createSpy(k);
        spy.and.returnValue(v);
        obj[k] = spy;
      }
    }

    if (Array.isArray(props)) {
      for (const p of props) {
        obj[p] = undefined;
      }
    } else if (props && typeof props === 'object') {
      for (const [k, v] of Object.entries(props)) {
        obj[k] = v;
      }
    }
    return obj;
  },
  any: (ctor: any) => jestExpect.any(ctor),
  anything: () => jestExpect.anything(),
  objectContaining: (sample: Record<string, unknown>) => jestExpect.objectContaining(sample),
  arrayContaining: (sample: unknown[]) => jestExpect.arrayContaining(sample),
  stringMatching: (pattern: string | RegExp) => jestExpect.stringMatching(pattern),
};

if (typeof jestExpect !== 'undefined' && typeof jestExpect.extend === 'function') {
  jestExpect.extend({
    toBeTrue(received: unknown) {
      const pass = received === true;
      return {
        pass,
        message: () => `expected ${String(received)} ${pass ? 'not ' : ''}to be true`,
      };
    },
    toBeFalse(received: unknown) {
      const pass = received === false;
      return {
        pass,
        message: () => `expected ${String(received)} ${pass ? 'not ' : ''}to be false`,
      };
    },
    toThrowError(received: () => unknown, expected?: string | RegExp | Error) {
      let threw = false;
      let thrown: unknown;
      try {
        received();
      } catch (err) {
        threw = true;
        thrown = err;
      }
      if (!threw) {
        return {
          pass: false,
          message: () => 'expected function to throw an Error, but it did not throw',
        };
      }
      const message = thrown instanceof Error ? thrown.message : String(thrown);
      let pass = true;
      if (typeof expected === 'string') {
        pass = message.includes(expected);
      } else if (expected instanceof RegExp) {
        pass = expected.test(message);
      } else if (expected instanceof Error) {
        pass = message === expected.message;
      }
      return {
        pass,
        message: () =>
          `expected function ${pass ? 'not ' : ''}to throw error matching ${String(expected)}, got "${message}"`,
      };
    },
  });
}

afterEach(() => {
  jest.restoreAllMocks();
});
