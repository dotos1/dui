import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { DocsDataService } from '../../services/docs-data.service';
import { DocsManifest } from '../../models/docs-manifest.model';

@Component({
  selector: 'app-nav-tree',
  templateUrl: './nav-tree.component.html',
  styleUrls: ['./nav-tree.component.scss'],
})
export class NavTreeComponent {
  manifest$: Observable<DocsManifest>;

  constructor(private docsData: DocsDataService) {
    this.manifest$ = this.docsData.getManifest();
  }
}
