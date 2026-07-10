export type ApiExportKind =
  | 'component'
  | 'directive'
  | 'service'
  | 'pipe'
  | 'module'
  | 'class'
  | 'interface'
  | 'enum'
  | 'constant'
  | 'function'
  | 'type';

export interface ApiInput {
  name: string;
  alias?: string;
  type: string;
  default?: string;
  description: string | null;
  descriptionZh: string | null;
}

export interface ApiOutput {
  name: string;
  type: string;
  description: string | null;
  descriptionZh: string | null;
}

export interface ApiMethodParam {
  name: string;
  type: string;
}

export interface ApiMethod {
  name: string;
  params: ApiMethodParam[];
  returnType: string;
  description: string | null;
  descriptionZh: string | null;
}

export interface ApiProperty {
  name: string;
  type: string;
  default?: string;
  description: string | null;
  descriptionZh: string | null;
}

export interface ApiExport {
  name: string;
  kind: ApiExportKind;
  selector?: string;
  pipeName?: string;
  summary: string | null;
  summaryZh: string | null;
  inputs: ApiInput[];
  outputs: ApiOutput[];
  methods: ApiMethod[];
  properties: ApiProperty[];
  sourceFile: string;
}

export interface ModuleApiFile {
  importPath: string;
  exports: ApiExport[];
  suggestedUsageSnippet: string;
}
