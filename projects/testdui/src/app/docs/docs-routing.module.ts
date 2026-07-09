import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { docsRoutes } from './docs.routes';

@NgModule({
  imports: [RouterModule.forChild(docsRoutes)],
  exports: [RouterModule],
})
export class DocsRoutingModule {}
