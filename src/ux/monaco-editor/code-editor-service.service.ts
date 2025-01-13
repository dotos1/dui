
import { Injectable } from '@angular/core';
import * as monaco from 'monaco-editor';

@Injectable({
    providedIn: 'root'
})
export class CodeEditorService {

    private schemas = [];

    addSchema(uri: string, fileMatch: string | string[], schema: string | Object) {
        this.schemas.push({
            uri,
            fileMatch: Array.isArray(fileMatch) ? fileMatch : [ fileMatch ],
            schema
        });
    }

    getConfig() {
        return {
            baseUrl: './assets',
            onMonacoLoad: this.onMonacoLoad.bind(this)
        };
    }

    private onMonacoLoad() {
        monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
            validate: true,
            schemas: this.schemas
        });
    }
}
