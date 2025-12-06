import { NpmResponsePackageInfo } from "./types";

export class NpmInfoClient {
    baseURLInfo: string = "https://registry.npmjs.org/";
    baseURLDownloads: string = "https://api.npmjs.org/downloads/";

    constructor() {
    }  
    async getPackageInfo(packageName: string) {
        const uri = this.baseURLInfo + encodeURIComponent(packageName);
        try {
            const response = await fetch(uri, { method: "GET" });
            if (response.status != 200) {
                return [{ message: "Error " + response.status, type: "error" }];
            }
            const data = await response.json();
            return data as NpmResponsePackageInfo;
        } catch (error: Error | any) {
            return [{ message: "Fetch error: " + error.message, type: "error" }];
        }
    }   
}