import {
  ChangeDetectionStrategy,  Component,   Input
} from '@angular/core';
import { fakePresets } from '../constants'
import { ContextService, PickerContextProps } from '../hooks/context.service';

@Component({
  selector: 'gradient-presets',
  templateUrl: './gradient-presets.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  host: { 'hostID': crypto.randomUUID().toString()}
})
export class GradientPresetsComponent  {

  @Input()  public  presets?: any[]=[];

  public context:PickerContextProps;  
  
  constructor(
    public contextService:ContextService,

  ) {
    this.context=contextService.getContext();
  }

  getStyle(p){
    return  {  background: p,  border: p === 'rgba(255,255,255, 1)' ? '1px solid #96959c' : ''}
  }
  

  public getPresets ():any{
    if (this. presets?.length > 0) {
      return this.presets?.slice(0, 18)
    } else {
      return fakePresets
    }
  }

  public handlePresetClick (preset: any){
    if (preset?.includes('gradient')) {
            this.context.onChange(preset)
    } else {
         this.context. handleChange(preset)
    }
  }
}
