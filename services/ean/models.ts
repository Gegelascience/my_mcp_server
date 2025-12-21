import { setA,setB,setC, EANCharType } from "./types";
import {SvgFileService, SvgTag} from "@/services/svg/models";

export class EanBarCodeService {
    constructor() {}

    checkEanValidity(ean: string): boolean {
        // Basic EAN-13 validity check
        if (!/^\d{13}$/.test(ean)) {
            return false;
        }
        const digits = ean.split('').map(Number);
        const checkDigit = digits.pop()!;
        const sum = digits.reduce((acc, digit, idx) => {
            return acc + digit * (idx % 2 === 0 ? 1 : 3);
        }, 0);
        const calculatedCheckDigit = (10 - (sum % 10)) % 10;
        return checkDigit === calculatedCheckDigit;
    }

    calculateBarcodeValue(eanValue: string): string {
        if (this.checkEanValidity(eanValue)) {
            
            var barcodeValue = "101"

            var prefix = eanValue[0]

            if (eanValue.length == 13){
                var firstPartRaw = eanValue.substring(1,7)
                var lastPartRaw = eanValue.substring(7)
            } else if (eanValue.length == 8) {
                var firstPartRaw = eanValue.substring(0,4)
                var lastPartRaw = eanValue.substring(4)
            } else {
                return ""
            }
            

            for (let index = 0; index < firstPartRaw.length; index++) {
                const el =firstPartRaw[index] as EANCharType;
                if (firstPartRaw.length == 6){
                    const setToApply = this.findSetByPrefixAndIndex(prefix,index)
                    if (setToApply == "A") {
                        barcodeValue = barcodeValue + setA[el]
                    } else {
                        barcodeValue = barcodeValue + setB[el]
                    }
                } else {
                    barcodeValue = barcodeValue + setA[el]
                }
                
            }

            barcodeValue = barcodeValue + "01010"

            for (let index = 0; index < lastPartRaw.length; index++) {
                const el =lastPartRaw[index] as EANCharType;
                barcodeValue = barcodeValue + setC[el]
                
            }
            
            barcodeValue = barcodeValue + "101"

            return barcodeValue

        }
        return "";
    }

    findSetByPrefixAndIndex(prefix:string,index:number) {

        if (index == 0 || prefix == "0"){
            return "A"
        } else if (prefix == "1"){

            return (index==1 || index==3) ? "A" : "B"

        } else if (prefix == "2") {
            
            return (index==1 || index==4) ? "A" : "B"
        
        } else if (prefix == "3") {
        
            return (index==1 || index==5) ? "A" : "B"
        
        } else if (prefix == "4") {
        
            return (index==2 || index==3) ? "A" : "B"
        
        } else if (prefix == "5") {
        
            return (index==3 || index==4) ? "A" : "B"
        
        } else if (prefix == "6") {
        
            return (index==4 || index==5) ? "A" : "B"
        
        } else if (prefix == "7") {
        
            return (index==2 || index==4) ? "A" : "B"
        
        } else if (prefix == "8") {
        
            return (index==2 || index==5) ? "A" : "B"
        
        } else if (prefix == "9") {
        
            return (index==3 || index==5) ? "A" : "B"
        
        }
            
    }

    getBarcodeSvg(ean: string): string {
        // Placeholder for barcode picture generation logic
        const barcodeValue = this.calculateBarcodeValue(ean);
        if (barcodeValue === "") {
            throw new Error("Invalid EAN code");
        }
        let svgContainer = new SvgFileService();
        const barWidth = 700;
        const barHeight = 200;

        svgContainer.setSize(barWidth, barHeight);

        svgContainer.addCustomAttribute({baseProfile:"full"})

        const rectTag = new SvgTag("rect");
        rectTag.addAttribute({"fill": "white"});
        rectTag.addAttribute({width: "100%", height: "100%"});
        
        svgContainer.containerSvgTag.addChild(rectTag);

        const gTag = new SvgTag("g");
        gTag.addAttribute({stroke: "black"});
        svgContainer.containerSvgTag.addChild(gTag);
        let indexBar = 10;
        for (let i = 0; i < barcodeValue.length; i++) {
            const bit = barcodeValue[i];
            if (bit === '1') {
                const lineTag = new SvgTag("line");
                lineTag.addAttribute({ "stroke-width": "4" });
                lineTag.addAttribute({ "y1": "10" });
                lineTag.addAttribute({ "x1": indexBar.toString() });
                lineTag.addAttribute({ "y2": "50" });
                lineTag.addAttribute({ "x2": indexBar.toString() });
                gTag.addChild(lineTag);
            
            }
            indexBar = indexBar + 4
        }

        return svgContainer.getSvgString();
    }
}

