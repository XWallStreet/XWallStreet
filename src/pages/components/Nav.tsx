import {
  AimOutlined,
  HomeFilled,
  HomeOutlined,
  ShopFilled,
  ShoppingOutlined,
  WalletOutlined
} from "@ant-design/icons"
import { Button, Col, Flex, Row, Tag, Tooltip, Typography } from "antd"
import React, { useState } from "react"

import { cssHide, xwsBalnaceKey } from "@src/config"
import type { CommonProps } from "@src/types"

import Home from "./Home"
import Store from "./Store"
import useStorage from "@src/libs/storage"

interface INavBtn {
  iconDefault: React.ReactNode
  iconActive: React.ReactNode
  text: string
  tip?: string
}

const NavBtns: INavBtn[] = [
  {
    iconDefault: <HomeOutlined />,
    iconActive: <HomeFilled />,
    text: "Home"
  },
  {
    iconDefault: <ShoppingOutlined />,
    iconActive: <ShopFilled />,
    text: "Store"
  },
  {
    iconDefault: <AimOutlined />,
    iconActive: <AimOutlined />,
    text: "More",
    tip: "Comming soon..."
  }
]

export default function Nav({ rpc }: CommonProps) {
  const [mapCom] = useState(() => [
    (payload: CommonProps) => <Home {...payload} />,
    (payload: CommonProps) => <Store {...payload} />
  ])
  const [index, setIndex] = useState(0)
  const [xwsBalnace, setXwsBalnace] = useStorage(xwsBalnaceKey, "0")
  return (
    <>
      <Row style={{ marginBottom: 18 }}>
        <Col span={16}>
          <Flex gap="small" wrap="wrap">
            {NavBtns.map((navBtn, i) => (
              <Tooltip key={i} title={navBtn.tip} placement="top">
                <Button
                  key={i}
                  type={i == index ? "primary" : "default"}
                  size="middle"
                  icon={i == index ? navBtn.iconActive : navBtn.iconDefault}
                  onClick={() => (!navBtn.tip ? setIndex(i) : null)}>
                  {navBtn.text}
                </Button>
              </Tooltip>
            ))}
          </Flex>
        </Col>
        <Col span={8}>
          <Flex justify="flex-end">
            <Tag
              style={{
                fontSize: 12,
                height: 20,
                lineHeight: 1.6,
                marginTop: 6,
                fontWeight: 600
              }}
              bordered={false}
              icon={<WalletOutlined style={{ marginRight: -5 }} />}>
              <Typography.Text ellipsis={true}>
                {Number(xwsBalnace).toFixed(6)}
              </Typography.Text>
            </Tag>
          </Flex>
        </Col>
      </Row>
      {mapCom.map((componentFn, key) =>
        componentFn({
          rpc,
          extraClassName: key !== index ? cssHide : "",
          key
        })
      )}
    </>
  )
}
