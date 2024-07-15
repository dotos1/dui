
export class RedirectionModel {
    provider: string;
    url?: string;
    constructor(obj?: any) {
        if (obj) {
            this.provider = obj.provider;
            this.url = obj.url || null;
        }
    }
}
