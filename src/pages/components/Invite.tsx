import store from "@src/libs/store"
import {
  config,
  fromKey,
  gameKey,
  inviteCodeKey,
  loadingKey,
  navKey,
  openKey
} from "@src/config"
import useStorage from "@src/libs/storage"
import type { GameInfo, CommonProps, NavType } from "@src/types"
import { Button, Flex, Input, Typography } from "antd"
import { useNotifier } from "@src/app"
import { useEffect, useRef } from "react"

function Invite({ rpc }: CommonProps) {
  const notifier = useNotifier()
  const [inviteCode, setInviteCode] = useStorage(inviteCodeKey, "")
  const [loading, setLoading] = useStorage(loadingKey, false)
  const [gameInfo, setGameInfo] = useStorage<GameInfo>(gameKey)
  const [nav, setNav] = useStorage<NavType>(navKey, "")
  const timer = useRef<NodeJS.Timeout>()
  useEffect(() => {
    return clearInterval(timer.current)
  }, [])
  const processInvite = () => {
    if (rpc) {
      setLoading(true)
      notifier(rpc.createPlayerBySign(inviteCode.trim()))
        .then((res) => {
          let retry = 0
          timer.current = setInterval(() => {
            retry++
            if (gameInfo && gameInfo.invitedBy) {
              setNav("Nav")
            } else {
              notifier(rpc.getGameInfo()).then((gameInfo) => {
                if (gameInfo) {
                  setGameInfo(gameInfo)
                  setNav("Nav")
                }
              })
            }
            if (retry >= 5) {
              clearInterval(timer.current)
            }
          }, 1000)
        })
        .finally(() => setLoading(false))
    } else {
      store
        .set(openKey, true)
        .then(() => store.set(fromKey, "invite"))
        .then(() => {
          chrome.tabs.create({
            url: config.allow.substring(0, config.allow.lastIndexOf("/"))
          })
        })
    }
  }
  return (
    <Flex vertical={true} wrap="wrap" gap={28} style={{ padding: 18 }}>
      {}
      <Typography.Title level={1} style={{ marginTop: 0 }}>
        Import code
      </Typography.Title>
      <Typography.Title level={5}>
        You need a code to participage. If you don't have one, you can find a
        code on our{" "}
        <Typography.Link
          style={{ color: "#1677ff" }}
          href="https://twitter.com/xwallst"
          target="_blank">
          Twitter profile
        </Typography.Link>
        .
      </Typography.Title>
      <Input
        value={inviteCode}
        placeholder="Enter invite code"
        size="large"
        onChange={(e) => setInviteCode(e.target.value)}
      />
      <Button type="primary" size="large" onClick={processInvite}>
        {rpc ? "Proceed" : "Open Twitter and Proceed"}
      </Button>
    </Flex>
  )
}

export default Invite
