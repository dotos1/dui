import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { DocsDataService } from '../../services/docs-data.service';
import { ApiMethod, ModuleApiFile } from '../../models/api-record.model';

@Component({
  selector: 'app-api-reference-page',
  templateUrl: './api-reference-page.component.html',
  styleUrls: ['./api-reference-page.component.scss'],
})
export class ApiReferencePageComponent {
  api$: Observable<ModuleApiFile | null>;

  constructor(private route: ActivatedRoute, private docsData: DocsDataService) {
    this.api$ = this.route.parent!.paramMap.pipe(
      switchMap((params) =>
        this.docsData.getModuleApi(params.get('category') as string, params.get('module') as string)
      )
    );
  }

  formatParams(method: ApiMethod): string {
    return method.params.map((p) => `${p.name}: ${p.type}`).join(', ');
  }
}
