export interface IPoint {
  x: number;
  y: number;
}

export interface ISize {
  width: number;
  height: number;
}

export interface IRectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IPositionEvent {
  size: ISize;
  position: IPoint;
  direction: string;
}

export interface IPositionState {
  currentSize: ISize;
  startSize: ISize;
  currentPosition: IPoint;
  startPosition: IPoint;
  direction: string;
  isResizing: boolean;
  isMoving: boolean;
}

export interface IPosionOptions {
  minSize: ISize;
  maxSize: ISize;
  grid: ISize;
  directions: string[];
  resizable: boolean;
  bound: IRectangle;
  ratio: number;
}

export interface IResizable {
   width: number;
   height: number;
   x: number;
   y: number;
   maxWidth: number;
   minWidth: number;
   maxHeight: number;
   minHeight: number;
   resizable: boolean;
   directions: string[];
   grid?: ISize ;
   bound?: IRectangle;
   ratio?: number;
}
