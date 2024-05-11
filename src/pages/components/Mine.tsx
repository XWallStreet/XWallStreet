import {
  ArrowLeftOutlined,
  CopyOutlined,
  FileTextFilled,
  GlobalOutlined,
  TwitterOutlined,
  UserAddOutlined
} from "@ant-design/icons"
import {
  Button,
  Card,
  Flex,
  Image,
  List,
  Select,
  Space,
  Table,
  Tabs,
  Typography
} from "antd"
import type { ColumnsType } from "antd/es/table"
import { useEffect, useState } from "react"

import arbIcon from "@assets/img/arb.png"
import bIcon from "@assets/img/b.png"
import ethIcon from "@assets/img/eth.png"
import {
  accountKey,
  ethBalnaceKey,
  gameKey,
  rewardKey,
  userinfoKey,
  xwsBalnaceKey
} from "@src/config"
import useStorage from "@src/libs/storage"
import type { GameInfo, RewardInfo, UserInfo } from "@src/types"
import Web3 from "web3"

const columns: ColumnsType<any> = [
  {
    key: "player",
    title: "Player",
    dataIndex: ["returnValues", "player"],
    render(player: string) {
      return (
        player.substring(0, 6) + "..." + player.substring(player.length - 4)
      )
    }
  },
  {
    key: "reward",
    title: "Reward",
    dataIndex: ["returnValues", "reward"],
    render(reward: bigint) {
      return Web3.utils.fromWei(reward, "ether")
    }
  }
]
const aboutBtns = [
  {
    icon: <GlobalOutlined />,
    text: "Website",
    href: "https://docs.xwallst.com"
  },
  {
    icon: <TwitterOutlined />,
    text: "Twitter",
    href: "https://twitter.com/xwallst"
  },
  {
    icon: <FileTextFilled />,
    text: "Docs",
    href: "https://docs.xwallst.com"
  }
]
export default function Mine() {
  const [account] = useStorage(accountKey, "")
  const [userInfo] = useStorage<UserInfo>(userinfoKey)
  const [gameInfo] = useStorage<GameInfo>(gameKey)
  const [showReward, setShowReward] = useState(false)
  const [xwsBalnace, setXwsBalnace] = useStorage(xwsBalnaceKey, "0")
  const [ethBalnace, setEthBalnace] = useStorage(ethBalnaceKey, "0")
  const [rewardInfos] = useStorage<Array<RewardInfo>>(rewardKey)
  const [rewardTotal, setRewardTotal] = useState(0)
  useEffect(() => {
    if (rewardInfos) {
      const rewardCount = rewardInfos.reduce((acc, cur) => {
        return (
          acc + Number(Web3.utils.fromWei(cur.returnValues.reward, "ether"))
        )
      }, 0)
      setRewardTotal(rewardCount)
    }
  }, [rewardInfos])
  const mineInfo = (
    <>
      <Flex
        justify="space-between"
        style={{
          padding: "12px 12px 20px 12px",
          borderBottom: "1px solid rgb(209, 217, 221)"
        }}>
        <Select
          value="arbitrum"
          options={[
            {
              label: (
                <Space>
                  <Image preview={false} width={24} src={arbIcon} />
                  <Typography.Text>Arbitrum</Typography.Text>
                </Space>
              ),
              value: "arbitrum"
            }
          ]}
          style={{
            width: 130
          }}
        />
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          style={{
            borderRadius: 8
          }}
          onClick={() => setShowReward(true)}>
          Invite Friend
        </Button>
      </Flex>
      <Flex
        vertical={true}
        gap={8}
        wrap="wrap"
        justify="center"
        align="center"
        style={{
          margin: "20px 0"
        }}>
        <Image
          preview={false}
          style={{ borderRadius: 28 }}
          width={56}
          src={userInfo?.profileImage}
        />
        <div>@{userInfo?.name}</div>
        <Typography.Text
          style={{ fontSize: 16 }}
          copyable={{
            text: account,
            icon: <CopyOutlined />
          }}>
          {`${account.substring(0, 6)}...${account.substring(
            account.length - 4
          )}`}
        </Typography.Text>
      </Flex>
      <Tabs
        size="large"
        items={[
          {
            key: "tokens",
            label: "Tokens",
            children: (
              <List size="small">
                <List.Item>
                  <List.Item.Meta
                    avatar={<Image preview={false} width={36} src={ethIcon} />}
                    title="ETH"
                    description={ethBalnace}
                  />
                </List.Item>
                <List.Item>
                  <List.Item.Meta
                    avatar={<Image preview={false} width={36} src={bIcon} />}
                    title="XWS"
                    description={xwsBalnace}
                  />
                </List.Item>
              </List>
            )
          },
          {
            key: "settings",
            label: "Settings",
            children: (
              <Flex gap={8} vertical>
                <Typography.Title level={5} style={{ marginTop: -5 }}>
                  About XWS
                </Typography.Title>
                <Space.Compact block>
                  {aboutBtns.map((item, index) => {
                    return (
                      <Button
                        onClick={() => {
                          chrome.tabs.create({
                            url: item.href
                          })
                        }}
                        style={{
                          width: 133
                        }}
                        key={index}
                        icon={item.icon}>
                        {item.text}
                      </Button>
                    )
                  })}
                </Space.Compact>
              </Flex>
            )
          }
        ]}
      />
    </>
  )
  const mineReward = (
    <Flex vertical={true} wrap="wrap" gap={20} style={{ padding: 8 }}>
      <Flex
        justify="flex-start"
        align="flex-start"
        gap={10}
        style={{ fontSize: 20 }}>
        <div style={{ cursor: "pointer" }} onClick={() => setShowReward(false)}>
          <ArrowLeftOutlined />
        </div>
        <div>Home</div>
      </Flex>
      <Flex gap={72}>
        <div>
          <Typography.Title level={4}>Your invite</Typography.Title>
          <Typography.Title level={1}>
            {rewardInfos?.length || 0}
          </Typography.Title>
        </div>
        <div>
          <Typography.Title level={4}>Reward from Booster</Typography.Title>
          <Typography.Title level={1}>
            <Image
              preview={false}
              src={bIcon}
              width={28}
              style={{ marginTop: -18 }}
            />
            {" " + rewardTotal}
          </Typography.Title>
        </div>
      </Flex>
      <Flex
        justify="space-between"
        align="center"
        style={{
          padding: "10px 20px",
          backgroundColor: "var(--xws-color-border-secondary)",
          borderRadius: 16
        }}>
        <h3>Copy invite code</h3>
        <Typography.Text
          style={{ fontSize: 16 }}
          copyable={{
            tooltips: false,
            icon: <CopyOutlined />
          }}>
          {gameInfo?.inviteCode
            ? "xws_".concat(gameInfo?.inviteCode?.toString())
            : "No invite code"}
        </Typography.Text>
      </Flex>
      <Card title="History" bordered={false} bodyStyle={{ padding: 0 }}>
        <Table
          columns={columns}
          dataSource={rewardInfos}
          pagination={false}></Table>
      </Card>
    </Flex>
  )
  return <>{!userInfo ? null : showReward ? mineReward : mineInfo}</>
}
