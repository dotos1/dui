import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { DocsDataService } from '../../services/docs-data.service';
import { ModuleApiFile } from '../../models/api-record.model';

@Component({
  selector: 'app-module-overview-page',
  templateUrl: './module-overview-page.component.html',
  styleUrls: ['./module-overview-page.component.scss'],
})
export class ModuleOverviewPageComponent {
  api$: Observable<ModuleApiFile | null>;

  constructor(private route: ActivatedRoute, private docsData: DocsDataService) {
    this.api$ = this.route.parent!.paramMap.pipe(
      switchMap((params) =>
        this.docsData.getModuleApi(params.get('category') as string, params.get('module') as string)
      )
    );
  }
}
