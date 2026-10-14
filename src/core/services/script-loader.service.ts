import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';



interface Scripts {
    name: string;
    src: string;
}

export const ScriptStore: Scripts[] = [];

declare const document: any;

@Injectable({providedIn: 'root'})
export class ScriptLoaderService {

    private scripts: any = {};
    private pathMappings: Record<string, string> = {};

    constructor(private http: HttpClient) {
        ScriptStore.forEach((script: any) => {
            this.scripts[script.name] = {
                loaded: false,
                src: script.src
            };
        });
    }

    load(...scripts: string[]): Promise<any> {
        if (scripts && scripts.length) {
            return Promise.resolve()
                .then(() => this.pathMappings )
                .then(() => {
                    return Promise.all(scripts.map( s => {
                        return this.loadScript(s);
                    }));
                });
        }
        return Promise.resolve();
    }

    private loadScript(name: string) {
        return new Promise((resolve) => {
            if (this.scripts[name] && this.scripts[name].loaded) {
                resolve({ script: name, loaded: true });
                return;
            } else if (!this.scripts[name]) {
                this.scripts[name] = {
                    loaded: false,
                    src: name
                };
            }
            //load script
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = false;
            let src = this.scripts[name].src;
            src = this.pathMappings[src] || src;

            script.src = src;

            if (script.readyState) {  //IE
                script.onreadystatechange = () => {
                    if (script.readyState === "loaded" || script.readyState === "complete") {
                        script.onreadystatechange = null;
                        this.scripts[name].loaded = true;
                        resolve({script: name, loaded: true });
                    }
                };
            } else {  //Others
                script.onload = () => {
                    this.scripts[name].loaded = true;
                    resolve({script: name, loaded: true });
                };
            }
            script.onerror = () => resolve({script: name, loaded: false, status: 'Loaded'});
            document.getElementsByTagName('head')[0].appendChild(script);
        });
    }
}
