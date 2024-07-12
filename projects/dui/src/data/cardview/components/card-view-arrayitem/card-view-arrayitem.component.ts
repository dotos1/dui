
import { Component, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CardViewArrayItemModel } from '../../models';
import { CardViewUpdateService } from '../../services';
import { ThemeService } from '@dotos/dui/theme';
@Component({
  selector: 'dui-card-view-arrayitem',
  templateUrl: './card-view-arrayitem.component.html',
  styleUrls: ['./card-view-arrayitem.component.scss']
})
export class CardViewArrayItemComponent  implements OnDestroy{

  @Input()
  property: CardViewArrayItemModel;


  protected destroy$ = new Subject<boolean>();

  constructor(
    protected cardViewUpdateService: CardViewUpdateService,
    public themeService: ThemeService,
  ) {
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


  clicked(): void {
    if (this.isClickable()) {
      this.cardViewUpdateService.clicked(this.property);
    }
  }

  showClickableIcon(): boolean {
    return this.hasIcon() && this.isClickable();
  }

  hasIcon(): boolean {
    return !!this.property.icon;
  }

  displayCount(): number {
    return this.property.noOfItemsToDisplay ? this.property.noOfItemsToDisplay : 0;
  }

  isClickable(): boolean {
    return !!this.property.clickable;
  }
}
