import { EanBarCodeService } from "@/services/ean/models";
import { createMcpHandler } from "mcp-handler";
import type { NextRequest } from "next/server";
import { z } from "zod";
import {ContentBlock} from "@modelcontextprotocol/sdk/types.js"; 



const handler = async (
  req: NextRequest,
  {}
) => {

  return createMcpHandler(
    (server) => {
      server.registerTool(
        "getEanBarCodeSvg",
        {
          description: "Get EAN barcode in svg format. It returns an image in svg format encoded in base64.",
          inputSchema: { ean: z.string().describe("EAN value") },
        },
        async ({ ean }) => {
          const client = new EanBarCodeService();
          const dataString = await client.getBarcodeSvg(ean);

          const contentBlocks: ContentBlock[] = [
            {
                type:"text",
                text: "EAN barcode generated successfully in svg format and encoded in base64."
            },  
            { 
                type: "image", 
                data: Buffer.from(dataString, 'utf-8').toString('base64'), 
                mimeType: "image/svg+xml" 
            }
              
          ];
          
          return {
            content: contentBlocks
          };
        }
      );
    },
    undefined,
    {
      basePath: `/api/ean`,
    }
  )(req);
};



export { handler as GET, handler as POST, handler as OPTIONS };