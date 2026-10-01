
import { OverlayRef } from '@angular/cdk/overlay';
export class ContextMenuOverlayRef {
  constructor(public overlayRef: OverlayRef) { }
  close(): void {
    this.overlayRef.dispose();
  }
}
