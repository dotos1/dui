import { Injectable } from '@angular/core';
import tinycolor from 'tinycolor2';

@Injectable({
  providedIn: 'root'
})
export class PaintHueService {
  public paintLight(canvas: any, h: number, s: number, squareWidth: number) {
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

  public paintHue(canvas: any, squareWidth: number) {
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

  public paintSat = (
    canvas: any,
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

  paintSquare(
    canvas: any,
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
