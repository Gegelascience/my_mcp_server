import { NpmInfoClient } from "@/services/npm/npmInfoClient";
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
        "getInfoNpmPackage",
        {
          description: "Get informations about an NPM package",
          inputSchema: z.object({ packageNpm: z.string().describe("NPM package name") }),
          outputSchema: { result: z.any() },
        },
        async ({ packageNpm }) => {
          
          const client = new NpmInfoClient();
          const data = await client.getPackageInfo(packageNpm);
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
      basePath: `/api/npmInfo`,
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