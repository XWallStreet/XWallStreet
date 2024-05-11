import fs from "node:fs"
const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf8"))

const manifest = {
  manifest_version: 3,
  name: packageJson.displayName,
  author: packageJson.author,
  version: packageJson.version,
  description: packageJson.description,
  permissions: ["storage"],
  background: {
    service_worker: "src/pages/background/index.js",
    type: "module"
  },
  action: {
    default_popup: "src/pages/popup/index.html",
    default_icon: "icon-34.png",
    default_icon: "icon-128.png"
  },
  icons: {
    128: "icon-128.png"
  },
  content_scripts: [
    {
      matches: ["https://twitter.com/*"],
      js: ["src/pages/content/index.js"]
    }
  ],
  web_accessible_resources: [
    {
      matches: ["<all_urls>"],
      resources: [
        "assets/js/*.js",
        "icon-128.png",
        "icon-34.png",
        "img/*",
        "game/*",
        "*.png",
        "*.jpg"
      ]
    }
  ]
}

export default manifest
