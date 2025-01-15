import { Component, Input, ElementRef, Renderer2 } from '@angular/core';


@Component({
  selector: 'split-gutter',
  styleUrls: ['./split.component.scss'],
  template: '<span class="Resizer"></span>',
  host: { 'hostID': crypto.randomUUID().toString()}
})
export class SplitComponent {

  @Input() set order(v: number) {
    this.renderer.setStyle(this.elRef.nativeElement, 'order', v);
  }

  private _fxLayout: 'row' | 'column';

  @Input() set direction(v: 'row' | 'column') {
    this._fxLayout = v;
    this.refreshStyle();
  }

  get direction(): 'row' | 'column' {
    return this._fxLayout;
  }

  private _disabled: boolean = false;

  @Input() set disabled(v: boolean) {
    this._disabled = v;
    this.refreshStyle();
  }

  get disabled(): boolean {
    return this._disabled;
  }

  @Input() set useTransition(v: boolean) {
    if (v) {
      this.renderer.setStyle(this.elRef.nativeElement, 'transition', `flex-basis 0.3s`);
    } else {
      this.renderer.removeStyle(this.elRef.nativeElement, 'transition');
    }
  }

  private _size: number;

  @Input() set size(v: number) {
    this._size = v;
    this.refreshStyle();
  }

  get size(): number {
    return this._size;
  }

  constructor(private elRef: ElementRef,
    private renderer: Renderer2) { }


  private _color: string;

  @Input() set color(v: string) {
    this._color = v;
    this.refreshStyle();
  }

  get color(): string {
    return this._color;
  }

  private refreshStyle(): void {
    const span = this.elRef.nativeElement.children[0];
    this.renderer.setStyle(this.elRef.nativeElement, 'flex-basis', `${this.size}px`);
    this.renderer.setStyle(this.elRef.nativeElement, 'background-color', (this.color !== '') ? this.color : `#eeeeee`);
    const state: 'disabled' | 'row' | 'column' = (this.disabled === true) ? 'disabled' : this.direction;
    this.renderer.addClass(span, this.getCSS(state));
    this.renderer.setStyle(this.elRef.nativeElement, 'cursor', this.getCursor(state));
  }
  private getCSS(state: 'disabled' | 'row' | 'column'): string {
      switch (state) {
          case 'row':
              return 'vertical';
          case 'column':
              return 'horizontal';
          case 'disabled':
              return '';
      }
  }
  private getCursor(state: 'disabled' | 'row' | 'column'): string {
    switch (state) {
      case 'row':
        return 'col-resize';
      case 'column':
        return 'row-resize';
      case 'disabled':
        return 'default';
    }
  }
}
