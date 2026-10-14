import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { take, timer } from 'rxjs';
import { CommandItemGroup } from '../model/command-item-group';
import { CommandPaletteScrollCalculator, CommandPaletteScrollParams } from './command-palette-scroll-calculator';

@Component({
  selector: 'command-palette-content',
  templateUrl: './command-palette-content.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  
})
export class CommandPaletteContentComponent implements OnChanges, OnInit, AfterViewInit {

  @Input()
  groups: CommandItemGroup[] = [];

  @Input()
  selectedItemIndex: number = 0;

  @Output()
  readonly itemVisited$: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  readonly itemClicked$: EventEmitter<number> = new EventEmitter<number>();

  private disableMouseEnter: boolean = false;

  /** 搜索时每次按键都会重建 groups，trackBy 让未变化的分组/条目保留原 DOM。 */
  trackByGroupTitle = (_index: number, group: CommandItemGroup): any => group ? group.title : _index;
  trackByItemText = (_index: number, item: any): any => item ? item.text : _index;

  private elementRefNativeElem!: HTMLElement;
  private readonly scrollCalculator: CommandPaletteScrollCalculator = new CommandPaletteScrollCalculator();

  constructor(
    private readonly elementRef: ElementRef,
    @Inject(DOCUMENT) private readonly document: Document
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedItemIndex'] && !changes['selectedItemIndex'].firstChange) {
      this.scrollToSelectedItem();
    }
  }

  ngOnInit(): void {
    this.elementRefNativeElem = this.elementRef.nativeElement;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.scrollToSelectedItem();
    });
  }

  onMouseenter(index: number): void {
    if (this.disableMouseEnter) {
      return;
    }
    this.itemVisited$.next(index);
  }

  private scrollToSelectedItem(): void {
    this.disableMouseEnter = true;
    const selectedElement = this.document.querySelectorAll<HTMLElement>('.command-palette__content-item')[this.selectedItemIndex] as HTMLElement;
    if (!selectedElement) {
      this.disableMouseEnter = false;
      return;
    }
    const selectedElementTopPosition = selectedElement.offsetTop;
    const containerTopPosition = this.elementRefNativeElem.offsetTop;
    const containerScrollTop: number = this.elementRefNativeElem.scrollTop;
    const containerHeight: number = this.elementRefNativeElem.offsetHeight;
    const rowHeight: number = 40;

    const params: CommandPaletteScrollParams = {
      selectedElementTopPosition,
      containerTopPosition,
      containerScrollTop,
      containerHeight,
      rowHeight
    };

    const calculatedScrollTop = this.scrollCalculator.calculate(params);

    this.elementRefNativeElem.scroll({
      top: calculatedScrollTop < 0 ? 0 : calculatedScrollTop,
      behavior: 'auto'
    });

    timer(1)
      .pipe(take(1))
      .subscribe(() => this.disableMouseEnter = false)
  }
}
