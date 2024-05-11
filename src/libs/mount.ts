import { xwsRoot } from "@src/config"
import appStyle from "@assets/style/app.css?inline"
import { createRoot } from "react-dom/client"

function mount(component: React.ReactElement) {
  const root = document.createElement("div")
  root.id = "__XWS-ROOT__"
  document.body.append(root)

  const rootIntoShadow = document.createElement("div")
  rootIntoShadow.id = xwsRoot

  const shadowRoot = root.attachShadow({ mode: "open" })
  shadowRoot.appendChild(rootIntoShadow)

  const styleElement = document.createElement("style")
  styleElement.innerHTML = appStyle
  shadowRoot.appendChild(styleElement)

  createRoot(rootIntoShadow).render(component)
}

export default mount