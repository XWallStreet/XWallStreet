import { Button, Image, Space, Typography } from "antd"
import { type FC } from "react"

import logo from "@assets/img/icon-org.svg"
import type { SigninProps } from "@src/types"

const Signin: FC<SigninProps> = ({ login }) => {
  return (
    <Space
      direction="vertical"
      size="large"
      align="center"
      style={{
        marginTop: 120
      }}>
      <Image preview={false} width="120px" src={logo} />
      <Typography.Title level={2} style={{ textAlign: "center" }}>
        Construct building and earn profits on Twitter
      </Typography.Title>
      <Button
        type="primary"
        block
        style={{
          width: 368,
          marginBottom: 90
        }}
        onClick={login}>
        Sign in
      </Button>
    </Space>
  )
}

export default Signin
