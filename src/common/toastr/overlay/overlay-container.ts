import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, OnDestroy } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class OverlayContainer implements OnDestroy {
  protected _containerElement: HTMLElement;

  constructor(@Inject(DOCUMENT) protected _document: any) {}

  ngOnDestroy() {
    if (this._containerElement && this._containerElement.parentNode) {
      this._containerElement.parentNode.removeChild(this._containerElement);
    }
  }


  /**
   * Returns (creating if necessary) the shared overlay container element appended to `document.body`.
   * @zh 返回（必要时创建）附加到 `document.body` 的共享覆盖层容器元素。
   */
  getContainerElement(): HTMLElement {
    if (!this._containerElement) {
      this._createContainer();
    }
    return this._containerElement;
  }


  protected _createContainer(): void {
    const container = this._document.createElement('div');
    container.classList.add('overlay-container');
    this._document.body.appendChild(container);
    this._containerElement = container;
  }
}
