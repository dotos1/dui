/**
 * @fileoverview Module `src/common/colorpicker/components/gradient/hooks/paint-hue.service.ts` providing paint hue service definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/gradient/hooks/paint-hue.service.ts`，提供绘制色相服务相关的定义与实现。
 */

import { Injectable } from '@angular/core';
import tinycolor from 'tinycolor2';

/**
 * Injectable Angular service `PaintHueService` managing paint hue service state and operations in `src/common/colorpicker/components/gradient/hooks`.
 * @zh 可注入的 Angular 服务 `PaintHueService`，管理 `src/common/colorpicker/components/gradient/hooks` 中的绘制色相服务状态与业务操作。
 */
@Injectable({
  providedIn: 'root'
})
export class PaintHueService {
  /**
   * Executes `paintLight` to handle paint light.
   * @zh 执行 `paintLight`，用于绘制浅色。
   * @param canvas - canvas parameter (`any`) / 画布参数（`any`）
   * @param h - h parameter (`number`) / h参数（`number`）
   * @param s - s parameter (`number`) / s参数（`number`）
   * @param squareWidth - square width parameter (`number`) / square宽度参数（`number`）
   */
  public paintLight(canvas, h: number, s: number, squareWidth: number) {
    const ctx = canvas?.current?.getContext('2d', { willReadFrequently: true });
    if (ctx) {
      ctx.rect(0, 0, squareWidth, 14);
      const gradient = ctx.createLinearGradient(0, 0, squareWidth, 0);
      for (let i = 0; i <= 100; i += 10) {
        gradient.addColorStop(i / 100, `hsl(${h}, ${s}%, ${i}%)`);
      }
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }

  /**
   * Executes `paintHue` to handle paint hue.
   * @zh 执行 `paintHue`，用于绘制色相。
   * @param canvas - canvas parameter (`any`) / 画布参数（`any`）
   * @param squareWidth - square width parameter (`number`) / square宽度参数（`number`）
   */
  public paintHue(canvas, squareWidth: number) {
    const ctx = canvas?.current?.getContext('2d', { willReadFrequently: true });
    if (ctx) {
      ctx.rect(0, 0, squareWidth, 14);
      const gradient = ctx.createLinearGradient(0, 0, squareWidth, 0);
      for (let i = 0; i <= 360; i += 30) {
        gradient.addColorStop(i / 360, `hsl(${i}, 100%, 50%)`);
      }
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }

  /**
   * Executes `paintBright` to handle paint bright.
   * @zh 执行 `paintBright`，用于绘制Bright。
   * @param canvas - canvas parameter (`HTMLCanvasElement`) / 画布参数（`HTMLCanvasElement`）
   * @param h - h parameter (`number`) / h参数（`number`）
   * @param s - s parameter (`number`) / s参数（`number`）
   * @param squareWidth - square width parameter (`number`) / square宽度参数（`number`）
   */
  public paintBright(
    canvas: HTMLCanvasElement,
    h: number,
    s: number,
    squareWidth: number
  ) {
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    if (ctx) {
      ctx.rect(0, 0, squareWidth, 14);
      const gradient = ctx.createLinearGradient(0, 0, squareWidth, 0);
      for (let i = 0; i <= 100; i += 10) {
        const hsl = tinycolor({ h: h, s: s, v: i });
        gradient.addColorStop(i / 100, hsl.toHslString());
      }
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }

  /**
   * Property `paintSat` (`any`) storing paint sat.
   * @zh 属性 `paintSat`（类型：`any`），用于存储或配置绘制Sat。
   */
  public paintSat = (
    canvas: { current? },
    h: number,
    l: number,
    squareWidth: number
  ) => {
    const ctx = canvas?.current?.getContext('2d', { willReadFrequently: true });
    if (ctx) {
      ctx.rect(0, 0, squareWidth, 14);
      const gradient = ctx.createLinearGradient(0, 0, squareWidth, 0);
      for (let i = 0; i <= 100; i += 10) {
        gradient.addColorStop(i / 100, `hsl(${h}, ${i}%, ${l}%)`);
      }
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  };

  /**
   * Executes `paintSquare` to handle paint square.
   * @zh 执行 `paintSquare`，用于绘制Square。
   * @param canvas - canvas parameter (`any`) / 画布参数（`any`）
   * @param hue - hue parameter (`number`) / 色相参数（`number`）
   * @param squareWidth - square width parameter (`number`) / square宽度参数（`number`）
   * @param squareHeight - square height parameter (`number`) / square高度参数（`number`）
   */
  paintSquare(
    canvas,
    hue: number,
    squareWidth: number,
    squareHeight: number
  ) {
    if (canvas.current) {
      const ctx = canvas.current.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        ctx.fillRect(0, 0, squareWidth, squareHeight);
        const gradientWhite = ctx.createLinearGradient(0, 0, squareWidth, 0);
        gradientWhite.addColorStop(0, `rgba(255, 255, 255, 1)`);
        gradientWhite.addColorStop(1, `rgba(255, 255, 255, 0)`);
        ctx.fillStyle = gradientWhite;
        ctx.fillRect(0, 0, squareWidth, squareHeight);
        const gradientBlack = ctx.createLinearGradient(0, 0, 0, squareHeight);
        gradientBlack.addColorStop(0, `rgba(0, 0, 0, 0)`);
        gradientBlack.addColorStop(1, `rgba(0, 0, 0, 1)`);
        ctx.fillStyle = gradientBlack;
        ctx.fillRect(0, 0, squareWidth, squareHeight);
      }
    }
  }
}
