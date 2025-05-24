import { createConfig, http } from "wagmi"
import { base } from "wagmi/chains"
import { injected, walletConnect } from "wagmi/connectors"

export const config = createConfig({
  chains: [base],
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo-project-id",
    }),
  ],
  transports: {
    [base.id]: http(),
  },
})
