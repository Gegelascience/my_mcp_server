import { createMcpHandler } from "mcp-handler";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { IdfTraficClient } from "@/services/stifTraffic/idfTraficClient";


const lineEnum = z.enum([
  "1",
  "2",
  "3",
  "3 bis",
  "4",
  "5",
  "6",
  "7",
  "7 bis",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "A",
  "B",
  "C",
  "D",
  "E",
  "H",
  "J",
  "K",
  "L",
  "N",
  "P",
  "R",
  "U",
  "V",
  
]).describe("Metro, RER or Transilien line number");

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
          description: "Get trafic info of metro, RER or Transilien line in Paris",
          inputSchema: { line: lineEnum },
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