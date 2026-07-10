import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { DocsDataService } from '../../services/docs-data.service';
import { ApiExport, ApiInput, ApiMethod, ApiOutput, ApiProperty, ModuleApiFile } from '../../models/api-record.model';
import { preferZh } from '../../util/i18n-text';

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

  summaryOf(item: ApiExport): string | null {
    return preferZh(item.summaryZh, item.summary);
  }

  descriptionOf(item: ApiInput | ApiOutput | ApiMethod | ApiProperty): string | null {
    return preferZh(item.descriptionZh, item.description);
  }
}
