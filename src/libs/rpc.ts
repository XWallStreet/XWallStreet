import { GameAbi } from "@src/libs/gameAbi"
import { GameConfig } from "@src/libs/gameConfig"
import { SwapAbi } from "@src/libs/swapAbi"
import { TokenAbi } from "@src/libs/tokenAbi"
import Web3, { Contract, type Address, type Numbers } from "web3"
import type { IProvider, RequestArguments } from "@web3auth/base"
import type {
  FactoryInfo,
  GameConfigType,
  GameInfo,
  RewardInfo,
  WorkerInfo
} from "@src/types"
import { contractAddress, tokenAddress, swapAddress } from "@src/config"
import { log } from "@src/libs/common"

export default class Rpc {
  private web3: Web3
  private provider: IProvider
  private gameContract: Contract<typeof GameAbi>
  private tokenContract: Contract<typeof TokenAbi>
  private swapContract: Contract<typeof SwapAbi>
  private maxApproval = 0n
  private account: string
  private privateKey: string

  constructor(provider: IProvider) {
    this.provider = provider
    this.web3 = new Web3(this.provider as any)
    this.gameContract = new this.web3.eth.Contract(GameAbi, contractAddress)
    this.tokenContract = new this.web3.eth.Contract(TokenAbi, tokenAddress)
    this.swapContract = new this.web3.eth.Contract(SwapAbi, contractAddress)
    this.maxApproval = this.web3.utils.toBigInt(
      "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    )
    this.init()
  }

  init() {
    Promise.all([this.getAccounts(), this.getPrivateKey()]).catch((err) =>
      log("rpc init error:", err)
    )
  }

  formatArray<T>(arr: Array<T>): Array<T> {
    return arr.map((item) => this.format(item))
  }

  format<T>(obj: T): T {
    if (typeof obj === "bigint") {
      return Number(obj) as T
    } else if (typeof obj === "object" && obj !== null) {
      if (Array.isArray(obj)) {
        return obj.map((item) => this.format(item)) as T
      } else {
        const newObj: any = {}
        for (const key in obj) {
          if (!Number.isNaN(Number(key)) || key === "__length__") {
            delete obj[key]
            continue
          }
          newObj[key] = this.format(obj[key])
        }
        return newObj
      }
    }
    return obj
  }

  getConfig(desiredType: number, desiredLevel: number): GameConfigType {
    const desiredConfig = GameConfig.find(
      (item) => item.type === desiredType && item.info.level === desiredLevel
    )
    return desiredConfig
  }

  getChainId(): Promise<bigint> {
    return this.web3.eth.getChainId()
  }

  getPrivateKey(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.privateKey) {
        resolve(this.privateKey)
      } else {
        this.provider
          .request<RequestArguments<unknown>, string>({
            method: "eth_private_key"
          })
          .then((res) => {
            this.privateKey = res
            resolve(res)
          })
          .catch((err) => reject(err))
      }
    })
  }

  getAccounts(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.account && this.account.length > 0) {
        log("account:", this.account)
        resolve(this.account)
      } else {
        this.web3.eth
          .getAccounts()
          .then((res) => {
            this.account = res[0] as string
            resolve(res[0])
          })
          .catch((err) => reject(err))
      }
    })
  }

  getBalance(): Promise<string> {
    return this.web3.eth.getBalance(this.account).then((amount) => {
      return this.web3.utils.fromWei(amount, "ether")
    })
  }

  getXWSbalance(): Promise<string> {
    log("self:", this.account)
    log("tokenContract", this.tokenContract)
    return this.tokenContract.methods
      .balanceOf(this.account)
      .call<number>()
      .then((amount) => {
        return this.web3.utils.fromWei(amount, "ether")
      })
  }

  transferXWS(toAddress: Address, amount: Numbers): Promise<any> {
    return new Promise((resolve, reject) => {
      const weivalue = this.web3.utils.toWei(amount, "ether")
      if (!toAddress.startsWith("0x")) {
        toAddress = "0x".concat(toAddress)
      }
      log("senderAddress:", this.account)
      log("toAddress:", toAddress)
      log("weivalue:", weivalue)
      log("tokenAddress:", tokenAddress)

      const transactionObject = {
        from: this.account,
        to: tokenAddress,
        data: this.tokenContract.methods
          .transfer(toAddress, weivalue)
          .encodeABI(),
        type: "0x2",
        maxFeePerGas: 14658400000,
        maxPriorityFeePerGas: 1000000000
      }

      this.web3.eth.accounts
        .signTransaction(transactionObject, this.privateKey)
        .then((signedTransaction) => {
          const serializedTx = signedTransaction.rawTransaction

          this.web3.eth
            .sendSignedTransaction(serializedTx)
            .on("receipt", (res) => {
              resolve(res)
            })
            .on("error", (error) => {
              reject(error)
            })
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  getGasPrice(): Promise<bigint> {
    return this.web3.eth.getGasPrice()
  }

  getBlockNumber() {
    return this.web3.eth.getBlockNumber()
  }

  signTransaction(toAddress: Address, amount: Numbers): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getGasPrice().then((gasPrice) => {
        const weivalue = this.web3.utils.toWei(amount, "ether")
        log("senderAddress:", this.account)
        log("senderPrivateKey:", this.privateKey)
        log("gasPrice:", gasPrice)
        const transactionObject = {
          from: this.account,
          to: toAddress,
          value: weivalue,
          type: "0x2",
          maxFeePerGas: 14658400000,
          maxPriorityFeePerGas: 1000000000
        }
        this.web3.eth.accounts
          .signTransaction(transactionObject, this.privateKey)
          .then((signedTransaction) => {
            log("Signed Transaction:", signedTransaction)
            this.sendTransactionbySign(signedTransaction.rawTransaction).then(
              (res: any) => {
                resolve(res)
              },
              (error) => {
                reject(error)
              }
            )
          })
          .catch((error) => {
            reject(error)
          })
      })
    })
  }

  sendTransactionbySign(rawTransaction: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.web3.eth
        .sendSignedTransaction(rawTransaction)
        .on("receipt", (receipt) => resolve(receipt))
        .on("error", (error) => reject(error))
    })
  }

  approve(): Promise<any> {
    return new Promise((resolve, reject) => {
      log("maxApproval:", this.maxApproval)
      log("senderAddress:", this.account)
      log("tokenAddress:", tokenAddress)
      log("contractAddress:", contractAddress)
      const txObject = {
        from: this.account,
        to: tokenAddress,
        data: this.tokenContract.methods
          .approve(contractAddress, this.maxApproval)
          .encodeABI(),
        type: "0x2",
        maxFeePerGas: 14658400000,
        maxPriorityFeePerGas: 1000000000
      }
      this.web3.eth.accounts
        .signTransaction(txObject, this.privateKey)
        .then((signedTx) => {
          const serializedTx = signedTx.rawTransaction
          this.web3.eth
            .sendSignedTransaction(serializedTx)
            .on("receipt", (res) => {
              resolve(res)
            })
            .on("error", (error) => {
              reject(error)
            })
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  checkApprove(): Promise<any> {
    return this.tokenContract.methods
      .allowance(this.account, contractAddress)
      .call<number>()
      .then((res) => res)
  }

  createPlayerBySign(inviteCodeStr: string): Promise<any> {
    const codeInfo = (inviteCodeStr || "").split("_")
    const transactionParameters = {
      from: this.account,
      to: contractAddress,
      data: this.gameContract.methods
        .createPlayer(codeInfo[codeInfo.length - 1])
        .encodeABI(),
      type: "0x2",
      maxFeePerGas: 14658400000,
      maxPriorityFeePerGas: 1000000000
    }
    log("transactionParameters:", transactionParameters)
    return new Promise((resolve, reject) => {
      this.web3.eth.accounts
        .signTransaction(transactionParameters, this.privateKey)
        .then((signedTx) => {
          const serializedTx = signedTx.rawTransaction
          this.web3.eth
            .sendSignedTransaction(serializedTx)
            .on("receipt", (receipt) => resolve(receipt))
            .on("error", (error) => reject(error))
        })
        .catch((error) => reject(error))
    })
  }

  getGameInfo(): Promise<GameInfo> {
    const ts = Math.floor(Date.now() / 1000)
    return this.gameContract.methods
      .getGameInfo(this.account, ts)
      .call({ from: this.account })
      .then((res) => {
        return {
          ...this.format<GameInfo>((res as any).playerInfo),
          boosterSpeed: Number((res as any).boosterSpeed)
        }
      })
  }

  getWorkerInfo(workerId: Numbers): Promise<WorkerInfo> {
    return this.gameContract.methods
      .getWorkerInfo(workerId)
      .call({ from: this.account })
      .then((res) => {
        const workerInfo = this.format<WorkerInfo>({
          ...res,
          id: Number(workerId)
        } as any)
        return workerInfo
      })
  }

  getWorkerInfos(workerIds: Array<Numbers>): Promise<Array<WorkerInfo>> {
    const result: Array<WorkerInfo> = []
    const wokerInfoPromises = workerIds.map((workerId) => {
      return this.getWorkerInfo(workerId)
    })
    return Promise.all(wokerInfoPromises).then((res) => {
      res.forEach((item) => {
        result.push({
          ...(this.format(item) as any)
        })
      })
      return result
    })
  }

  getFactoryAndWorkerInfos(
    workerIds: Array<Numbers>
  ): Promise<Array<WorkerInfo | FactoryInfo>> {
    return this.getFactoryInfo().then((factoryInfo) => {
      return this.getWorkerInfos(workerIds).then((workerInfos) => {
        return [factoryInfo, ...workerInfos]
      })
    })
  }

  getFactoryInfo(): Promise<FactoryInfo> {
    return this.gameContract.methods
      .getFactoryInfo(this.account)
      .call({ from: this.account })
      .then((res) => {
        return this.format<FactoryInfo>({
          ...res,
          avatar: -1
        } as any)
      })
  }

  getPastEvents(): Promise<Array<RewardInfo>> {
    return this.web3.eth.getBlockNumber().then((currentBlockNumber) => {
      return this.gameContract
        .getPastEvents("RewardReceived" as any, {
          filter: {
            invitor: this.account
          },
          fromBlock: 0,
          toBlock: "latest"
        })
        .then((res) => this.format<Array<RewardInfo>>(res as any))
    })
  }

  createWorker(avatar: number): Promise<any> {
    const desiredType = 1
    const desiredLevel = 2
    return new Promise((resolve, reject) => {
      const levelData = this.getConfig(desiredType, desiredLevel).levelData 
      const proof = this.getConfig(desiredType, desiredLevel).proof
      log("createWorker", avatar, levelData, proof)

      const transactionParameters = {
        from: this.account,
        to: contractAddress,
        data: this.gameContract.methods
          .createWorker(avatar, levelData, proof)
          .encodeABI(),
        type: "0x2",
        maxFeePerGas: 14658400000,
        maxPriorityFeePerGas: 1000000000
      }

      log("transactionParameters:", transactionParameters)
      this.web3.eth.accounts
        .signTransaction(transactionParameters, this.privateKey)
        .then((signedTx) => {
          const serializedTx = signedTx.rawTransaction

          this.web3.eth
            .sendSignedTransaction(serializedTx)
            .on("receipt", (receipt) => {
              resolve(receipt)
            })
            .on("error", (error) => {
              reject(error)
            })
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  upgradeWorker(workerId: number, desiredLevel: number): Promise<any> {
    const desiredType = 1
    desiredLevel = desiredLevel > 2 ? desiredLevel : 2
    log("upgrade worker to ", desiredLevel, workerId)
    return new Promise((resolve, reject) => {
      const levelInfo = this.getConfig(desiredType, desiredLevel) 
      if (!levelInfo) {
        return reject("May have reached its current limit")
      }
      const levelData = levelInfo.levelData
      const proof = levelInfo.proof

      const transactionParameters = {
        from: this.account,
        to: contractAddress,
        data: this.gameContract.methods
          .upgradeWorker(workerId, levelData, proof)
          .encodeABI(),
        type: "0x2",
        maxFeePerGas: 14658400000,
        maxPriorityFeePerGas: 1000000000
      }

      log("transactionParameters:", transactionParameters)
      this.web3.eth.accounts
        .signTransaction(transactionParameters, this.privateKey)
        .then((signedTx) => {
          const serializedTx = signedTx.rawTransaction

          this.web3.eth
            .sendSignedTransaction(serializedTx)
            .on("receipt", (receipt) => {
              log("receipt", receipt)
              resolve(receipt)
            })
            .on("error", (error) => {
              log("error", error)
              reject(error)
            })
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  upgradeFactory(desiredLevel: number): Promise<any> {
    const desiredType = 2
    log("upgrade factory to ", desiredLevel)
    return new Promise((resolve, reject) => {
      const levelInfo = this.getConfig(desiredType, desiredLevel)
      if (!levelInfo) {
        return reject("May have reached its current limit")
      }
      const levelData = levelInfo.levelData 
      const proof = levelInfo.proof 
      const transactionParameters = {
        from: this.account,
        to: contractAddress,
        data: this.gameContract.methods
          .upgradeFactory(levelData, proof)
          .encodeABI(),
        type: "0x2",
        maxFeePerGas: 14658400000,
        maxPriorityFeePerGas: 1000000000
      }

      log("transactionParameters:", transactionParameters)
      this.web3.eth.accounts
        .signTransaction(transactionParameters, this.privateKey)
        .then((signedTx) => {
          const serializedTx = signedTx.rawTransaction

          this.web3.eth
            .sendSignedTransaction(serializedTx)
            .on("receipt", (receipt) => {
              log("receipt", receipt)
              resolve(receipt)
            })
            .on("error", (error) => {
              console.error("error", error)
              reject(error)
            })
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  claim(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      return this.gameContract.methods
        .claim()
        .send({ from: this.account })
        .on("receipt", (receipt) => {
          resolve(true)
        })
        .on("error", (error) => {
          reject(error)
        })
    })
  }

  gameToken(): Promise<any> {
    return this.gameContract.methods
      .gameToken()
      .call({ from: this.account })
      .then((res) => {
        return res
      })
  }

  swapXWSToken(amount: Numbers): Promise<any> {
    return new Promise((resolve, reject) => {
      const swapFunction = this.swapContract.methods.swap()
      const self = this.account
      const senderPrivateKey = this.privateKey

      this.web3.eth
        .getTransactionCount(self)
        .then((transactionCount) => {
          const nonce = transactionCount
          log("amount:", amount)
          log("nonce:", nonce)
          log("self:", self)
          log("senderPrivateKey:", senderPrivateKey)
          log("swapFunction:", swapFunction)

          const transactionParameters = {
            from: self,
            to: swapAddress,
            data: swapFunction.encodeABI(),
            nonce: nonce,
            value: this.web3.utils.toWei(amount.toString(), "ether"),
            type: "0x2",
            maxFeePerGas: 14658400000,
            maxPriorityFeePerGas: 1000000000
          }

          this.web3.eth.accounts
            .signTransaction(transactionParameters, senderPrivateKey)
            .then((signedTx) => {
              this.web3.eth
                .sendSignedTransaction(signedTx.rawTransaction)
                .on("receipt", (receipt) => {
                  log(receipt)
                  resolve(receipt)
                })
                .on("error", (error) => {
                  log(error)
                  reject(error)
                })
            })
            .catch((err) => reject(err))
        })
        .catch((err) => reject(err))
    })
  }
}
