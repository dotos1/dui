
import { Component, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CardViewMapItemModel } from '../../models/card-view-mapitem.model';
import { CardViewUpdateService } from '../../services/card-view-update.service';

@Component({
  selector: 'dui-card-view-mapitem',
  templateUrl: './card-view-mapitem.component.html',
  styleUrls: ['./card-view-mapitem.component.scss']
})

export class CardViewMapItemComponent implements OnDestroy {
  @Input()
  property: CardViewMapItemModel;

  @Input()
  displayEmpty: boolean = true;


  protected destroy$ = new Subject<boolean>();

  constructor(protected cardViewUpdateService: CardViewUpdateService) {
    this.cardViewUpdateService.updateItem$
      .pipe(takeUntil(this.destroy$))
       //@ts-ignore
      .subscribe((itemModel: CardViewMapItemModel) => {
        if (this.property.key === itemModel.key) {
          this.property.value = itemModel.value;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  showProperty() {
    return this.displayEmpty || !this.property.isEmpty();
  }

  isClickable() {
    return this.property.clickable;
  }

  clicked(): void {
    this.cardViewUpdateService.clicked(this.property);
  }
}
