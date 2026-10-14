import {
  Component, ElementRef, EventEmitter,
  Input, OnDestroy, Output, ViewChild,
} from '@angular/core';
import { EditorView } from 'prosemirror-view';

@Component({
  selector: 'ux-image-view',
  templateUrl: './image-view.component.html',
  styleUrls: ['./image-view.component.scss'],
  
})

export class ImageViewComponent implements OnDestroy {
  @Input() src: string;
  @Input() alt = '';
  @Input() title = '';
  @Input() outerWidth = '';
  @Input() selected = false;
  @Input() view: EditorView;

  @Output() imageResize = new EventEmitter();

  @ViewChild('imgEl', { static: true }) imgEl: ElementRef;

  private activeCleanup?: () => void;

  startResizing(e: MouseEvent, direction: string): void {
    e.preventDefault();
    this.resizeImage(e, direction);
  }

  resizeImage(evt: MouseEvent, direction: string): void {
    this.activeCleanup?.();
    const startX = evt.pageX;
    const startWidth = this.imgEl.nativeElement.clientWidth;

    const isLeftResize = direction === 'left';

    const { width } = window.getComputedStyle(this.view.dom);
    const editorWidth = parseInt(width, 10);

    const onMouseMove = (e: MouseEvent) => {
      const currentX = e.pageX;
      const diffInPx = currentX - startX;
      const computedWidth = isLeftResize ? startWidth - diffInPx : startWidth + diffInPx;

      // prevent image overflow the editor
      // prevent resizng below 20px
      if (computedWidth > editorWidth || computedWidth < 20) {
        return;
      }

      this.outerWidth = `${computedWidth}px`;
    };

    const cleanup = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      this.activeCleanup = undefined;
    };

    const onMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      cleanup();
      this.imageResize.emit();
    };

    this.activeCleanup = cleanup;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  ngOnDestroy(): void {
    this.activeCleanup?.();
  }
}
