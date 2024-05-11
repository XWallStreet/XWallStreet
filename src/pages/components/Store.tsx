import {
  Button,
  Col,
  Flex,
  Image,
  Modal,
  Row,
  Space,
  Tag,
  Typography
} from "antd"

import bIcon from "@assets/img/b.png"
import type {
  BuildingItem,
  CommonProps,
  GameInfo,
  WorkerInfo
} from "@src/types"
import { getBuildings } from "@src/libs/common"
import { useNotifier } from "@src/app"
import useStorage from "@src/libs/storage"
import { gameKey, workerKey } from "@src/config"
import { useEffect, useState } from "react"

export default function Store({ rpc, extraClassName }: CommonProps) {
  const [buildings, setBuildings] = useState<Array<BuildingItem>>()
  const [modalOpen, setModalOpen] = useState(false)
  const [buyInfo, setBuyInfo] = useState<BuildingItem>()
  const [gameInfo, setGameInfo] = useStorage<GameInfo>(gameKey)
  const [workerInfos, setWorkerInfos] = useStorage<Array<WorkerInfo>>(workerKey)
  const [workerIds, setWorkerIds] = useState<Array<number>>([])

  useEffect(() => {
    if (workerInfos && workerInfos.length) {
      setBuildings(Object.values(getBuildings()))
      setWorkerIds(workerInfos.map((item) => item.avatar))
    }
  }, [workerInfos])
  const handleOk = () => {
    setModalOpen(false)
  }
  const handleCancel = () => {
    setModalOpen(false)
  }
  const showBuyInfo = (item) => {
    setBuyInfo(item)
    setModalOpen(true)
  }
  const notifier = useNotifier()

  const onBuy = () => {
    setModalOpen(false)
    notifier(rpc.createWorker(buyInfo.index), "Buy successfully").then(() => {
      notifier(
        rpc
          .getGameInfo()
          .then((gameInfo) => setGameInfo(gameInfo))
          .then(() => rpc.getWorkerInfos(gameInfo.workerIds))
          .then((workerInfos) => setWorkerInfos(workerInfos))
      )
    })
  }
  return (
    <>
      <Modal
        title={
          <Typography.Title
            level={5}
            style={{
              borderBottom: "1px solid rgb(209, 217, 221)",
              padding: "0 10px 10px"
            }}>
            {buyInfo?.name}
          </Typography.Title>
        }
        centered
        width={280}
        open={modalOpen}
        footer={[
          <Button type="primary" onClick={onBuy}>
            Buy
          </Button>
        ]}
        onOk={handleOk}
        onCancel={handleCancel}>
        <Flex justify="space-between" align="center">
          <Typography.Title level={4}>Price</Typography.Title>
          <Space>
            <Image preview={false} src={bIcon} width={20} />
            <Typography.Title level={5}>{buyInfo?.buyPrice || 0}</Typography.Title>
          </Space>
        </Flex>
        <Flex vertical gap={8} justify="center" align="center">
          <Image preview={false} width={120} src={buyInfo?.src} />
        </Flex>
      </Modal>
      <Row className={extraClassName} gutter={[16, 16]}>
        {buildings
          ?.filter((item) => item.index > -1)
          .map((item) => (
            <Col
              key={item.index}
              span={8}
              style={{
                filter:
                  !item.enable || workerIds.includes(item.index)
                    ? "grayscale(1)"
                    : "filter: grayscale(0)",
                cursor:
                  !item.enable || workerIds.includes(item.index)
                    ? "not-allowed"
                    : "pointer"
              }}
              onClick={() => {
                if (item.enable && !workerIds.includes(item.index)) {
                  showBuyInfo(item)
                }
              }}>
              <div className="xws-building-wrap">
                <Tag
                  bordered={false}
                  style={{
                    position: "absolute",
                    left: 5,
                    top: 5,
                    borderRadius: 16,
                    backgroundColor: "rgba(0, 0, 0, 0.08)"
                  }}>
                  {"Lv ".concat(
                    (
                      workerInfos.find((w) => w.avatar === item.index)?.level ||
                      0
                    ).toString()
                  )}
                </Tag>
                <Flex
                  vertical={true}
                  className="xws-building"
                  justify="center"
                  align="center"
                  gap={4}>
                  <Image
                    preview={false}
                    width={60}
                    height={60}
                    src={item.src}
                  />
                  <Typography.Text
                    ellipsis={{ tooltip: item.name }}
                    style={{ padding: "0 4px" }}>
                    {item.name}
                  </Typography.Text>
                  <Space size={6}>
                    <Image preview={false} width={20} src={bIcon} />
                    <Typography.Text>{item.buyPrice}</Typography.Text>
                  </Space>
                </Flex>
              </div>
            </Col>
          ))}
      </Row>
    </>
  )
}
