import { Readable } from "node:stream";
import server from "../dist/server/server.js";

export default async function handler(req: Request & { headers: Record<string, string | string[] | undefined>; method?: string; url?: string }, res: any) {
  const method = req.method ?? "GET";
  const url = new URL(req.url ?? "", `https://${req.headers.host ?? "localhost"}`);
  const requestInit: RequestInit & { duplex?: "half" } = {
    method,
    headers: req.headers as HeadersInit,
    body: method === "GET" || method === "HEAD" ? undefined : (req as unknown as BodyInit),
    // Required by Node when streaming request bodies into fetch.
    duplex: "half",
  };
  const request = new Request(url.toString(), requestInit);

  const response = await server.fetch(request, {}, {});

  res.statusCode = response.status;
  response.headers.forEach((value: string, key: string) => {
    res.setHeader(key, value);
  });

  if (!response.body) {
    res.end();
    return;
  }

  Readable.fromWeb(response.body as any).pipe(res);
}
