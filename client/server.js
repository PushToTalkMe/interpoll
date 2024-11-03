import fs from "node:fs/promises";
import express from "express";

const isProduction = process.env.NODE_ENV === "production";
const HOST = process.env.API_SERVER_HOST || "localhost";
const REST_API_SERVER_URL = `http://${HOST}:3000/api`;
const port = process.env.PORT || 3001;
const base = process.env.BASE || "/";

const templateHtml = isProduction
  ? await fs.readFile("./dist/client/index.html", "utf-8")
  : "";
const ssrManifest = isProduction
  ? await fs.readFile("./dist/client/.vite/ssr-manifest.json", "utf-8")
  : undefined;

export const getPolls = async (defaultPage, defaultLimit) => {
  const url = `${REST_API_SERVER_URL}/polls?page=${defaultPage}&limit=${defaultLimit}`;
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
};

const app = express();

let vite;
if (!isProduction) {
  const { createServer } = await import("vite");
  vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    base,
  });
  app.use(vite.middlewares);
} else {
  const compression = (await import("compression")).default;
  const sirv = (await import("sirv")).default;
  app.use(compression());
  app.use(base, sirv("./dist/client", { extensions: [] }));
}

app.use("*", async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, "");

    const polls = await getPolls(1, 10);
    const initialPollsScript = `<script>window.__INITIAL_POLLS__ = ${JSON.stringify(
      polls
    )}</script>`;

    let template;
    let render;
    if (!isProduction) {
      template = await fs.readFile("./index.html", "utf-8");
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule("/src/entry-server.tsx")).render;
    } else {
      template = templateHtml;
      render = (await import("./dist/server/entry-server.js")).render;
    }

    const rendered = await render(polls, url, ssrManifest);

    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? "")
      .replace(`<!--app-html-->`, rendered.html ?? "")
      .replace(`<!--initial-polls-->`, initialPollsScript);

    res.status(200).set({ "Content-Type": "text/html" }).send(html);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
