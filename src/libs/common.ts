import { config } from "@src/config"
import type { BuildingItem } from "@src/types"

export const isDarkTheme: () => boolean = () => {
  return false
}


export const log: (message?: any, ...optionalParams: any[]) => void = (
  message?,
  ...optionalParams
) => {
  if (config.env === "development") {
    console.log(message, ...optionalParams)
  }
}

export const convertWeToEthAmount: (
  weToEthAmount: number,
  decimals: number
) => string = (weToEthAmount, decimals) => {
  const ethAmount: bigint = BigInt(weToEthAmount)
  const divider: bigint = BigInt(10 ** decimals)
  return (ethAmount / divider).toString()
}

export const getImage: (imageSrc: string) => string = (imageName) => {
  return `chrome-extension://${chrome.runtime.id}/${imageName}`
}

export const getBuildings: (onlyEnable?: boolean) => {
  [key: number]: BuildingItem
} = (onlyEnable) => {
  const buildings: Array<BuildingItem> = [
    {
      index: -1,
      sort: 10000,
      src: "",
      name: "Satoshi Nakamoto",
      enable: true,
      positions: [0, 0],
      scale: 3,
      buyPrice: "46"
    },
    {
      index: 0,
      sort: 9900,
      src: "",
      inactiveSrc: "",
      name: "New York Stock Exchange",
      inactiveName: "_New York Stock Exchange",
      enable: true,
      positions: [980, 1720],
      scale: 3,
      buyPrice: "46"
    },
    {
      index: 1,
      sort: 9800,
      src: "",
      inactiveSrc: "",
      name: "Alexander Hamilton U.S. Customs House",
      inactiveName: "_Alexander Hamilton U.S. Customs House",
      enable: true,
      positions: [920, 2520],
      scale: 3,
      buyPrice: "46"
    },
    {
      index: 2,
      sort: 9700,
      src: "",
      inactiveSrc: "",
      name: "American Banknote Company Building",
      inactiveName: "_American Banknote Company Building",
      enable: true,
      positions: [2150, 2120],
      scale: 3,
      buyPrice: "46"
    },
    {
      index: 3,
      sort: 9600,
      src: "",
      inactiveSrc: "",
      name: "Carnegie Hall",
      inactiveName: "_Carnegie Hall",
      enable: true,
      positions: [2880, 2360],
      scale: 3,
      buyPrice: "46"
    },
    {
      index: 4,
      sort: 9500,
      src: "",
      inactiveSrc: "",
      name: "Company Bank Building",
      inactiveName: "_Company Bank Building",
      enable: true,
      positions: [1620, 1860],
      scale: 2.5,
      buyPrice: "46"
    },
    {
      index: 5,
      sort: 9400,
      src: "",
      inactiveSrc: "",
      name: "New York Stock Exchange Building",
      inactiveName: "_New York Stock Exchange Building",
      enable: true,
      positions: [2300, 600],
      scale: 3,
      buyPrice: "46"
    },
    {
      index: 6,
      sort: 9300,
      src: "",
      inactiveSrc: "",
      name: "Federal Hall National Memorial",
      inactiveName: "_Federal Hall National Memorial",
      enable: true,
      positions: [3400, 1800],
      scale: 3,
      buyPrice: "46"
    },
    {
      index: 7,
      sort: 9200,
      src: "",
      inactiveSrc: "",
      name: "St. John's Cathedral",
      inactiveName: "_St. John's Cathedral",
      enable: true,
      positions: [3880, 2500],
      scale: 3,
      buyPrice: "46"
    },
    {
      index: 8,
      sort: 9100,
      src: "",
      inactiveSrc: "",
      name: "Guggenheim Museum",
      inactiveName: "_Guggenheim Museum",
      enable: false,
      positions: [2000, 2000],
      scale: 3,
      buyPrice: "46"
    },
    {
      index: 9,
      sort: 9000,
      src: "",
      inactiveSrc: "",
      name: "Flatiron Building",
      inactiveName: "_Flatiron Building",
      enable: false,
      positions: [2000, 2000],
      scale: 3,
      buyPrice: "46"
    },
    {
      index: 10,
      sort: 8900,
      src: "",
      inactiveSrc: "",
      name: "Hurst Tower",
      inactiveName: "_Hurst Tower",
      enable: false,
      positions: [2000, 2000],
      scale: 3,
      buyPrice: "46"
    },
    {
      index: 11,
      sort: 8800,
      src: "",
      inactiveSrc: "",
      name: "Madison Square Garden",
      inactiveName: "_Madison Square Garden",
      enable: false,
      positions: [2000, 2000],
      scale: 3,
      buyPrice: "46"
    },
    {
      index: 12,
      sort: 8700,
      src: "",
      inactiveSrc: "",
      name: "Trading Building",
      inactiveName: "_Trading Building",
      enable: false,
      positions: [2000, 2000],
      scale: 3,
      buyPrice: "46"
    },
    {
      index: 13,
      sort: 8600,
      src: "",
      inactiveSrc: "",
      name: "World Trade Center Transportation Hub",
      inactiveName: "_World Trade Center Transportation Hub",
      enable: false,
      positions: [2000, 2000],
      scale: 3,
      buyPrice: "46"
    },
    {
      index: 14,
      sort: 8500,
      src: "",
      inactiveSrc: "",
      name: "Trinity Church",
      inactiveName: "_Trinity Church",
      enable: false,
      positions: [2000, 2000],
      scale: 3,
      buyPrice: "46"
    },
    {
      index: 15,
      sort: 8400,
      src: "",
      inactiveSrc: "",
      name: "Rockefeller Plaza",
      inactiveName: "_Rockefeller Plaza",
      enable: false,
      positions: [2000, 2000],
      scale: 3,
      buyPrice: "46"
    },
    {
      index: 16,
      sort: 8300,
      src: "",
      inactiveSrc: "",
      name: "Empire State Building",
      inactiveName: "_Empire State Building",
      enable: false,
      positions: [2000, 2000],
      scale: 3,
      buyPrice: "46"
    },
    {
      index: 17,
      sort: 8200,
      src: "",
      inactiveSrc: "",
      name: "World Trade Center",
      inactiveName: "_World Trade Center",
      enable: false,
      positions: [2000, 2000],
      scale: 3,
      buyPrice: "46"
    }
  ]
  buildings.sort((a, b) => {
    return b.sort - a.sort
  })
  const result = {}
  buildings.forEach((item) => {
    if (onlyEnable && !item.enable) {
      return
    }
    item.src = getImage(`img/bis/${item.name}.png`)
    if(item.inactiveName)
    {
      item.inactiveSrc = getImage(`img/bis/${item.inactiveName}.png`)
    }
    result[item.index] = item
  })
  return result
}
