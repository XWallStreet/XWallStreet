import { config, statusKey, tokenKey, userinfoKey } from "@src/config"
import store from "@src/libs/store"
import type { UserInfo } from "@src/types"
import { jwtDecode } from "jwt-decode"
import { ADAPTER_EVENTS } from "@web3auth/base"
import reloadOnUpdate from "virtual:reload-on-update-in-background-script"
import { log } from "@src/libs/common"
reloadOnUpdate("pages/background")
let userInfo: UserInfo
const init = () => {
  if (config.env === "development") {
    store.getAll().then(log)
  }
  store.get(tokenKey).then((token) => {
    if (token && !userInfo) {
      userInfo = jwtDecode(token)
      store.set(userinfoKey, userInfo)
    }
    if (
      !userInfo ||
      !userInfo.exp ||
      userInfo.exp < Math.floor(Date.now() / 1000)
    ) {
      store.remove(tokenKey)
      store.remove(userinfoKey)
    }
  })
}
init()
setInterval(() => {
  init()
}, 2000)
store.watch({
  [tokenKey]: (res) => {
    log(`token from ${res.oldValue} change to ${res.newValue}`)
    userInfo = res.newValue ? jwtDecode(res.newValue) : null
    store.set(userinfoKey, userInfo)
  },
  [statusKey]: (res) => {
    if (res.newValue === ADAPTER_EVENTS.DISCONNECTED) {
      store.remove(tokenKey)
      store.remove(userinfoKey)
    }
  }
})