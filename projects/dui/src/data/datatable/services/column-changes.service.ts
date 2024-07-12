import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ColumnChangesService {
  private columnInputChanges = new Subject<void>();

  get columnInputChanges$(): Observable<void> {
    return this.columnInputChanges.asObservable();
  }

  onInputChange(): void {
    this.columnInputChanges.next();
  }
}
