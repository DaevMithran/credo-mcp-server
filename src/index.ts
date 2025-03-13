import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CredoAgent } from "./agent.js";
import { DidToolHandler } from "./tools/did.js";

class AgentMcpServer {
    server: McpServer
    credo: CredoAgent

    constructor() {
        this.server = new McpServer({
            name: "credo-vai-agent",
            version: "1.0.0"
        });
        this.credo = new CredoAgent({ port: 3000, name: 'faber' });
    }

    async setupTools() {
        await this.credo.initializeAgent();

        // initialize handlers
        const didToolHandler = new DidToolHandler(this.credo);

        // register tools
        const tools = [
            didToolHandler.resolveDidTool(),
        ];

        for (const tool of tools) {
            this.server.tool(tool.name, tool.description, tool.schema, tool.handler);
        }
    }

    async start() {
        try {
            await this.setupTools();
            const transport = new StdioServerTransport();
            await this.server.connect(transport);
        } catch (err) {
            console.error("Fatal error in start():", err);
            process.exit(1);
        }
    }
}

const agentServer = new AgentMcpServer();
agentServer.start();
