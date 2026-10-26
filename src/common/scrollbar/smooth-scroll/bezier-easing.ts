/**
 * https://github.com/gre/bezier-easing
 * BezierEasing - use bezier curve for transition easing function
 * by Gaëtan Renaudeau 2014 - 2015 – MIT License

 * @zh 常量/变量 `NEWTON_ITERATIONS`，定义 `src/common/scrollbar/smooth-scroll` 中的NEWTONITERATIONS。
 */

// These values are established by empiricism with tests (tradeoff: performance VS precision)
const NEWTON_ITERATIONS: number = 4;
/**
 * Constant/variable `NEWTON_MIN_SLOPE` defining newton min slope in `src/common/scrollbar/smooth-scroll`.
 * @zh 常量/变量 `NEWTON_MIN_SLOPE`，定义 `src/common/scrollbar/smooth-scroll` 中的NEWTON最小值SLOPE。
 */
const NEWTON_MIN_SLOPE: number = 0.001;
/**
 * Constant/variable `SUBDIVISION_PRECISION` defining subdivision precision in `src/common/scrollbar/smooth-scroll`.
 * @zh 常量/变量 `SUBDIVISION_PRECISION`，定义 `src/common/scrollbar/smooth-scroll` 中的SUBDIVISIONPRECISION。
 */
const SUBDIVISION_PRECISION: number = 0.0000001;
/**
 * Constant/variable `SUBDIVISION_MAX_ITERATIONS` defining subdivision max iterations in `src/common/scrollbar/smooth-scroll`.
 * @zh 常量/变量 `SUBDIVISION_MAX_ITERATIONS`，定义 `src/common/scrollbar/smooth-scroll` 中的SUBDIVISION最大值ITERATIONS。
 */
const SUBDIVISION_MAX_ITERATIONS: number = 10;

/**
 * Constant/variable `kSplineTableSize` defining k spline table size in `src/common/scrollbar/smooth-scroll`.
 * @zh 常量/变量 `kSplineTableSize`，定义 `src/common/scrollbar/smooth-scroll` 中的k样条曲线表格尺寸。
 */
const kSplineTableSize: number = 11;
/**
 * Constant/variable `kSampleStepSize` defining k sample step size in `src/common/scrollbar/smooth-scroll`.
 * @zh 常量/变量 `kSampleStepSize`，定义 `src/common/scrollbar/smooth-scroll` 中的kSample步骤尺寸。
 */
const kSampleStepSize: number = 1.0 / (kSplineTableSize - 1.0);

/**
 * Constant/variable `float32ArraySupported` defining float32 array supported in `src/common/scrollbar/smooth-scroll`.
 * @zh 常量/变量 `float32ArraySupported`，定义 `src/common/scrollbar/smooth-scroll` 中的float32数组Supported。
 */
const float32ArraySupported: boolean = typeof Float32Array === 'function';

/**
 * Executes `A` to handle a.
 * @zh 执行 `A`，用于A。
 * @param aA1 - a a1 parameter (`number`) / aA1参数（`number`）
 * @param aA2 - a a2 parameter (`number`) / aA2参数（`number`）
 * @returns Result of type `number` / 类型为 `number` 的返回值
 */
function A(aA1: number, aA2: number): number {
  return 1.0 - 3.0 * aA2 + 3.0 * aA1;
}

/**
 * Executes `B` to handle b.
 * @zh 执行 `B`，用于B。
 * @param aA1 - a a1 parameter (`number`) / aA1参数（`number`）
 * @param aA2 - a a2 parameter (`number`) / aA2参数（`number`）
 * @returns Result of type `number` / 类型为 `number` 的返回值
 */
function B(aA1: number, aA2: number): number {
  return 3.0 * aA2 - 6.0 * aA1;
}

/**
 * Executes `C` to handle c.
 * @zh 执行 `C`，用于C。
 * @param aA1 - a a1 parameter (`number`) / aA1参数（`number`）
 * @returns Result of type `number` / 类型为 `number` 的返回值
 */
function C(aA1: number): number {
  return 3.0 * aA1;
}

// Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
/**
 * Executes `calcBezier` to handle calc bezier.
 * @zh 执行 `calcBezier`，用于计算Bezier。
 * @param aT - a t parameter (`number`) / aT参数（`number`）
 * @param aA1 - a a1 parameter (`number`) / aA1参数（`number`）
 * @param aA2 - a a2 parameter (`number`) / aA2参数（`number`）
 * @returns Result of type `number` / 类型为 `number` 的返回值
 */
function calcBezier(aT: number, aA1: number, aA2: number): number {
  return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
}

// Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
/**
 * Executes `getSlope` to handle get slope.
 * @zh 执行 `getSlope`，用于获取Slope。
 * @param aT - a t parameter (`number`) / aT参数（`number`）
 * @param aA1 - a a1 parameter (`number`) / aA1参数（`number`）
 * @param aA2 - a a2 parameter (`number`) / aA2参数（`number`）
 * @returns Result of type `number` / 类型为 `number` 的返回值
 */
function getSlope(aT: number, aA1: number, aA2: number): number {
  return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
}

/**
 * Executes `binarySubdivide` to handle binary subdivide.
 * @zh 执行 `binarySubdivide`，用于binarySubdivide。
 * @param aX - a x parameter (`number`) / aX坐标参数（`number`）
 * @param aA - a a parameter (`number`) / aA参数（`number`）
 * @param aB - a b parameter (`number`) / aB参数（`number`）
 * @param mX1 - m x1 parameter (`number`) / mX1参数（`number`）
 * @param mX2 - m x2 parameter (`number`) / mX2参数（`number`）
 */
function binarySubdivide(aX: number, aA: number, aB: number, mX1: number, mX2: number) {
  let currentX, currentT, i: number = 0;
  do {
    currentT = aA + (aB - aA) / 2.0;
    currentX = calcBezier(currentT, mX1, mX2) - aX;
    if (currentX > 0.0) {
      aB = currentT;
    } else {
      aA = currentT;
    }
  } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
  return currentT;
}

/**
 * Executes `newtonRaphsonIterate` to handle newton raphson iterate.
 * @zh 执行 `newtonRaphsonIterate`，用于newtonRaphsonIterate。
 * @param aX - a x parameter (`number`) / aX坐标参数（`number`）
 * @param aGuessT - a guess t parameter (`number`) / aGuessT参数（`number`）
 * @param mX1 - m x1 parameter (`number`) / mX1参数（`number`）
 * @param mX2 - m x2 parameter (`number`) / mX2参数（`number`）
 * @returns Result of type `number` / 类型为 `number` 的返回值
 */
function newtonRaphsonIterate(aX: number, aGuessT: number, mX1: number, mX2: number): number {
  for (let i: number = 0; i < NEWTON_ITERATIONS; ++i) {
    const currentSlope: number = getSlope(aGuessT, mX1, mX2);
    if (currentSlope === 0.0) {
      return aGuessT;
    }
    const currentX: number = calcBezier(aGuessT, mX1, mX2) - aX;
    aGuessT -= currentX / currentSlope;
  }
  return aGuessT;
}

/**
 * Executes `LinearEasing` to handle linear easing.
 * @zh 执行 `LinearEasing`，用于LinearEasing。
 * @param x - x parameter (`number`) / X坐标参数（`number`）
 * @returns Result of type `number` / 类型为 `number` 的返回值
 */
function LinearEasing(x: number): number {
  return x;
}

/**
 * Executes `bezier` to handle bezier.
 * @zh 执行 `bezier`，用于bezier。
 * @param mX1 - m x1 parameter (`number`) / mX1参数（`number`）
 * @param mY1 - m y1 parameter (`number`) / mY1参数（`number`）
 * @param mX2 - m x2 parameter (`number`) / mX2参数（`number`）
 * @param mY2 - m y2 parameter (`number`) / mY2参数（`number`）
 */
export default function bezier(mX1: number, mY1: number, mX2: number, mY2: number) {
  if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
    throw new Error('bezier x values must be in [0, 1] range');
  }

  if (mX1 === mY1 && mX2 === mY2) {
    return LinearEasing;
  }

  // Precompute samples table
  const sampleValues: number[] | Float32Array = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
  for (let i: number = 0; i < kSplineTableSize; ++i) {
    sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
  }

  function getTForX(aX: number): number {
    let intervalStart: number = 0.0;
    let currentSample: number = 1;
    const lastSample: number = kSplineTableSize - 1;

    for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
      intervalStart += kSampleStepSize;
    }
    --currentSample;

    // Interpolate to provide an initial guess for t
    const dist: number = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
    const guessForT: number = intervalStart + dist * kSampleStepSize;

    const initialSlope: number = getSlope(guessForT, mX1, mX2);
    if (initialSlope >= NEWTON_MIN_SLOPE) {
      return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
    } else if (initialSlope === 0.0) {
      return guessForT;
    } else {
      return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
    }
  }

  return function BezierEasing(x: number): number {
    // Because JavaScript number are imprecise, we should guarantee the extremes are right.
    if (x === 0) {
      return 0;
    }
    if (x === 1) {
      return 1;
    }
    return calcBezier(getTForX(x), mY1, mY2);
  };
}
