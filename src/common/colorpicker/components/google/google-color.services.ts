import {Injectable} from "@angular/core";
import { LocalStorageService } from '@dotos/dui/core/storage';
@Injectable()
export class GoogleColorService {
 public customcolors: any = ['#cf1717' ];
 public version: any =0;
 constructor( 
    public localStore: LocalStorageService) {
      if(localStore.get('google-custom-colors')){
         this.customcolors=localStore.get('google-custom-colors');
      }
 }

 addCustom(color) {
    this.customcolors.push(color);
    this.localStore.set('google-custom-colors', this.customcolors);
    this.version++;
 }
}