export interface DocsManifestModule {
  id: string;
  importPath: string;
  dataFile: string;
  exportedClassCount: number;
  isFlagship: boolean;
}

export interface DocsManifestCategory {
  id: string;
  importPath: string;
  moduleCount: number;
  modules: DocsManifestModule[];
}

export interface DocsManifest {
  generatedAt: string;
  categories: DocsManifestCategory[];
}
