

export class EnterpriseApiClient {
    baseURL: string = "https://recherche-entreprises.api.gouv.fr/search";

    constructor() {
    }

    async getEnterpriseMainDataBySiret(siret: string) {
        const uri = this.baseURL + "?" + new URLSearchParams({ q: siret }).toString();
        try {
            const response = await fetch(uri, { method: "GET" });
            if (response.status != 200) {
                return { error: "Error " + response.status };
            }
            const data = await response.json();
            return data;
        } catch (error) {
            return { error: "Error " + error };
        }
    }
}
