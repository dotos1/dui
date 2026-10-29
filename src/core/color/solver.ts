/**
 * @fileoverview Module `src/core/color/solver.ts` providing solver definitions and implementation.
 * @zh 模块文件 `src/core/color/solver.ts`，提供solver相关的定义与实现。
 */


/**
 * Class `Color` encapsulating color data structures and logic in `src/core/color`.
 * @zh 类 `Color`，封装 `src/core/color` 中的颜色数据结构与处理逻辑。
 */
export class Color {
  /**
   * Property `r` (`any`) storing r.
   * @zh 属性 `r`（类型：`any`），用于存储或配置r。
   */
  public r;
  /**
   * Property `g` (`any`) storing g.
   * @zh 属性 `g`（类型：`any`），用于存储或配置g。
   */
  public g;
  /**
   * Property `b` (`any`) storing b.
   * @zh 属性 `b`（类型：`any`），用于存储或配置b。
   */
  public b;
  /**
   * Creates an instance of `Color` and initializes its dependencies and internal state.
   * @zh 创建 `Color` 实例，并初始化其依赖项与内部状态。
   * @param r - Injected or initial r (`any`) / 注入或传入的r（`any`）
   * @param g - Injected or initial g (`any`) / 注入或传入的g（`any`）
   * @param b - Injected or initial b (`any`) / 注入或传入的b（`any`）
   */
  constructor(r, g, b) {
    this.set(r, g, b);
  }

  /**
   * Executes `toString` to handle to string.
   * @zh 执行 `toString`，用于转换为字符串。
   */
  toString() {
    return `rgb(${Math.round(this.r)}, ${Math.round(this.g)}, ${Math.round(this.b)})`;
  }

  /**
   * Executes `set` to handle set.
   * @zh 执行 `set`，用于集合。
   * @param r - r parameter (`any`) / r参数（`any`）
   * @param g - g parameter (`any`) / g参数（`any`）
   * @param b - b parameter (`any`) / b参数（`any`）
   */
  set(r, g, b) {
    this.r = this.clamp(r);
    this.g = this.clamp(g);
    this.b = this.clamp(b);
  }

  /**
   * Executes `hueRotate` to handle hue rotate.
   * @zh 执行 `hueRotate`，用于色相旋转。
   * @param angle - angle parameter (`number`) / 角度参数（`number`）
   */
  hueRotate(angle = 0) {
    angle = angle / 180 * Math.PI;
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    this.multiply([
      0.213 + cos * 0.787 - sin * 0.213,
      0.715 - cos * 0.715 - sin * 0.715,
      0.072 - cos * 0.072 + sin * 0.928,
      0.213 - cos * 0.213 + sin * 0.143,
      0.715 + cos * 0.285 + sin * 0.140,
      0.072 - cos * 0.072 - sin * 0.283,
      0.213 - cos * 0.213 - sin * 0.787,
      0.715 - cos * 0.715 + sin * 0.715,
      0.072 + cos * 0.928 + sin * 0.072,
    ]);
  }

  /**
   * Executes `grayscale` to handle grayscale.
   * @zh 执行 `grayscale`，用于grayscale。
   * @param value - value parameter (`number`) / 值参数（`number`）
   */
  grayscale(value = 1) {
    this.multiply([
      0.2126 + 0.7874 * (1 - value),
      0.7152 - 0.7152 * (1 - value),
      0.0722 - 0.0722 * (1 - value),
      0.2126 - 0.2126 * (1 - value),
      0.7152 + 0.2848 * (1 - value),
      0.0722 - 0.0722 * (1 - value),
      0.2126 - 0.2126 * (1 - value),
      0.7152 - 0.7152 * (1 - value),
      0.0722 + 0.9278 * (1 - value),
    ]);
  }

  /**
   * Executes `sepia` to handle sepia.
   * @zh 执行 `sepia`，用于sepia。
   * @param value - value parameter (`number`) / 值参数（`number`）
   */
  sepia(value = 1) {
    this.multiply([
      0.393 + 0.607 * (1 - value),
      0.769 - 0.769 * (1 - value),
      0.189 - 0.189 * (1 - value),
      0.349 - 0.349 * (1 - value),
      0.686 + 0.314 * (1 - value),
      0.168 - 0.168 * (1 - value),
      0.272 - 0.272 * (1 - value),
      0.534 - 0.534 * (1 - value),
      0.131 + 0.869 * (1 - value),
    ]);
  }

  /**
   * Executes `saturate` to handle saturate.
   * @zh 执行 `saturate`，用于saturate。
   * @param value - value parameter (`number`) / 值参数（`number`）
   */
  saturate(value = 1) {
    this.multiply([
      0.213 + 0.787 * value,
      0.715 - 0.715 * value,
      0.072 - 0.072 * value,
      0.213 - 0.213 * value,
      0.715 + 0.285 * value,
      0.072 - 0.072 * value,
      0.213 - 0.213 * value,
      0.715 - 0.715 * value,
      0.072 + 0.928 * value,
    ]);
  }

  /**
   * Executes `multiply` to handle multiply.
   * @zh 执行 `multiply`，用于multiply。
   * @param matrix - matrix parameter (`any`) / 矩阵参数（`any`）
   */
  multiply(matrix) {
    const newR = this.clamp(this.r * matrix[0] + this.g * matrix[1] + this.b * matrix[2]);
    const newG = this.clamp(this.r * matrix[3] + this.g * matrix[4] + this.b * matrix[5]);
    const newB = this.clamp(this.r * matrix[6] + this.g * matrix[7] + this.b * matrix[8]);
    this.r = newR;
    this.g = newG;
    this.b = newB;
  }

  /**
   * Executes `brightness` to handle brightness.
   * @zh 执行 `brightness`，用于明度。
   * @param value - value parameter (`number`) / 值参数（`number`）
   */
  brightness(value = 1) {
    this.linear(value);
  }
  /**
   * Executes `contrast` to handle contrast.
   * @zh 执行 `contrast`，用于对比度。
   * @param value - value parameter (`number`) / 值参数（`number`）
   */
  contrast(value = 1) {
    this.linear(value, -(0.5 * value) + 0.5);
  }

  /**
   * Executes `linear` to handle linear.
   * @zh 执行 `linear`，用于linear。
   * @param slope - slope parameter (`number`) / slope参数（`number`）
   * @param intercept - intercept parameter (`number`) / intercept参数（`number`）
   */
  linear(slope = 1, intercept = 0) {
    this.r = this.clamp(this.r * slope + intercept * 255);
    this.g = this.clamp(this.g * slope + intercept * 255);
    this.b = this.clamp(this.b * slope + intercept * 255);
  }

  /**
   * Executes `invert` to handle invert.
   * @zh 执行 `invert`，用于invert。
   * @param value - value parameter (`number`) / 值参数（`number`）
   */
  invert(value = 1) {
    this.r = this.clamp((value + this.r / 255 * (1 - 2 * value)) * 255);
    this.g = this.clamp((value + this.g / 255 * (1 - 2 * value)) * 255);
    this.b = this.clamp((value + this.b / 255 * (1 - 2 * value)) * 255);
  }

  /**
   * Executes `hsl` to handle hsl.
   * @zh 执行 `hsl`，用于HSL颜色。
   */
  hsl() {
    // Code taken from https://stackoverflow.com/a/9493060/2688027, licensed under CC BY-SA.
    const r = this.r / 255;
    const g = this.g / 255;
    const b = this.b / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;

        case g:
          h = (b - r) / d + 2;
          break;

        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: h * 100,
      s: s * 100,
      l: l * 100,
    };
  }

  /**
   * Executes `clamp` to handle clamp.
   * @zh 执行 `clamp`，用于限制范围。
   * @param value - value parameter (`any`) / 值参数（`any`）
   */
  clamp(value) {
    if (value > 255) {
      value = 255;
    } else if (value < 0) {
      value = 0;
    }
    return value;
  }
}

/**
 * Class `Solver` encapsulating solver data structures and logic in `src/core/color`.
 * @zh 类 `Solver`，封装 `src/core/color` 中的Solver数据结构与处理逻辑。
 */
export class Solver {

  /**
   * Executes `hexToRgb` to handle hex to rgb.
   * @zh 执行 `hexToRgb`，用于十六进制颜色转换为RGB颜色。
   * @param hex - hex parameter (`any`) / 十六进制颜色参数（`any`）
   */
  public static hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => {
      return r + r + g + g + b + b;
    });
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
      : null;
  }

  /**
   * Property `target` (`any`) storing target.
   * @zh 属性 `target`（类型：`any`），用于存储或配置目标。
   */
  public target;
  /**
   * Property `targetHSL` (`any`) storing target hsl.
   * @zh 属性 `targetHSL`（类型：`any`），用于存储或配置目标HSL颜色。
   */
  public targetHSL;
  /**
   * Property `reusedColor` (`any`) storing reused color.
   * @zh 属性 `reusedColor`（类型：`any`），用于存储或配置reused颜色。
   */
  public reusedColor;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Creates an instance of `Solver` and initializes its dependencies and internal state.
   * @zh 创建 `Solver` 实例，并初始化其依赖项与内部状态。
   * @param target - Injected or initial target (`any`) / 注入或传入的目标（`any`）
   * @param baseColor - Injected or initial base color (`any`) / 注入或传入的基础颜色（`any`）
   */
  constructor(target, baseColor?) {
    this.target = target;
    this.targetHSL = target.hsl();
    this.reusedColor = new Color(0, 0, 0);
  }

  /**
   * Executes `solve` to handle solve.
   * @zh 执行 `solve`，用于solve。
   */
  solve() {
    const result = this.solveNarrow(this.solveWide());
    return {
      values: result.values,
      loss: result.loss,
      filter: this.css(result.values),
    };
  }

  /**
   * Executes `solveWide` to handle solve wide.
   * @zh 执行 `solveWide`，用于solveWide。
   */
  solveWide() {
    const A = 5;
    const c = 15;
    const a = [60, 180, 18000, 600, 1.2, 1.2];

    let best = { loss: Infinity };
    for (let i = 0; best.loss > 25 && i < 3; i++) {
      const initial = [50, 20, 3750, 50, 100, 100];
      const result = this.spsa(A, a, c, initial, 1000);
      if (result.loss < best.loss) {
        best = result;
      }
    }
    return best;
  }

  /**
   * Executes `solveNarrow` to handle solve narrow.
   * @zh 执行 `solveNarrow`，用于solveNarrow。
   * @param wide - wide parameter (`any`) / wide参数（`any`）
   */
  solveNarrow(wide) {
    const A = wide.loss;
    const c = 2;
    const A1 = A + 1;
    const a = [0.25 * A1, 0.25 * A1, A1, 0.25 * A1, 0.2 * A1, 0.2 * A1];
    return this.spsa(A, a, c, wide.values, 500);
  }

  /**
   * Executes `spsa` to handle spsa.
   * @zh 执行 `spsa`，用于spsa。
   * @param A - a parameter (`any`) / A参数（`any`）
   * @param a - a parameter (`any`) / a参数（`any`）
   * @param c - c parameter (`any`) / c参数（`any`）
   * @param values - values parameter (`any`) / 值列表参数（`any`）
   * @param iters - iters parameter (`any`) / iters参数（`any`）
   */
  spsa(A, a, c, values, iters) {
    const alpha = 1;
    const gamma = 0.16666666666666666;

    let best = null;
    let bestLoss = Infinity;
    const deltas = new Array(6);
    const highArgs = new Array(6);
    const lowArgs = new Array(6);

    for (let k = 0; k < iters; k++) {
      const ck = c / Math.pow(k + 1, gamma);
      for (let i = 0; i < 6; i++) {
        deltas[i] = Math.random() > 0.5 ? 1 : -1;
        highArgs[i] = values[i] + ck * deltas[i];
        lowArgs[i] = values[i] - ck * deltas[i];
      }

      const lossDiff = this.loss(highArgs) - this.loss(lowArgs);
      for (let i = 0; i < 6; i++) {
        const g = lossDiff / (2 * ck) * deltas[i];
        const ak = a[i] / Math.pow(A + k + 1, alpha);
        values[i] = fix(values[i] - ak * g, i);
      }

      const loss = this.loss(values);
      if (loss < bestLoss) {
        best = values.slice(0);
        bestLoss = loss;
      }
    }
    return { values: best, loss: bestLoss };

    function fix(value, idx) {
      let max = 100;
      if (idx === 2 /* saturate */) {
        max = 7500;
      } else if (idx === 4 /* brightness */ || idx === 5 /* contrast */) {
        max = 200;
      }

      if (idx === 3 ) {
        if (value > max) {
          value %= max;
        } else if (value < 0) {
          value = max + value % max;
        }
      } else if (value < 0) {
        value = 0;
      } else if (value > max) {
        value = max;
      }
      return value;
    }
  }

  /**
   * Executes `loss` to handle loss.
   * @zh 执行 `loss`，用于loss。
   * @param filters - filters parameter (`any`) / 过滤器列表参数（`any`）
   */
  loss(filters) {
    // Argument is array of percentages.
    const color = this.reusedColor;
    color.set(0, 0, 0);

    color.invert(filters[0] / 100);
    color.sepia(filters[1] / 100);
    color.saturate(filters[2] / 100);
    color.hueRotate(filters[3] * 3.6);
    color.brightness(filters[4] / 100);
    color.contrast(filters[5] / 100);

    const colorHSL = color.hsl();
    return (
      Math.abs(color.r - this.target.r) +
      Math.abs(color.g - this.target.g) +
      Math.abs(color.b - this.target.b) +
      Math.abs(colorHSL.h - this.targetHSL.h) +
      Math.abs(colorHSL.s - this.targetHSL.s) +
      Math.abs(colorHSL.l - this.targetHSL.l)
    );
  }
  /**
   * Executes `css` to handle css.
   * @zh 执行 `css`，用于CSS样式。
   * @param filters - filters parameter (`any`) / 过滤器列表参数（`any`）
   */
  css(filters) {
    function fmt(idx, multiplier = 1) {
      return Math.round(filters[idx] * multiplier);
    }
    return `invert(${fmt(0)}%) sepia(${fmt(1)}%) saturate(${fmt(2)}%) hue-rotate(${fmt(3, 3.6)}deg) brightness(${fmt(4)}%) contrast(${fmt(5)}%)`;
  }
}
