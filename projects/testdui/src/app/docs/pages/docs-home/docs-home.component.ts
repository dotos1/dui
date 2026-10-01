import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { DocsDataService } from '../../services/docs-data.service';
import { DocsManifest } from '../../models/docs-manifest.model';
import { getCategoryMeta } from '../../models/category-meta';

@Component({
  selector: 'app-docs-home',
  templateUrl: './docs-home.component.html',
  styleUrls: ['./docs-home.component.scss'],
})
export class DocsHomeComponent {
  manifest$: Observable<DocsManifest>;
  readonly categoryIcon = (id: string) => getCategoryMeta(id).icon;
  readonly categoryTagline = (id: string) => getCategoryMeta(id).tagline;

  constructor(private docsData: DocsDataService) {
    this.manifest$ = this.docsData.getManifest();
  }
}
