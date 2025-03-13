import type { InitConfig } from '@credo-ts/core'

import { Agent, DidsModule } from '@credo-ts/core'
import { AskarModule } from '@credo-ts/askar'
import { agentDependencies } from '@credo-ts/node'
import {
  CheqdAnonCredsRegistry,
  CheqdDidRegistrar,
  CheqdDidResolver,
  CheqdModule,
  CheqdModuleConfig,
} from '@credo-ts/cheqd'
import { AnonCredsModule } from '@credo-ts/anoncreds'
import { ariesAskar } from '@hyperledger/aries-askar-nodejs'
import { anoncreds } from '@hyperledger/anoncreds-nodejs'
import { DidCommModuleConfigOptions } from '@credo-ts/didcomm'

const config: InitConfig = {
    label: 'docs-agent-nodejs',
    walletConfig: {
        id: 'wallet-id',
        key: 'testkey0000000000000000000000000',
    },
}

export class CredoAgent {
    public port: number
    public name: string
    public config: InitConfig
    public agent: Agent<ReturnType<typeof getAskarAnonCredsModules>>

    public constructor({ port, name }: { port: number; name: string }) {
        this.name = name
        this.port = port

        const config = {
            label: name,
            walletConfig: {
                id: name,
                key: name,
            },
        } satisfies InitConfig

        this.config = config

        this.agent = new Agent({
            config,
            dependencies: agentDependencies,
            modules: getAskarAnonCredsModules({ endpoints: [`http://localhost:${this.port}`] })
        })
    }

    public async initializeAgent() {
        await this.agent.initialize()
    }
}

function getAskarAnonCredsModules(didcommConfig: DidCommModuleConfigOptions) {
  
    return {
      anoncreds: new AnonCredsModule({
        registries: [new CheqdAnonCredsRegistry()],
        anoncreds,
      }),
      cheqd: new CheqdModule(
        new CheqdModuleConfig({
          networks: [
            {
              network: 'testnet',
              cosmosPayerSeed:
                'robust across amount corn curve panther opera wish toe ring bleak empower wreck party abstract glad average muffin picnic jar squeeze annual long aunt',
            },
          ],
        })
      ),
      dids: new DidsModule({
        resolvers: [new CheqdDidResolver()],
        registrars: [new CheqdDidRegistrar()],
      }),
      askar: new AskarModule({
        ariesAskar,
      }),
    } as const
}

  
const agent = new Agent({
  config,
  dependencies: agentDependencies,
  modules: {
    dids: new DidsModule({
      registrars: [new CheqdDidRegistrar()],
      resolvers: [new CheqdDidResolver()],
    }),

    // AnonCreds
    anoncreds: new AnonCredsModule({
      registries: [new CheqdAnonCredsRegistry()],
      anoncreds,
    }),

    // Add cheqd module
    cheqd: new CheqdModule(
      new CheqdModuleConfig({
        networks: [
          {
            network: 'testnet',
            cosmosPayerSeed: '<cosmos payer seed or mnemonic>',
          },
        ],
      })
    ),
    // Indy VDR can optionally be used with Askar as wallet and storage implementation
    askar: new AskarModule({
      ariesAskar,
    }),
  },
})

export default agent