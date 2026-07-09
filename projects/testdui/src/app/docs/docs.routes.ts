import { Routes } from '@angular/router';

import { DocsShellComponent } from './shell/docs-shell.component';
import { DocsHomeComponent } from './pages/docs-home/docs-home.component';
import { CategoryPageComponent } from './pages/category-page/category-page.component';
import { ModuleShellComponent } from './pages/module-shell/module-shell.component';
import { ModuleOverviewPageComponent } from './pages/module-overview-page/module-overview-page.component';
import { ApiReferencePageComponent } from './pages/api-reference-page/api-reference-page.component';

/**
 * 每加一个 flagship 组件的可交互示例，就在这里补一条 loadChildren 路由，
 * 必须排在下面的 ':category/:module' 通配路由之前。
 */
const FLAGSHIP_EXAMPLE_ROUTES: Routes = [
  { path: 'ui/button/examples', loadChildren: () => import('./examples/button/button-example.module').then(m => m.ButtonExampleModule) },
  { path: 'ui/topbar/examples', loadChildren: () => import('./examples/topbar/topbar-example.module').then(m => m.TopbarExampleModule) },
  { path: 'ui/speeddial/examples', loadChildren: () => import('./examples/speeddial/speeddial-example.module').then(m => m.SpeeddialExampleModule) },
  { path: 'ui/menu/examples', loadChildren: () => import('./examples/menu/menu-example.module').then(m => m.MenuExampleModule) },
  { path: 'ui/context-menu/examples', loadChildren: () => import('./examples/context-menu/context-menu-example.module').then(m => m.ContextMenuExampleModule) },
  { path: 'common/toastr/examples', loadChildren: () => import('./examples/toastr/toastr-example.module').then(m => m.ToastrExampleModule) },
  { path: 'common/collapsible/examples', loadChildren: () => import('./examples/collapsible/collapsible-example.module').then(m => m.CollapsibleExampleModule) },
  { path: 'common/search-box/examples', loadChildren: () => import('./examples/search-box/search-box-example.module').then(m => m.SearchBoxExampleModule) },
  { path: 'common/dialogs/examples', loadChildren: () => import('./examples/dialogs/dialogs-example.module').then(m => m.DialogsExampleModule) },
  { path: 'container/index/examples', loadChildren: () => import('./examples/container/container-example.module').then(m => m.ContainerExampleModule) },
  { path: 'container/dock-layout/examples', loadChildren: () => import('./examples/dock-layout/dock-layout-example.module').then(m => m.DockLayoutExampleModule) },
  { path: 'tree/index/examples', loadChildren: () => import('./examples/tree/tree-example.module').then(m => m.TreeExampleModule) },
  { path: 'data/datatable/examples', loadChildren: () => import('./examples/datatable/datatable-example.module').then(m => m.DatatableExampleModule) },
  { path: 'form/index/examples', loadChildren: () => import('./examples/form/form-example.module').then(m => m.FormExampleModule) },
  { path: 'ux/command-palette/examples', loadChildren: () => import('./examples/command-palette/command-palette-example.module').then(m => m.CommandPaletteExampleModule) },
  { path: 'ux/markdown/examples', loadChildren: () => import('./examples/markdown/markdown-example.module').then(m => m.MarkdownExampleModule) },
  { path: 'ux/terminal/examples', loadChildren: () => import('./examples/terminal/terminal-example.module').then(m => m.TerminalExampleModule) },
  { path: 'ux/editor/examples', loadChildren: () => import('./examples/editor/editor-example.module').then(m => m.EditorExampleModule) },
  { path: 'ux/monaco-editor/examples', loadChildren: () => import('./examples/monaco-editor/monaco-editor-example.module').then(m => m.MonacoEditorExampleModule) },
];

export const docsRoutes: Routes = [
  {
    path: '',
    component: DocsShellComponent,
    children: [
      { path: '', component: DocsHomeComponent },
      ...FLAGSHIP_EXAMPLE_ROUTES,
      { path: ':category', component: CategoryPageComponent },
      {
        path: ':category/:module',
        component: ModuleShellComponent,
        children: [
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          { path: 'overview', component: ModuleOverviewPageComponent },
          { path: 'api', component: ApiReferencePageComponent },
        ],
      },
    ],
  },
];
