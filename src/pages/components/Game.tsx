import Phaser from "phaser"
import { getBuildings, getImage, log } from "@src/libs/common"
import { useEffect, useRef, useState } from "react"

import type { BuildingItem, WorkerInfo } from "@src/types"
import useStorage from "@src/libs/storage"
import { workerKey } from "@src/config"
import { getShadowRoot } from "@src/app"
const gameContainerId = "game-container"
const sceneKey = "MainScene"
export class MainScene extends Phaser.Scene {
  public buildings: Array<BuildingItem> = []
  public imageGroup: Phaser.GameObjects.Group
  constructor() {
    super(sceneKey)
  }

  preload() {
    this.load.image("background", getImage("game/phaser_bg.jpg"))
    this.buildings = Object.values(getBuildings(true))
    this.buildings.forEach((item) => {
      if (item.index != -1) {
        this.load.image(item.name, item.src)
        this.load.image(item.inactiveName, item.inactiveSrc)
      }
    })
  }

  create() {
    const background = this.add.image(0, 0, "background").setOrigin(0)
    const camera = this.cameras.main
    camera.setBounds(0, 0, background.width, background.height)
    camera.centerOn(background.width / 2, background.height / 2)
    camera.setZoom(0.1165)

    this.input.on("wheel", (pointer, currentlyOver, dx, dy, dz, event) => {
      const zoomAmount = 0.0006 * dy
      const newZoom = Phaser.Math.Clamp(camera.zoom + zoomAmount, 0.1165, 0.45)
      camera.zoomTo(newZoom, 200)
    })

    this.input.on("pointermove", function (p) {
      if (!p.isDown) return
      camera.scrollX -= ((p.x - p.prevPosition.x) / camera.zoom) * 0.5
      camera.scrollY -= ((p.y - p.prevPosition.y) / camera.zoom) * 0.5
    })
    this.events.emit("created")
  }

  placeBuilding(workerInfos?: Array<WorkerInfo>) {

    if (this.imageGroup) {
      this.imageGroup.clear(true, true)
    }
    this.imageGroup = this.add.group()
    this.buildings
      .filter((item) => item.enable)
      .forEach((item) => {
        const img = this.add
          .image(item.positions[0], item.positions[1], item.name)
          .setScale(item.scale)

          const _img = this.add
          .image(item.positions[0], item.positions[1], item.inactiveName)
          .setScale(item.scale)
        if (
          workerInfos &&
          workerInfos.length &&
          workerInfos.find((w) => w.avatar === item.index)
        ) {
          img.setAlpha(1)
          _img.setAlpha(0)
        } else {
          img.setAlpha(0)
          _img.setAlpha(1)
        }
        
        this.imageGroup.add(img)
        this.imageGroup.add(_img)
      })
  }


  cameraControl(cam: Phaser.Cameras.Scene2D.Camera, pos: number) {
    if (pos === 0) {
      cam.pan(767, 1096, 2000, "Power2")
      cam.zoomTo(4, 3000)
    } else if (pos === 1) {
      cam.pan(703, 1621, 2000, "Elastic")
      cam.zoomTo(2, 3000)
    } else if (pos === 2) {
      cam.pan(256, 623, 2000, "Sine.easeInOut")
      cam.zoomTo(1, 3000)
    }
  }
}
const gameConfig: Phaser.Types.Core.GameConfig = {
  banner: false,
  type: Phaser.AUTO,
  audio: {
    noAudio: true
  },
  width: 404,
  height: 476,
  backgroundColor: "#fff",
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        x: 100,
        y: 200
      }
    }
  },
  scene: MainScene
}

const Game = () => {
  const [workerInfos] = useStorage<Array<WorkerInfo>>(workerKey)
  const sceneRef = useRef<MainScene>()
  useEffect(() => {

    const gameInstance = new Phaser.Game({
      ...gameConfig,
      parent: getShadowRoot().querySelector<HTMLElement>(`#${gameContainerId}`)
    })

    gameInstance.events.once("ready", () => {
      sceneRef.current = gameInstance.scene.getScene<MainScene>(sceneKey)
    })

    return () => {

      gameInstance.destroy(true)
    }
  }, [])
  useEffect(() => {
    if (sceneRef && sceneRef.current) {
      sceneRef.current.events.on("created", () => {
        log("should update game", workerInfos)
        sceneRef.current.placeBuilding(workerInfos)
      })
    }
  }, [sceneRef, workerInfos])

  return (
    <div
      id={gameContainerId}
      style={{
        display: "flex",
        width: gameConfig.width,
        height: gameConfig.height
      }}></div>
  )
}

export default Game
