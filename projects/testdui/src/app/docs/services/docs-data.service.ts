import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';

import { DocsManifest } from '../models/docs-manifest.model';
import { ModuleApiFile } from '../models/api-record.model';

const EMPTY_MANIFEST: DocsManifest = { generatedAt: '', categories: [] };

@Injectable({ providedIn: 'root' })
export class DocsDataService {
  private manifest$?: Observable<DocsManifest>;

  constructor(private http: HttpClient) {}

  getManifest(): Observable<DocsManifest> {
    if (!this.manifest$) {
      this.manifest$ = this.http.get<DocsManifest>('assets/docs-data/manifest.json').pipe(
        catchError(() => of(EMPTY_MANIFEST)),
        shareReplay(1)
      );
    }
    return this.manifest$;
  }

  getModuleApi(category: string, moduleId: string): Observable<ModuleApiFile | null> {
    return this.http
      .get<ModuleApiFile>(`assets/docs-data/${category}/${moduleId}.json`)
      .pipe(catchError(() => of(null)));
  }

  getCategoryMarkdown(category: string): Observable<string> {
    return this.http
      .get(`assets/docs-content/${category}.md`, { responseType: 'text' })
      .pipe(catchError(() => of('')));
  }
}
