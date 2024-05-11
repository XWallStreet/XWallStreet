import { CHAIN_NAMESPACES, type OPENLOGIN_NETWORK_TYPE } from "@web3auth/base"
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider"
import type { Web3AuthNoModalOptions } from "@web3auth/no-modal"
import type {
  OpenloginAdapterOptions,
  TypeOfLogin
} from "@web3auth/openlogin-adapter"

interface Config {
  allow: string
  env: "development" | "production"
  w3aClientId: string
  w3aAuthNetWork: OPENLOGIN_NETWORK_TYPE
  w3aVerifier: string
  w3aTypeOfLogin: TypeOfLogin
  w3aWhiteLabelAppName: string
  w3aWhiteLabelAppUrl: string
  auth0ClientId: string
  auth0Domain: string
  auth0VerifierIdField: string
  auth0Connection: string
  chainId: string
  chainDisplayName: string
  chainBlockExplorer: string
  chainTicker: string
  chainTickerName: string
  chainRpcTarget: string
}

export const config: Config = {
  allow: import.meta.env.VITE_APP_SITE_URL,
  env: import.meta.env.VITE_APP_ENV as "development" | "production",
  w3aClientId: import.meta.env.VITE_APP_W3A_CLIENT_ID,
  w3aAuthNetWork: import.meta.env
    .VITE_APP_W3A_AUTH_NETWORK as OPENLOGIN_NETWORK_TYPE,
  w3aVerifier: import.meta.env.VITE_APP_W3A_VERIFIER,
  w3aTypeOfLogin: import.meta.env.VITE_APP_W3A_TYPE_OF_LOGIN as TypeOfLogin,
  w3aWhiteLabelAppName: import.meta.env.VITE_APP_W3A_WHITE_LABEL_APP_NAME,
  w3aWhiteLabelAppUrl: import.meta.env.VITE_APP_W3A_WHITE_LABEL_APP_URL,
  auth0ClientId: import.meta.env.VITE_APP_AUTH0_CLIENT_ID,
  auth0Domain: import.meta.env.VITE_APP_AUTH0_DOMAIN,
  auth0VerifierIdField: import.meta.env.VITE_APP_AUTH0_VERIFIER_ID_FIELD,
  auth0Connection: import.meta.env.VITE_APP_AUTH0_CONNECTION,
  chainId: import.meta.env.VITE_APP_CHAIN_ID,
  chainDisplayName: import.meta.env.VITE_APP_CHAIN_DISPLAY_NAME,
  chainBlockExplorer: import.meta.env.VITE_APP_CHAIN_BLOCK_EXPLORER,
  chainTicker: import.meta.env.VITE_APP_CHAIN_TICKER,
  chainTickerName: import.meta.env.VITE_APP_CHAIN_TICKER_NAME,
  chainRpcTarget: import.meta.env.VITE_APP_CHAIN_RPC_TARGET
}

export const auth0LoginParams = {
  loginProvider: "jwt",
  extraLoginOptions: {
    domain: config.auth0Domain,
    verifierIdField: config.auth0VerifierIdField,
    connection: config.auth0Connection
  }
}

export const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: config.chainId,
  displayName: config.chainDisplayName,
  blockExplorer: config.chainBlockExplorer,
  ticker: config.chainTicker,
  tickerName: config.chainTickerName,
  rpcTarget: config.chainRpcTarget
}

export const web3AuthNoModalOptions: Web3AuthNoModalOptions = {
  clientId: config.w3aClientId,
  web3AuthNetwork: config.w3aAuthNetWork,
  sessionTime: 7 * 86400,
  chainConfig
}

export const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: {
    chainConfig
  }
})

export const sessionNS = "x-wall-street"
export const sessionKey = `openlogin_store_${sessionNS}`
export const openLoginAdapterOptions: OpenloginAdapterOptions = {
  privateKeyProvider,
  adapterSettings: {
    whiteLabel: {
      appName: config.w3aWhiteLabelAppName,
      appUrl: config.w3aWhiteLabelAppUrl
    },
    uxMode: "redirect",
    sessionNamespace: sessionNS,
    sessionTime: 10,
    loginConfig: {
      jwt: {
        verifier: config.w3aVerifier,
        typeOfLogin: config.w3aTypeOfLogin,
        clientId: config.auth0ClientId
      }
    }
  }
}

export const contractAddress = import.meta.env
  .VITE_APP_CHAIN_RPC_CONTRACT_ADDRESS
export const tokenAddress = import.meta.env.VITE_APP_CHAIN_RPC_TOKEN_ADDRESS
export const swapAddress = import.meta.env.VITE_APP_CHAIN_RPC_SWAP_ADDRESS

export const xwsRoot = "xws-root"
export const cssPrefix = "xws"
export const cssHide = "xws-hide"
export const allowUrls = import.meta.env.VITE_APP_SITE_URL.split(",")

export const openKey = "open"
export const fromKey = "from"
export const loadingKey = "loading"
export const tokenKey = "token"
export const statusKey = "status"
export const userinfoKey = "userinfo"
export const accountKey = "account"
export const themeKey = "theme"
export const gameKey = "game"
export const workerKey = "worker"
export const factoryKey = "factory"
export const inviteCodeKey = "invitecode"
export const xwsBalnaceKey = "xws"
export const ethBalnaceKey = "eth"
export const claimTimeKey = "claimtime"
export const rewardKey = "reward"
export const navKey = "nav"
