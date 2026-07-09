import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { DocsDataService } from '../../services/docs-data.service';
import { DocsManifestModule } from '../../models/docs-manifest.model';

@Component({
  selector: 'app-module-shell',
  templateUrl: './module-shell.component.html',
  styleUrls: ['./module-shell.component.scss'],
})
export class ModuleShellComponent {
  categoryId$: Observable<string>;
  moduleId$: Observable<string>;
  module$: Observable<DocsManifestModule | undefined>;

  constructor(private route: ActivatedRoute, private docsData: DocsDataService) {
    this.categoryId$ = this.route.paramMap.pipe(map((params) => params.get('category') as string));
    this.moduleId$ = this.route.paramMap.pipe(map((params) => params.get('module') as string));

    this.module$ = combineLatest([this.categoryId$, this.moduleId$, this.docsData.getManifest()]).pipe(
      map(([categoryId, moduleId, manifest]) => {
        const category = manifest.categories.find((c) => c.id === categoryId);
        return category?.modules.find((m) => m.id === moduleId);
      })
    );
  }
}
