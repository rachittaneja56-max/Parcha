import http from "node:http";
import ws from "ws";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { logger } from "@repo/logger";
import { app as expressApplication } from "./server";
import { serverRouter, createContext } from "@repo/trpc/server";

import { env } from "./env";

async function init() {
  try {
    const server = http.createServer(expressApplication);
    
    const wss = new ws.Server({ server });
    const handler = applyWSSHandler({
      wss,
      router: serverRouter,
      createContext,
    });

    wss.on("connection", (client) => {
      logger.debug(`WebSocket connected (${wss.clients.size})`);
      client.once("close", () => {
        logger.debug(`WebSocket disconnected (${wss.clients.size})`);
      });
    });

    const PORT: number = env.PORT ? +env.PORT : 8000;
    server.listen(PORT, "0.0.0.0", () => {
      logger.info(`http server and websocket server are running on PORT ${PORT}`);
    });

    process.on("SIGTERM", () => {
      logger.info("SIGTERM");
      handler.broadcastReconnectNotification();
      wss.close();
    });
  } catch (err) {
    logger.error(`Error creating http server`, { err });
    process.exit(1);
  }
}

init();
