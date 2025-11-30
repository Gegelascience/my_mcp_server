import { createMcpHandler } from "mcp-handler";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { IdfTraficClient } from "@/services/idfTraficClient";

const handler = async (
  req: NextRequest,
  { params }: { params: Promise<{ apikey: string }> }
) => {
  const { apikey } = await params;

  return createMcpHandler(
    (server) => {
      console.log("apikey", apikey);
      server.registerTool(
        "getTraficInfo",
        {
          description: "Get trafic info of metro or rer line in Paris",
          inputSchema: { line: z.string().describe("Metro or RER line number") },
          outputSchema: { result: z.array(z.object({ message: z.string(), type: z.string() })) },
        },
        async ({ line }) => {
          const client = new IdfTraficClient(apikey);
          const data = await client.getLineTraficInfo(line);
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
      basePath: `/api/idfTraficInfo/${apikey}`,
    }
  )(req);
};
export { handler as GET, handler as POST, handler as OPTIONS };