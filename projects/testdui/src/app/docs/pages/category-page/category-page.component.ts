import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { DocsDataService } from '../../services/docs-data.service';
import { DocsManifestCategory } from '../../models/docs-manifest.model';
import { getCategoryMeta } from '../../models/category-meta';

@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.scss'],
})
export class CategoryPageComponent {
  categoryId$: Observable<string>;
  category$: Observable<DocsManifestCategory | undefined>;
  markdown$: Observable<string>;
  readonly categoryIcon = (id: string) => getCategoryMeta(id).icon;
  readonly categoryTagline = (id: string) => getCategoryMeta(id).tagline;

  constructor(private route: ActivatedRoute, private docsData: DocsDataService) {
    this.categoryId$ = this.route.paramMap.pipe(map((params) => params.get('category') as string));

    this.category$ = this.categoryId$.pipe(
      switchMap((categoryId) =>
        this.docsData
          .getManifest()
          .pipe(map((manifest) => manifest.categories.find((c) => c.id === categoryId)))
      )
    );

    this.markdown$ = this.categoryId$.pipe(
      switchMap((categoryId) => this.docsData.getCategoryMarkdown(categoryId))
    );
  }
}
