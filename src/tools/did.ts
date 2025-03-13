import { CredoAgent } from "../agent.js";
import { ZodString, z } from "zod"
import { ToolDefinition } from "../types.js";

export class DidToolHandler {
    credo: CredoAgent

    constructor(credo: CredoAgent) {
        this.credo = credo;
    }

    resolveDidTool(): ToolDefinition<{ did: ZodString }> {
        return {
            name: "resolve-did",
            description: "Resolve a didDocument and its metadata",
            schema: {
                did: z.string().startsWith("did:cheqd:").describe("Decentralized identifier for cheqd"),
            },
            handler: async ({ did }) => {
                const result = await this.credo.agent.dids.resolveDidDocument(did);
    
                return {
                    content: [
                        {
                            type: "resource",
                            resource: {
                                text: "text",
                                uri: "uri",
                                document: result
                            }
                        }
                    ]
                };
            }
        };
    }
}