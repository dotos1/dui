import { Component, Input, Output, EventEmitter, Optional, ComponentFactoryResolver, Injector } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core'
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Dir } from '@angular/cdk/bidi';
import { MediaService } from '@dotos/dui/common/media';

export interface IPageChangeEvent {
  page: number;
  maxPage: number;
  pageSize: number;
  total: number;
  fromRow: number;
  toRow: number;
}

@Component({
  selector: 'dui-paging-bar',
  templateUrl: './paging-bar.component.html',
  styleUrls: ['./paging-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DuiPagingBarComponent {


  private _pageSize: number = 50;
  private _total: number = 0;
  private _page: number = 1;
  private _fromRow: number = 1;
  private _toRow: number = 1;
  private _initialized: boolean = false;
  private _pageLinks: number[] = [];
  private _pageLinkCount: number = 0;
  // special case when 2 pageLinks, detect when hit end of pages so can lead in correct direction
  private _hitEnd: boolean = false;

  private _hitStart: boolean = false;

  /**
   * @cfg {String} displayMsg
   * The paging status message to display (defaults to <tt>'Displaying {0} - {1} of {2}'</tt>).
   * Note that this string is formatted using the braced numbers <tt>{0}-{2}</tt> as tokens
   * that are replaced by the values for start, end and total respectively. These tokens should
   * be preserved when overriding this string if showing those values is desired.
   */
  public displayMsg = 'Displaying {0} - {1} of {2}';
  /**
   * @cfg {String} emptyMsg
   * The message to display when no records are found (defaults to 'No data to display')
   */
  public emptyMsg = 'No data to display';
  /**
   * @cfg {String} beforePageText
   * The text displayed before the input item (defaults to <tt>'Page'</tt>).
   */
  public beforePageText = 'Page';
  /**
   * @cfg {String} afterPageText
   * Customizable piece of the default paging text (defaults to <tt>'of {0}'</tt>). Note that
   * this string is formatted using <tt>{0}</tt> as a token that is replaced by the number of
   * total pages. This token should be preserved when overriding this string if showing the
   * total page count is desired.
   */
  public afterPageText: 'of {0}';


  public freshDisable: boolean = false;
  /**
   * firstLast?: boolean
   * Shows or hides the first and last page buttons of the paging bar. Defaults to 'false'
   */
  @Input('firstLast') firstLast: boolean = true;

  /**
   * initialPage?: number
   * Sets starting page for the paging bar. Defaults to '1'
   */
  @Input('initialPage') initialPage: number = 1;

  /**
   * pageLinkCount?: number
   * Amount of page navigation links for the paging bar. Defaults to '0'
   */
  @Input('pageLinkCount')
  set pageLinkCount(pageLinkCount: number) {
    this._pageLinkCount = coerceNumberProperty(pageLinkCount);
    this._calculatePageLinks();
  }
  get pageLinkCount(): number {
    return this._pageLinkCount;
  }

  /**
   * pageSize?: number
   * Selected page size for the pagination. Defaults 50.
   */
  @Input('pageSize')
  set pageSize(pageSize: number) {
    this._pageSize = coerceNumberProperty(pageSize);
    this._page = 1;
    if (this._initialized) {
      this._handleOnChange();
    }
  }
  get pageSize(): number {
    return this._pageSize;
  }

  /**
   * total: number
   * Total rows for the pagination.
   */
  @Input('total')
  set total(total: number) {
    this._total = coerceNumberProperty(total);
    this._calculateRows();
    this._calculatePageLinks();
  }
  get total(): number {
    return this._total;
  }

  /**
   * pageLinks: number[]
   * Returns the pageLinks in an array
   */
  get pageLinks(): number[] {
    return this._pageLinks;
  }

  /**
   * range: string
   * Returns the range of the rows.
   */
  get range(): string {
    return `${!this._toRow ? 0 : this._fromRow}-${this._toRow}`;
  }

  set page(page: number) {
    this._page = page;
  }

  /**
   * page: number
   * Returns the current page.
   */
  get page(): number {
    return this._page;
  }

  /**
   * page: number
   * Returns the max page for the current pageSize and total.
   */
  get maxPage(): number {
    return Math.ceil(this._total / this._pageSize);
  }

  /**
   * change?: function
   * Method to be executed when page size changes or any button is clicked in the paging bar.
   * Emits an [IPageChangeEvent] implemented object.
   */
  @Output('change') onChange: EventEmitter<IPageChangeEvent> = new EventEmitter<IPageChangeEvent>();

  get isRTL(): boolean {
    if (this._dir) {
      return this._dir.dir === 'rtl';
    }
    return false;
  }


  constructor(
    public resolver: ComponentFactoryResolver,
    public injector: Injector,
    public media: MediaService,
    @Optional() private _dir: Dir) {
  }

  ngOnInit(): void {
    this._page = coerceNumberProperty(this.initialPage);
    this._calculateRows();
    this._calculatePageLinks();
    this._initialized = true;
  }



  navigateToPage(page: number): boolean {
    if (page === 1 || (page >= 1 && page <= this.maxPage)) {
      this._page = coerceNumberProperty(Math.floor(page));
      this._handleOnChange();
      return true;
    }
    return false;
  }


  firstPage(): boolean {
    return this.navigateToPage(1);
  }

  prevPage(): boolean {
    return this.navigateToPage(this._page - 1);
  }

  nextPage(): boolean {
    return this.navigateToPage(this._page + 1);
  }

  lastPage(): boolean {
    return this.navigateToPage(this.maxPage);
  }

  isMinPage(): boolean {
    return this._page <= 1;
  }

  isMaxPage(): boolean {
    return this._page >= this.maxPage;
  }

  /**
   * Refresh the current page, has the same effect as clicking the 'refresh' button.
   */
  public doRefresh() {
    this.navigateToPage(this._page);
  };


  private _calculateRows(): void {
    let top: number = (this._pageSize * this._page);
    this._fromRow = (this._pageSize * (this._page - 1));
    this._toRow = this._total > top ? top : this._total;
  }
  /**
   * _calculatePageLinks?: function
   * Calculates the page links that should be shown to the user based on the current state of the paginator
   */
  private _calculatePageLinks(): void {
    // special case when 2 pageLinks, detect when hit end of pages so can lead in correct direction
    if (this.isMaxPage()) {
      this._hitEnd = true;
      this._hitStart = false;
    }
    // special case when 2 pageLinks, detect when hit start of pages so can lead in correct direction
    if (this.isMinPage()) {
      this._hitEnd = false;
      this._hitStart = true;
    }
    // If the pageLinkCount goes above max possible pages based on perpage setting then reset it to maxPage
    let actualPageLinkCount: number = this.pageLinkCount;
    if (this.pageLinkCount > this.maxPage) {
      actualPageLinkCount = this.maxPage;
    }
    // reset the pageLinks array
    this._pageLinks = [];
    // fill in the array with the pageLinks based on the current selected page
    let middlePageLinks: number = Math.floor(actualPageLinkCount / 2);
    for (let x: number = 0; x < actualPageLinkCount; x++) {
      // don't go past the maxPage in the pageLinks
      // have to handle even and odd pageLinkCounts differently so can still lead to the next numbers
      if ((actualPageLinkCount % 2 === 0 && (this.page + middlePageLinks > this.maxPage)) ||
        (actualPageLinkCount % 2 !== 0 && (this.page + middlePageLinks >= this.maxPage))) {
        this._pageLinks[x] = this.maxPage - (actualPageLinkCount - (x + 1));
      } else if ((actualPageLinkCount > 2 || actualPageLinkCount <= 2 && this._hitEnd) && (this.page - middlePageLinks) > 0) {
        this._pageLinks[x] = (this.page - middlePageLinks) + x;
      } else if ((this.page - middlePageLinks) <= 0) {
        this._pageLinks[x] = x + 1;
        // other wise just set the array in order starting from the selected page
      } else {
        this._pageLinks[x] = this.page + x;
      }
    }
  }

  private _handleOnChange(): void {
    this._calculateRows();
    this._calculatePageLinks();
    let event: IPageChangeEvent = {
      page: this._page,
      maxPage: this.maxPage,
      pageSize: this._pageSize,
      total: this._total,
      fromRow: this._fromRow,
      toRow: this._toRow,
    };
    this.onChange.emit(event);
  }
}
