import { NpmInfoClient } from "@/services/npm/npmInfoClient";
import { createMcpHandler } from "mcp-handler";
import type { NextRequest } from "next/server";
import { z } from "zod";


const handler = async (
  req: NextRequest,
  {}
) => {

  return createMcpHandler(
    (server) => {
      server.registerTool(
        "getInfoNpmPackage",
        {
          description: "Get informations about an NPM package",
          inputSchema: { packageNpm: z.string().describe("NPM package name") },
          outputSchema: { result: z.object({}) },
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



export { handler as GET, handler as POST, handler as OPTIONS };