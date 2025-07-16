#!/usr/bin/env node
/**
 * Entry point for the Productboard MCP server
 */
import { ProductboardServer } from "./productboard-server.js";

// Create and run the server
const server = new ProductboardServer();
server.run().catch(console.error);
