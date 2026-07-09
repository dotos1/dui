import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'color',
    loadChildren: () => import('./color/testcolor.module').then(m => m.TestColorModule),
  },
  {
    path: '',
    loadChildren: () => import('./docs/docs.module').then(m => m.DocsModule),
  },
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }