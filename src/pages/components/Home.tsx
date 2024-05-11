import {
  BuildOutlined,
  ForwardFilled,
  StarOutlined,
  TransactionOutlined
} from "@ant-design/icons"
import { Avatar, Button, Col, Flex, Image, Row, Space, Tooltip, Typography } from "antd"
import { useEffect, useState } from "react"
import type { GameInfo, CommonProps, FactoryInfo, WorkerInfo } from "@src/types"

import Game from "@pages/components/Game"
import { getBuildings, log } from "@src/libs/common"
import { factoryKey, gameKey, workerKey } from "@src/config"
import useStorage from "@src/libs/storage"

import { useNotifier, useWarning } from "@src/app"
const allBuildings = getBuildings()
const Home = ({ rpc, extraClassName }: CommonProps) => {
  const [gameInfo, setGameInfo] = useStorage<GameInfo>(gameKey)
  const [factoryInfo, setFactoryInfo] = useStorage<FactoryInfo>(factoryKey)
  const [workerInfos, setWorkerInfos] = useStorage<Array<WorkerInfo>>(workerKey)
  const [building, setBuilding] = useState<FactoryInfo | WorkerInfo>()
  const [claimTime, setClaimTime] = useState(0)
  const warning = useWarning()
  const notifier = useNotifier()
  const onChangeBuilding = (item: typeof building) => {
    setBuilding(item)
  }
  const onClaim = () => {
    if (Date.now() - claimTime < 1000 * 60 * 10) {
      warning("Requires 10 minutes interval")
      return
    }
    if (gameInfo.earnings <= 0) {
      warning("No earnings to claim")
      return
    }
    notifier(rpc.claim(), "Claim successfully").then((res) => {
      if (res) {
        reloadGameinfo()
        setClaimTime(Date.now())
      }
    })
  }
  const reloadGameinfo = () => {
    rpc.getGameInfo().then((gameInfo) => {
      setGameInfo(gameInfo)
    })
  }
  const onUpgrade = () => {
    if (!building) {
      return
    }
    notifier(
      building.avatar === -1
        ? rpc.upgradeFactory(factoryInfo.level + 1)
        : rpc.upgradeWorker(building.id, building.level + 1),
      "Upgrade successfully"
    ).then((res) => res && reloadGameinfo())
  }
  useEffect(() => {
    if (gameInfo) {
      notifier<Array<FactoryInfo | WorkerInfo>>(
        rpc.getFactoryAndWorkerInfos(gameInfo.workerIds)
      ).then((infos) => {
        log("home infos", infos)
        if (!Array.isArray(infos)) {
          return
        }
        const [factoryInfo, ...workerInfos] = infos
        setFactoryInfo(factoryInfo as FactoryInfo)
        setWorkerInfos(workerInfos as WorkerInfo[])
        if (building) {
          setBuilding(
            building.avatar === -1 && factoryInfo.updatedTs
              ? factoryInfo
              : workerInfos[building.avatar]
          )
        } else {
          if (factoryInfo.level > 0) {
            setBuilding(factoryInfo)
          } else {
            setBuilding(workerInfos[0])
          }
        }
        log("home factory", factoryInfo)
        log("home worker", workerInfos)
      })
    }
  }, [gameInfo])

  return (
    <div className={extraClassName}>
      <Row
        align="middle"
        justify="center"
        style={{ textAlign: "center", marginBottom: 12 }}>
        <Col span={4}>
          <Typography.Paragraph style={{ marginBottom: 0 }}>
            Building
          </Typography.Paragraph>
          <Space size={4}>
            <BuildOutlined style={{ fontSize: "12px" }} rotate={90} />
            <Typography.Text>{gameInfo?.workerIds.length || 0}</Typography.Text>
          </Space>
        </Col>
        <Col span={8}>
          <Typography.Paragraph style={{ marginBottom: 0 }}>
            TotalEarnings
          </Typography.Paragraph>
          <Space size={4}>
            <TransactionOutlined style={{ fontSize: "12px" }} />
            <Typography.Text>
              {((gameInfo?.totalEarnings || 0) / 10 ** 18).toFixed(2)}
            </Typography.Text>
          </Space>
        </Col>
        <Col span={6}>
          <Typography.Paragraph style={{ marginBottom: 0 }}>
            Earnings
          </Typography.Paragraph>
          <Space size={4}>
            <StarOutlined style={{ fontSize: "12px" }} />
            <Typography.Text>
              {((gameInfo?.earnings || 0) / 10 ** 18).toFixed(2)}
            </Typography.Text>
          </Space>
        </Col>
        <Col span={4} offset={2}>
          <Space size="small">
            <Button size="small" onClick={onClaim}>
              Claim
            </Button>
          </Space>
        </Col>
      </Row>
      <Game />
      <Row
        gutter={[8, 16]}
        style={{
          marginTop: "12px",
          display: building ? "flex" : "none"
        }}>
        <Col span={10}>
          <Flex
            className="xws-upgrade-wrap"
            vertical
            gap={0}
            style={{
              border: "1px solid var(--xws-color-border-secondary)",
              textAlign: "center"
            }}>
            <Typography.Title
              level={5}
              ellipsis={{ tooltip: allBuildings[building?.avatar || 0]?.name }}
              style={{
                padding: "0 4px",
                backgroundColor: "var(--xws-color-border-secondary)"
              }}>
              {allBuildings[building?.avatar || 0]?.name}
            </Typography.Title>
            <Image
              preview={false}
              src={allBuildings[building?.avatar || 0]?.src}
              style={{
                borderTop: "1px solid var(--xws-color-border-secondary)",
                borderBottom: "1px solid var(--xws-color-border-secondary)",
                maxWidth: "100%",
                maxHeight: "100%"
              }}
            />
            <Flex className="xws-upgrade-item" justify="space-around">
              <Typography.Text className="text">
                Lv{building?.level || 0}
              </Typography.Text>
              <Tooltip title={`${(building?.speed || 0) / 10 ** 18} /h`}>
                <Typography.Text className="text">
                  <TransactionOutlined />
                  {` ${((building?.speed || 0) / 10 ** 18).toFixed(2)}/h`}
                </Typography.Text>
              </Tooltip>
              <Button
                style={{ marginTop: 3 }}
                type="primary"
                size="small"
                icon={<ForwardFilled rotate={-90} onClick={onUpgrade} />}
              />
            </Flex>
          </Flex>
        </Col>
        <Col span={14}>
          <Space
            className="xws-icon-group"
            wrap
            direction="horizontal"
            size={[12, 12]}
            style={{ textAlign: "center" }}>
            {[factoryInfo, ...(workerInfos || [])]
              ?.filter((item) => !!item && item.level > 0)
              ?.map((item, index) => (
                <Avatar
                  key={index}
                  shape="square"
                  size={68}
                  icon={
                    <Image
                      preview={false}
                      width={64}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%"
                      }}
                      src={allBuildings[item.avatar || 0].src}
                    />
                  }
                  onClick={() => onChangeBuilding(item)}>
                  {allBuildings[item.avatar || 0].name}
                </Avatar>
              ))}
          </Space>
        </Col>
      </Row>
    </div>
  )
}

export default Home
