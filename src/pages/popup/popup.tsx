import Mine from "@src/pages/components/Mine"
import { config, fromKey, gameKey, tokenKey } from "@src/config"
import useStorage from "@src/libs/storage"
import store from "@src/libs/store"

import Signin from "@pages/components/Signin"
import { useEffect, useState } from "react"

import Invite from "@pages/components/Invite"
import { log } from "@src/libs/common"
import type { GameInfo } from "@src/types"
const Popup = () => {
  const [token] = useStorage<string>(tokenKey)
  const [gameInfo] = useStorage<GameInfo>(gameKey)
  const [comp, setComp] = useState<React.ReactNode>(null)
  const [initialized, setInitialized] = useState(false)
  const login = () =>
    store.set(fromKey, "popup").then((res: string) => {
      log("login in popup", res)
      chrome.tabs.create({
        url: config.allow.substring(0, config.allow.lastIndexOf("/"))
      })
    })
  useEffect(() => {
    if (initialized) {
      if (!token) {
        setComp(<Signin login={login} />)
      } else {
        if (gameInfo) {
          setComp(<Mine />)
        } else {
          setComp(<Invite rpc={null} />)
        }
      }
    } else {
      setInitialized(true)
    }
  }, [token, gameInfo, initialized])
  return comp
}

export default Popup
