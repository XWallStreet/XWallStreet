import {
  LoginOutlined,
  DownloadOutlined,
  UploadOutlined
} from "@ant-design/icons"
import {
  ADAPTER_EVENTS,
  ADAPTER_STATUS,
  WALLET_ADAPTERS,
  type ADAPTER_STATUS_TYPE
} from "@web3auth/base"
import { Web3AuthNoModal } from "@web3auth/no-modal"
import { OpenloginAdapter } from "@web3auth/openlogin-adapter"
import {
  Button,
  Drawer,
  Spin,
  Tooltip,
  Image,
  Space,
  InputNumber,
  Input,
  Typography,
  Modal,
  Flex,
  Form
} from "antd"
import React, { useEffect, useState } from "react"

import Nav from "@pages/components/Nav"
import Signin from "@pages/components/Signin"
import {
  accountKey,
  auth0LoginParams,
  config,
  ethBalnaceKey,
  fromKey,
  gameKey,
  loadingKey,
  navKey,
  openKey,
  openLoginAdapterOptions,
  rewardKey,
  sessionKey,
  statusKey,
  tokenKey,
  web3AuthNoModalOptions,
  xwsBalnaceKey
} from "@src/config"
import { log } from "@src/libs/common"
import useStorage from "@src/libs/storage"
import store from "@src/libs/store"
import { ThemeProvider, mount, useNotifier, useWarning } from "@src/app"

import Rpc from "@src/libs/rpc"
import Invite from "@pages/components/Invite"
import icon from "@assets/img/icon-128.png"
import type { GameInfo, NavType, RewardInfo } from "@src/types"
import ChainSel from "@pages/components/ChainSel"

let web3auth: Web3AuthNoModal
let rpc: Rpc
const initedKey = "inited"
const hasSession: () => boolean = () => {
  return /sessionId":"\w+/.test(localStorage.getItem(sessionKey))
}
const onStatusChnage = (status: ADAPTER_STATUS_TYPE, data?: any) => {
  log("onStatusChnage", status)
  store.set(loadingKey, status === ADAPTER_STATUS.CONNECTING)
  store.set(statusKey, status)
  if (status === ADAPTER_STATUS.CONNECTED) {
    rpc = new Rpc(web3auth.provider)
    store.get(tokenKey).then((token) => {
      if (!token) {
        web3auth.authenticateUser().then((res) => {
          store.set(tokenKey, res.idToken)
        })
      }
      rpc.getAccounts().then((account) => {
        store.set(accountKey, account)
      })
    })
  }
  if (status === ADAPTER_STATUS.DISCONNECTED) {
    initWeb3Auth()
  }
}
const initWeb3Auth = () => {
  log("initWeb3Auth")
  store.set(loadingKey, true)
  store.set(statusKey, ADAPTER_STATUS.NOT_READY)
  store.set(initedKey, false)
  web3auth = new Web3AuthNoModal(web3AuthNoModalOptions)
    .configureAdapter(new OpenloginAdapter(openLoginAdapterOptions))
    .on(ADAPTER_EVENTS.NOT_READY, () =>
      onStatusChnage(ADAPTER_EVENTS.NOT_READY)
    )
    .on(ADAPTER_EVENTS.READY, () => onStatusChnage(ADAPTER_EVENTS.READY))
    .on(ADAPTER_EVENTS.CONNECTING, () =>
      onStatusChnage(ADAPTER_EVENTS.CONNECTING)
    )
    .on(ADAPTER_EVENTS.CONNECTED, (data) =>
      onStatusChnage(ADAPTER_EVENTS.CONNECTED, data)
    )
    .on(ADAPTER_EVENTS.DISCONNECTED, () =>
      onStatusChnage(ADAPTER_STATUS.DISCONNECTED)
    )
    .on(ADAPTER_EVENTS.ERRORED, (error) =>
      onStatusChnage(ADAPTER_EVENTS.ERRORED, error)
    )
  web3auth
    .init()
    .then(() => {
      log("inited")
      store.set(initedKey, true)
      store.set(loadingKey, false)
      return store.get(fromKey)
    })
    .then((from) => {
      "popup" === from && login()
      store.set(fromKey, "")
    })
    .catch((err) => {
      log(err)
      location.reload()
    })
}
initWeb3Auth()

const login = () => {
  log(web3auth, auth0LoginParams)
  web3auth?.connectTo(WALLET_ADAPTERS.OPENLOGIN, auth0LoginParams)
}
const InjectContent = () => {
  const notifier = useNotifier()
  const warning = useWarning()
  const [nav, setNav] = useStorage<NavType>(navKey, "")
  const [account] = useStorage(accountKey, "")
  const [token, setToken] = useStorage(tokenKey)
  const [status] = useStorage(statusKey, "")
  const [inited] = useStorage(initedKey, false)
  const [open, setOpen] = useStorage(openKey, false)
  const [loading, setLoading] = useStorage(loadingKey, true)
  const [gameInfo, setGameInfo] = useStorage<GameInfo>(gameKey)
  const [xwsBalnace, setXwsBalnace] = useStorage(xwsBalnaceKey, "0")
  const [ethBalnace, setEthBalnace] = useStorage(ethBalnaceKey, "0")
  const [rewardInfos, setRewardInfos] = useStorage<Array<RewardInfo>>(rewardKey)
  const [comp, setComp] = useState<React.ReactNode>(null)
  const [modalTitle, setModalTitle] = useState("")
  const [swapValue, setSwapValue] = useState("0")
  const [withdrawForm] = Form.useForm()

  const showModal = (title: string) => {
    if (!account) {
      warning("Please sign in first.")
      return
    }
    setModalTitle(title)
  }

  const modalInfoMap = {
    Deposit: {
      title: "Deposit",
      content: (
        <Flex vertical gap={12}>
          <Typography.Text>Asset</Typography.Text>
          <ChainSel />
          <Typography.Text>Address</Typography.Text>
          <Space.Compact>
            <Input
              value={`${account?.substring(0, 6)}...${account?.substring(
                account?.length - 4
              )}`}
            />
            <Button
              type="primary"
              onClick={() => navigator.clipboard.writeText(account)}>
              Copy Address
            </Button>
          </Space.Compact>
        </Flex>
      )
    },
    Withdraw: {
      title: "Withdraw",
      footer: (
        <Button
          type="primary"
          onClick={() => {
            withdrawForm
              .validateFields()
              .then((res) => {
                log(res)
                setModalTitle("")
                if (res.asset === "ETH") {
                  notifier(
                    rpc.signTransaction(res.address, res.amount),
                    "Transact successfully"
                  ).then(reloadAmount)
                }
                if (res.asset === "XWS") {
                  notifier(
                    rpc.transferXWS(res.address, res.amount),
                    "Transact successfully"
                  ).then(reloadAmount)
                }
              })
              .catch((err) => log(err))
          }}>
          Withdraw
        </Button>
      ),
      content: (
        <Form
          layout="vertical"
          form={withdrawForm}
          name="withdraw"
          initialValues={{ asset: "ETH" }}>
          <Form.Item label="Asset" name="asset">
            <ChainSel />
          </Form.Item>
          <Form.Item
            label="Target Address"
            name="address"
            rules={[
              { required: true, message: "Please input target address!" }
            ]}>
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item
            label="Amount"
            name="amount"
            rules={[{ required: true, message: "Please input amount!" }]}>
            <InputNumber<string>
              style={{ width: "100%" }}
              stringMode
              min="0"
              step="0.1"
            />
          </Form.Item>
        </Form>
      )
    }
  }
  const reloadAmount = (flag) => {
    if (!flag) {
      return
    }
    notifier<GameInfo>(rpc.getGameInfo()).then((gameInfo) =>
      setGameInfo(gameInfo)
    )
    notifier<string>(rpc.getXWSbalance()).then((res) => setXwsBalnace(res))
    notifier<string>(rpc.getBalance()).then((res) => setEthBalnace(res))
    notifier<Array<RewardInfo>>(rpc.getPastEvents()).then((res) => {
      setRewardInfos(res)
    })
  }
  const compMap = {
    Nav: <Nav rpc={rpc} />,
    Invite: <Invite rpc={rpc} />,
    Signin: <Signin login={login} />
  }
  const extra = (gameInfo && gameInfo.invitedBy) ? (
    <Space className="xws-header-icon-container">
      {}
      <Tooltip title="Deposit">
        <Button
          size="small"
          type="primary"
          icon={<DownloadOutlined />}
          onClick={() => showModal("Deposit")}></Button>
      </Tooltip>
      <Tooltip title="Withdraw">
        <Button
          size="small"
          type="primary"
          icon={<UploadOutlined />}
          onClick={() => showModal("Withdraw")}></Button>
      </Tooltip>
      {config.env === "development" && (
        <Button
          size="small"
          icon={<LoginOutlined />}
          onClick={() => {
            store.removeAll()
            web3auth?.logout({ cleanup: true })
          }}
        />
      )}
    </Space>
  ) : null
  useEffect(() => {
    if (!inited) {
      setNav("")
      setLoading(true)
    } else {
      if (status === ADAPTER_STATUS.CONNECTED) {
        setInterval(reloadAmount, 30 * 1000, true)
        reloadAmount(true)
        notifier<GameInfo>(rpc.getGameInfo(), null).then((gameInfo) => {
          setGameInfo(gameInfo)
          gameInfo && gameInfo.inviteCode ? setNav("Nav") : setNav("Invite")
        })
        rpc.checkApprove().then((res) => {
          log("checkApprove", res)
          res <= 0 && rpc.approve()
        })
      } else {
        setLoading(false)
        setNav("Signin")
      }
    }
  }, [inited])
  return (
    <>
      <Tooltip title="X Wall Street Extension" placement="left">
        <div
          onClick={() => setOpen(true)}
          style={{
            position: "fixed",
            top: 100,
            right: 2,
            width: 30,
            height: 30,
            cursor: "pointer"
          }}>
          <Image preview={false} src={icon} />
        </div>
      </Tooltip>
      <Drawer
        id="xws-drawer"
        title="X Wall Street"
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
        width={430}
        keyboard={false}
        mask={false}
        extra={
          extra
        }
        styles={{
          header: {
            padding: "var(--xws-padding)"
          },
          body: {
            padding: "12px"
          }
        }}>
        <Modal
          title={
            <Typography.Title
              level={5}
              style={{
                borderBottom: "1px solid rgb(209, 217, 221)",
                padding: "0 10px 10px"
              }}>
              {modalInfoMap[modalTitle]?.title}
            </Typography.Title>
          }
          centered
          open={!!modalTitle}
          footer={[modalInfoMap[modalTitle]?.footer]}
          onCancel={() => setModalTitle("")}>
          {modalInfoMap[modalTitle]?.content}
        </Modal>
        <Spin spinning={loading} style={{ minHeight: "30vh" }}>
          {nav ? compMap[nav] : null}
        </Spin>
      </Drawer>
    </>
  )
}

mount(
  <ThemeProvider>
    <InjectContent />
  </ThemeProvider>
)
