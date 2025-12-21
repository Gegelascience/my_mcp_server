export class SvgFileService {
    containerSvgTag: SvgTag;
    constructor() {
        this.containerSvgTag = new SvgTag("svg");
        this.containerSvgTag.addAttribute( { xmlns: "http://www.w3.org/2000/svg" });
        this.containerSvgTag.addAttribute({ version: "1.1" });
    }

    setSize(width: number, height: number) {
        this.containerSvgTag.addAttribute({ width: width.toString(), height: height.toString() });
    }
    
    addCustomAttribute(attribute: Record<string, string>) {
        this.containerSvgTag.addAttribute(attribute);
    }

    getSvgString(): string {
        return `<?xml version='1.0' encoding='utf-8'?>\n${this.containerSvgTag.toString()}`;
    }
    
}


export class SvgTag {
    attributes: Record<string, string>[];
    children: SvgTag[];
    name: string;
    constructor(name: string) {
        this.attributes = [];
        this.children = [];
        this.name = name;
    }

    addAttribute(attributes: Record<string, string>) {
        const attribute: Record<string, string> = { ...attributes };
        this.attributes.push(attribute);
    }
    addChild(child: SvgTag) {
        this.children.push(child);
    }

    removeAttribute(attributeName: string) {
        this.attributes = this.attributes.filter(attr => attr.tagName !== attributeName);
    }

    removeChild(child: SvgTag) {
        this.children = this.children.filter(c => c !== child);
    }

    toString(): string {
        const attrs = this.attributes.map(attribute => {
            return Object.entries(attribute)
                .map(([key, value]) => `${key}="${value}"`)
                .join(' ');
        }).join(' ');
    
        const children = this.children.map(child => child.toString()).join('\n');

        return `<${this.name} ${attrs}>${children}</${this.name}>`;
    }
}