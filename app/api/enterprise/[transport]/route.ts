import {EnterpriseApiClient} from "@/services/enterpriseApi/model";
import { createMcpHandler } from "mcp-handler";
import type { NextRequest } from "next/server";
import { z } from "zod";

export const dynamic = 'force-dynamic';

const handler = async (
  req: NextRequest,
  {transport}: { transport: string } 
) => {
  console.log(transport);
  return createMcpHandler(
    (server) => {
      server.registerTool(
        "getFrenchEnterpriseMainData",
        {
          description: "Get informations about a french enterprise",
          inputSchema: z.object({ 
            siret: z.string().describe("SIRET") 
          }),
          outputSchema: { result: z.any() },
        },
        async ({ siret }) => {
          const client = new EnterpriseApiClient();
          const data = await client.getEnterpriseMainDataBySiret(siret);
          console.log(JSON.stringify(data));
          return {
            content: [{ type: "text", text: JSON.stringify(data) }],
            structuredContent: { result: data }
          };
        }
      );
    },
    undefined,
    {
      basePath: `/api/enterprise`,
    }
  )(req);
};



export async function GET(request: NextRequest, { params }: { params: Promise<{ transport: string }> }) {
  const { transport } = await params;
  if (transport !== 'sse') {
    console.warn(`Transport ${transport} is not supported. Expected 'sse'.`);
  }
  return handler(request,{ transport });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ transport: string }> }) {
  const { transport } = await params;
  return handler(request,{ transport });
}