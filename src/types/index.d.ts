import type { ADAPTER_STATUS_TYPE } from "@web3auth/base"
import type { Web3AuthNoModal } from "@web3auth/no-modal"

import type Rpc from "@src/libs/rpc"

export type NavType = "Nav" | "Invite" | "Signin" | ""

export type CommonProps = {
  rpc: Rpc
  extraClassName?: string
  key?: number | string
}

export type ChainSelProps = {
  onChange?: (value, option) => void
}

export type SigninProps = {
  login: () => void
}

export type BuildingItem = {
  index: number
  src: string
  inactiveSrc?: string
  name: string
  inactiveName?: string
  enable: boolean
  sort: number
  positions?: Array<number>
  scale?: number
  buyPrice?: string
}

export type Wallet = {
  public_key: string
  type: string
  curve: string
}

export type UserInfo = {
  iat: number
  aud: string
  nonce: string
  iss: string
  wallets: Wallet[]
  name: string
  profileImage: string
  verifier: string
  verifierId: string
  aggregateVerifier: string
  exp: number
}

export type GameInfo = {
  boosterSpeed: number 
  updatedTs: number 
  material: number 
  totalMaterial: number 
  reward: number 
  rewardDeadlineTs: number 
  totalReward: number 
  earnings: number 
  totalEarnings: number 
  totalWorkerSpeed: number 
  totalFactorySpeed: number 
  invitedBy: number 
  inviteCode: number 
  workerIds: Array<number> 
}

export type WorkerInfo = {
  id: number 
  updatedTs: number 
  level: number
  speed: number 
  avatar: number
}

export type FactoryInfo = {
  id?: number 
  updatedTs: number
  level: number
  speed: number 
  minWorkerLevel: number 
  avatar?: number 
}

export type RewardInfo = {
  address: string
  blockHash: string
  blockNumber: number
  data: string
  event: string
  logIndex: number
  raw: {
    data: string
    topics: Array<string>
  }
  removed: boolean
  returnValues: {
    inviteCode: number
    invitor: string
    player: string
    reward: number
  }
  signature: string
  topics: Array<string>
  transactionHash: string
  transactionIndex: number
}

export type RpcMethodNames = {
  [K in keyof Rpc]: Rpc[K] extends (...args: any[]) => any ? K : never
}[keyof Rpc]

export type RpcMethods = Record<
  RpcMethodNames,
  (...args: any[]) => Promise<any>
>

export type GameConfigType = {
  type: number
  info: {
    level: number
    speed: string
    fullPrice?: string
    fullReward?: string
    upgradedPrice: string
    upgradedReward: string
    rewardDuration: string
    featureFlag?: number
    minWorkerLevel?: number
  }
  levelData: Array<string>
  proof: Array<string>
}
