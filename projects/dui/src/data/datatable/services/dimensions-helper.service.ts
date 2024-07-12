import {  Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DimensionsHelper {
  getDimensions(element: Element): ClientRect {
    return element.getBoundingClientRect();
  }
}
