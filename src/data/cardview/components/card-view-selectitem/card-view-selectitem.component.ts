
import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CardViewSelectItemModel } from '../../models';
import { CardViewUpdateService } from '../../services';
import { CardViewSelectItemOption } from '../../interfaces';
import { ThemeService } from '@dotos/dui/theme';

@Component({
  selector: 'dui-card-view-selectitem',
  templateUrl: './card-view-selectitem.component.html',
  styleUrls: ['./card-view-selectitem.component.scss']
})
export class CardViewSelectItemComponent implements OnChanges,OnDestroy {

  @Input()
  property: CardViewSelectItemModel<string>;

  @Input() editable: boolean = false;

  @Input() options$: Observable<CardViewSelectItemOption<string>[]>;

  @Input()
  displayNoneOption: boolean = true;

  value: string;


  protected destroy$ = new Subject<boolean>();

  constructor(
    public themeService: ThemeService,
    protected cardViewUpdateService: CardViewUpdateService) {
    this.cardViewUpdateService.updateItem$
      .pipe(takeUntil(this.destroy$))
       //@ts-ignore
      .subscribe((itemModel: CardViewSelectItemModel<string>) => {
        if (this.property.key === itemModel.key) {
          this.property.value = itemModel.value;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnChanges(): void {
    this.value = this.property.value;
  }

  isEditable(): boolean {
    return this.editable && this.property.editable;
  }

  getOptions(): Observable<CardViewSelectItemOption<string>[]> {
    return this.options$ || this.property.options$;
  }

  onChange(event: MatSelectChange): void {
    const selectedOption = event.value !== undefined ? event.value : null;
    this.cardViewUpdateService.update(<CardViewSelectItemModel<string>>{ ...this.property }, selectedOption);
    this.property.value = selectedOption;
  }

  showNoneOption() {
    return this.displayNoneOption;
  }

  trackByOption(index: number, option: CardViewSelectItemOption<string>): any {
    return option ? option.key : index;
  }
}
