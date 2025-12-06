

export type LineTraficInfo = {
    message: string;
    type: string;
}

export class IdfTraficClient {
    baseURL: string = "https://prim.iledefrance-mobilites.fr/marketplace";
    apiKey: string = "";

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async getLineTraficInfo(humanline: string) {
        const selectedLine = this.getLineStif(humanline);

        if (selectedLine == "") {
            return [{ message: "Line not found", type: "error" } as LineTraficInfo];
        }
        const header = {
            "Accept": "application/json",
            "apikey": this.apiKey,
            "Accept-Encoding": "gzip, deflate",
        }

        const uri = this.baseURL + "/general-message?" + new URLSearchParams({ LineRef: "STIF:Line::" + selectedLine + ":" }).toString();
        try {
            const response = await fetch(uri, { headers: header, method: "GET" });
            if (response.status != 200) {
                return [{ message: "Error " + response.status, type: "error" } as LineTraficInfo];
            }
            const data = await response.json();
            return this.formatLineTraficInfo(data);
        } catch (error) {
            return [{ message: "Error " + error, type: "error" } as LineTraficInfo];
        }
    }

    formatLineTraficInfo(data: any) {
        const generalMessageDelivery = data.Siri.ServiceDelivery.GeneralMessageDelivery as Array<any>;
        let listMessage: LineTraficInfo[] = [];
        for (let index = 0; index < generalMessageDelivery.length; index++) {
            const element = generalMessageDelivery[index];
            element.InfoMessage.forEach((messageWrapper: any) => {
                messageWrapper.Content.Message.forEach((message: any) => {
                    listMessage.push({
                        message: message.MessageText.value,
                        type: messageWrapper.InfoChannelRef.value
                    });
                })
            });

        }
        return listMessage;
    }

    getLineStif(line: string) {

        if (line == "1") {
            return "C01371"
        }
        else if (line == "2") {
            return "C01372"
        }
        else if (line == "3") {
            return "C01373"
        }
        else if (line == "3bis" || line == "3 bis") {
            return "C01386"
        }
        else if (line == "4") {
            return "C01374"
        }
        else if (line == "5") {
            return "C01375"
        }
        else if (line == "6") {
            return "C01376"
        }
        else if (line == "7") {
            return "C01377"
        }
        else if (line == "7bis" || line == "7 bis") {
            return "C01387"
        }
        else if (line == "8") {
            return "C01378"
        }
        else if (line == "9") {
            return "C01379"
        }
        else if (line == "10") {
            return "C01380"
        }
        else if (line == "11") {
            return "C01381"
        }
        else if (line == "12") {
            return "C01382"
        }
        else if (line == "13") {
            return "C01383"
        }
        else if (line == "14") {
            return "C01384"
        }
        else if (line == "R") {
            return "C01731"
        }
        else if (line == "H") {
            return "C01737"
        }
        else if (line == "A" || line == "RER A") {
            return "C01742"
        }
        else if (line == "B" || line == "RER B") {
            return "C01743"
        }
        else if (line == "C" || line == "RER C") {
            return "C01727"
        }
        else if (line == "D" || line == "RER D") {
            return "C01728"
        }
        else if (line == "E" || line == "RER E") {
            return "C01729"
        }
        else if (line == "R") {
            return "C01731"
        }
        else if (line == "H") {
            return "C01737"
        }
        else if (line == "P") {
            return "C01730"
        }
        else if (line == "J") {
            return "C01739"
        }
        else if (line == "N") {
            return "C01736"
        }
        else if (line == "L") {
            return "C01740"
        }
        else if (line == "K") {
            return "C01738"
        }
        else if (line == "V") {
            return "C02711"
        }
        else if (line == "U") {
            return "C01741"
        }
        else {
            return ""
        }
    }
}   