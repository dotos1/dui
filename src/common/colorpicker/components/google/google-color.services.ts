import {Injectable} from "@angular/core";

@Injectable()
export class GoogleColorService {
 public customcolors: any = ['#cf1717' ];
 public version: any =0;
 constructor() {

 }

 addCustom(color) {
    this.customcolors.push(color);
    this.version++;
 }
}