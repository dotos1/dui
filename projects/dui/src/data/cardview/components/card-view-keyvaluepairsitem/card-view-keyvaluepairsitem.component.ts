
import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CardViewUpdateService } from '../../services';
import { CardViewKeyValuePairsItemModel } from '../../models';
import { CardViewKeyValuePairsItemType } from '../../interfaces';


@Component({
  selector: 'dui-card-view-boolitem',
  templateUrl: './card-view-keyvaluepairsitem.component.html',
  styleUrls: ['./card-view-keyvaluepairsitem.component.scss']
})

export class CardViewKeyValuePairsItemComponent  implements OnChanges,OnDestroy {

  @Input()
  property: CardViewKeyValuePairsItemModel;

  @Input()
  editable: boolean = false;

  values: CardViewKeyValuePairsItemType[];
  matTableValues: MatTableDataSource<CardViewKeyValuePairsItemType>;


  protected destroy$ = new Subject<boolean>();

  constructor(protected cardViewUpdateService: CardViewUpdateService) {
    this.cardViewUpdateService.updateItem$
      .pipe(takeUntil(this.destroy$))
      //@ts-ignore
      .subscribe((itemModel: CardViewKeyValuePairsItemModel) => {
        if (this.property.key === itemModel.key) {
          this.property.value = itemModel.value;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnChanges() {
    this.values = this.property.value || [];
    this.matTableValues = new MatTableDataSource(this.values);
  }

  isEditable(): boolean {
    return this.editable && this.property.editable;
  }

  add(): void {
    this.values.push({ name: '', value: '' });
  }

  remove(index: number): void {
    this.values.splice(index, 1);
    this.save(true);
  }

  onBlur(value): void {
    if (value.length) {
      this.save();
    }
  }

  save(remove?: boolean): void {
    const validValues = this.values.filter((i) => i.name.length && i.value.length);

    if (remove || validValues.length) {
      this.cardViewUpdateService.update(<CardViewKeyValuePairsItemModel>{ ...this.property }, validValues);
      this.property.value = validValues;
    }
  }
}
