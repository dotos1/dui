import {
  ISize,
  IPositionState,
  IRectangle,
} from './position.common';
import { Injectable } from "@angular/core";

export const defaultGrid: ISize = {
  width: 1,
  height: 1
};

export const defaultBound: IRectangle = {
  x: -Infinity,
  y: -Infinity,
  width: Infinity,
  height: Infinity
};

@Injectable()
export class PositionStore {
  state: IPositionState = {
    currentSize: { width: 0, height: 0 },
    startSize: { width: 0, height: 0 },
    currentPosition: { x: 0, y: 0 },
    startPosition: { x: 0, y: 0 },
    isResizing: false,
    isMoving: false,
    direction: null
  };

  private reducers: any[] = [];

  addReducer(reducer: any) {
    this.reducers.push(reducer);
  }

  emitAction(action: any, ...params: any[]) {
    this.state = this.reducers.reduce((p: IPositionState, c: any) => {
      // eslint-disable-next-line prefer-spread
      return c.apply(null, [p, action].concat(params));
    }, this.state);
  }
}
