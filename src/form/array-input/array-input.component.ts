import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';
import {clone}  from 'lodash-es';
import { Observable, of } from 'rxjs';
import { TextFieldComponent } from '../field';

@Component({
  selector: 'array-input-field',
  templateUrl: './array-input.component.html',
  styleUrls: ['./array-input.component.scss'],
  providers: [
    { provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: ArrayInputComponent },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    hostID: 'array-input-field' + Math.random().toString(36).substring(2, 15),
  }
})
export class ArrayInputComponent extends TextFieldComponent implements OnInit {

  @Output() result = new EventEmitter<{ key: string, data: string }>();

  selectData: Array<any> = [];
  filteredData: Observable<Array<any>>;
  filterString: string = '';

  
  override ngOnInit(): void {
    super.ngOnInit();

    this.selectData=[];
     this.formControl.valueChanges.subscribe((val) => {
      // startWith<string>(''),
      // map(value => typeof value === 'string' ? value : this.filterString),
     // map((filter:any) =>{
        this.filteredData =of(this.filter(val));
        this.changeDetector.detectChanges();
      } 
    );    
  }

  filter = (filter: string): Array<any> => {
    this.filterString = filter;
    this.selectData=[];
    if(this.field.options==undefined){
      return [];
    }
    let opts=clone(this.field.options);
     opts.map(option => {
        option["selected"]=false;
     });
    if (filter&&filter.length > 0) {
      opts.map(option => {
        let seleted=filter.indexOf(option.value) >= 0;
        option["selected"]=seleted;
      });
      opts.forEach(option => {
        let seleted=filter.indexOf(option.value) >= 0;
        if(seleted){
          this.selectData.push(option);
        }
      });
   
      return opts;
    } else {
      return opts.slice();
    }
  };
  
  override openChanged() {
    let value=this.formControl.value;
    this.filteredData=of(this.filter(value));
  }

  displayFn = (): string => '';

  optionClicked = (event: Event, data: any): void => {
    event.stopPropagation();
    this.toggleSelection(data);
  };

  toggleSelection = (data: any): void => {
    data.selected = !data.selected;
    if (data.selected === true) {
      this.selectData.push(data);
    } else {
      const i = this.selectData.findIndex(val =>val.value === data.value);
      this.selectData.splice(i, 1);
    }
    this.emitAdjustedData();
  };

  emitAdjustedData = (): void => {
    const results: Array<string> = []
    this.selectData.forEach((data: any) => {
      results.push(data.value);
    });

    this.formControl.setValue(results.join(','));

    this.result.emit({ key: this.field.name, data: results.join(',') });
  };

  removeChip = (data: any): void => {
    this.toggleSelection(data);
  };
}
