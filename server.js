#!/usr/bin/env node

import { createServer } from "http";

import config from "./config/config.js";
import app from "./config/app.js";
import { onError, onListening } from "./config/serverHandlers.js";

app.set("port", config.port);

const server = createServer(app);

server.listen(config.port);
server.on("error", onError);
server.on("listening", onListening);
