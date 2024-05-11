import { Select, Space, Image, Typography } from "antd"
import icon from "@assets/img/icon-128.png"
import ethIcon from "@assets/img/eth.png"
import type { ChainSelProps } from "@src/types"
export default function ChainSel({ onChange }: ChainSelProps) {
  return (
    <Select
      onChange={onChange}
      defaultValue="ETH"
      options={[
        {
          label: (
            <Space>
              <Image preview={false} width={24} src={ethIcon} />
              <Typography.Text>ETH</Typography.Text>
            </Space>
          ),
          value: "ETH"
        },
        {
          label: (
            <Space>
              <Image preview={false} width={24} src={icon} />
              <Typography.Text>XWS</Typography.Text>
            </Space>
          ),
          value: "XWS"
        }
      ]}
    />
  )
}
