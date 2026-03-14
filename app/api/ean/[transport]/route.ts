import { EanBarCodeService } from "@/services/ean/models";
import { createMcpHandler } from "mcp-handler";
import type { NextRequest } from "next/server";
import { z } from "zod";
import {ContentBlock} from "@modelcontextprotocol/sdk/types.js"; 

export const dynamic = 'force-dynamic';

const handler = async (
  req: NextRequest,
  {transport}: { transport: string } 
) => {

  return createMcpHandler(
    (server) => {
      server.registerTool(
        "getEanBarCodeSvg",
        {
          description: "Get EAN barcode in svg format. It returns an image in svg format encoded in base64.",
          inputSchema: z.object({ ean: z.string().describe("EAN value") }),
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



export async function GET(request: NextRequest, { params }: { params: { transport: string } }) {
  const { transport } = await params;
  if (transport !== 'sse') {
    console.warn(`Transport ${transport} is not supported. Expected 'sse'.`);
  }
  return handler(request,{ transport });
}

export async function POST(request: NextRequest, { params }: { params: { transport: string } }) {
  const { transport } = await params;
  return handler(request,{ transport });
}