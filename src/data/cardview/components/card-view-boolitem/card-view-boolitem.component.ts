
import { Component, Input, OnDestroy } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CardViewBoolItemModel } from '../../models';
import { CardViewUpdateService } from '../../services';

@Component({
  selector: 'dui-card-view-boolitem',
  templateUrl: './card-view-boolitem.component.html'
})

export class CardViewBoolItemComponent implements OnDestroy {

  @Input()
  property: CardViewBoolItemModel;

  @Input()
  editable: boolean;


  protected destroy$ = new Subject<boolean>();

  constructor(protected cardViewUpdateService: CardViewUpdateService) {
    this.cardViewUpdateService.updateItem$
      .pipe(takeUntil(this.destroy$))
      .subscribe((itemModel: any) => {
        if (this.property.key === itemModel.key) {
          this.property.value = itemModel.value;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  isEditable() {
    return this.editable && this.property.editable;
  }

  changed(change: MatCheckboxChange) {
    this.cardViewUpdateService.update(<CardViewBoolItemModel>{ ...this.property }, change.checked);
    this.property.value = change.checked;
  }
}
