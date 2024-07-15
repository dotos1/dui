
import { Input, Directive } from '@angular/core';

@Directive()
export abstract class AbstractLoader {

  @Input() public backgroundColor: string;
}
