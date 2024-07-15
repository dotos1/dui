
import { Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShareParamService {

  data: any={};

  constructor() { }

    get(name): any {
        return this.data[name];
    }

    set(name,value) {
        this.data[name] = value;
    }

    clear(): any {
        this.data = {};
    }
}
