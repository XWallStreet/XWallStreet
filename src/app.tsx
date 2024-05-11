import ConfigProvider from "antd/es/config-provider"
import { createContext, useContext, type ReactNode } from "react"
import refreshOnUpdate from "virtual:reload-on-update-in-view"

import { cssPrefix, loadingKey, xwsRoot } from "@src/config"
import { isDarkTheme, log } from "@src/libs/common"
import { notification } from "antd"
import { StyleProvider } from "@ant-design/cssinjs"
import appStyle from "@assets/style/app.css?inline"
import { createRoot } from "react-dom/client"
import store from "@src/libs/store"

const isDark = isDarkTheme()

refreshOnUpdate("src")
const appWrapId = "__XWS-ROOT__"
let shadowRoot: ShadowRoot
let container: HTMLElement
export const getContainer: () => HTMLElement = () => {
  if (!container) {
    container = getShadowRoot().querySelector(`#${xwsRoot}`)
  }
  return container
}

export const getShadowRoot: () => ShadowRoot = () => {
  if (!shadowRoot) {
    shadowRoot = document.getElementById(appWrapId).shadowRoot
  }
  return shadowRoot
}

export const mount: (component: React.ReactElement) => void = (component) => {
  const root = document.createElement("div")
  root.id = appWrapId
  document.body.append(root)

  const rootIntoShadow = document.createElement("div")
  rootIntoShadow.id = xwsRoot

  const shadowRoot = root.attachShadow({ mode: "open" })
  shadowRoot.appendChild(rootIntoShadow)

  const styleElement = document.createElement("style")
  styleElement.innerHTML = appStyle
  shadowRoot.appendChild(styleElement)

  createRoot(rootIntoShadow).render(
    <StyleProvider container={shadowRoot}>{component}</StyleProvider>
  )
}

export const NotificationContext = createContext<{
  notifier: <T>(fn: Promise<T>, succMsg?: string) => Promise<T>
  warning: (message: string) => void
}>(null)

export const useNotifier = () => {
  return useContext(NotificationContext).notifier
}
export const useWarning = () => {
  return useContext(NotificationContext).warning
}
notification.config({
  duration: 4.5
})
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [notifyApi, notifyHolder] = notification.useNotification({
    getContainer,
    placement: "bottomRight"
  })
  const notifier: <T>(fn: Promise<T>, succMsg?: string) => Promise<T> = (
    fn,
    succMsg
  ) => {
    ; (succMsg === null || succMsg) && store.set(loadingKey, true)
    return fn
      .then((res) => {
        log("notifier res", res)
        if (succMsg) {
          notifyApi.success({
            message: (
              <NotificationContext.Consumer>
                {() => succMsg}
              </NotificationContext.Consumer>
            )
          })
        }
        return res
      })
      .catch((err) => {
        log("notifier err", err?.data?.message ?? err.message)
        notifyApi.error({
          message: (
            <NotificationContext.Consumer>
              {() => err?.data?.message ?? err.message}
            </NotificationContext.Consumer>
          )
        })
        return null
      })
      .finally(
        () => (succMsg === null || succMsg) && store.set(loadingKey, false)
      )
  }
  const warning: (message: string) => void = (message) => {
    notifyApi.warning({
      message: (
        <NotificationContext.Consumer>
          {() => message}
        </NotificationContext.Consumer>
      )
    })
  }
  return (
    <ConfigProvider
      prefixCls={cssPrefix}
      getPopupContainer={getContainer}
      theme={{
        cssVar: { prefix: cssPrefix },
        token: {
          colorPrimary: isDark ? "#fff" : "#303030", 
          colorTextBase: isDark ? "#fff" : "#000", 
          colorBgBase: isDark ? "#303030" : "#fff", 
          fontSize: 12,
          motion: false,
          zIndexPopupBase: 100000003
        },
        components: {
          Select: {
            optionSelectedBg: isDark ? "#303030" : "#fff",
            optionSelectedColor: isDark ? "#fff" : "#303030",
            controlOutlineWidth: 0,
            zIndexPopup: 100000004
          },
          Typography: {
            titleMarginTop: 0,
            titleMarginBottom: 0,
            colorLink: isDark ? "#fff" : "#303030",
            colorLinkHover: isDark ? "#fff" : "#303030",
            marginXS: 0,
            marginXXS: 0
          },
          Input: {
            activeBorderColor: "none",
            activeShadow: "none"
          },
          InputNumber: {
            activeBorderColor: "none",
            activeShadow: "none"
          },
          Button: {
            primaryShadow: "0",
            defaultShadow: "0"
          },
          Avatar: {
            colorTextPlaceholder: isDark ? "#393939" : "rgba(0, 0, 0, 0.04)"
          },
          Notification: {
            zIndexPopup: 100000001
          },
          Drawer: {
            zIndexPopup: 100000000
          },
          Tooltip: {
            zIndexPopup: 100000002
          }
        }
      }}>
      <NotificationContext.Provider value={{ notifier, warning }}>
        {children}
        {notifyHolder}
      </NotificationContext.Provider>
    </ConfigProvider>
  )
}