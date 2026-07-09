import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { DocsDataService } from '../../services/docs-data.service';
import { DocsManifest } from '../../models/docs-manifest.model';

@Component({
  selector: 'app-docs-home',
  templateUrl: './docs-home.component.html',
  styleUrls: ['./docs-home.component.scss'],
})
export class DocsHomeComponent {
  manifest$: Observable<DocsManifest>;

  constructor(private docsData: DocsDataService) {
    this.manifest$ = this.docsData.getManifest();
  }
}
