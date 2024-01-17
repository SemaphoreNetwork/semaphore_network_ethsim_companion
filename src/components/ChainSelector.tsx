import React, { useState } from "react";
import { ReactElement } from "react";
import { Row, Col, Cascader, Typography } from "antd";

const { Text } = Typography;

interface Option {
  value: string;
  label: string;
  children?: Option[];
  disabled?: boolean;
}

const CHAINS = {
  "1": {
    key: "ethereum",
    params: {
      chainId: "0x1",
      rpcUrls: ["https://eth.llamarpc.com"],
      chainName: "Ethereum Mainnet",
      nativeCurrency: {
        name: "ETHEREUM",
        symbol: "ETH",
        decimals: 18,
      },
      blockExplorerUrls: ["https://etherscan.com/"],
    },
  },
  "11155111": {
    key: "sepolia",
    params: {
      chainId: "0xAA36A7",
      rpcUrls: ["https://gateway.tenderly.co/public/sepolia"],
      chainName: "Sepolia Testnet",
      nativeCurrency: {
        name: "ETHEREUM",
        symbol: "ETH",
        decimals: 18,
      },
      blockExplorerUrls: ["https://sepolia.etherscan.io/"],
    },
  },
};

type ChainSelectorProps = {
  disabled?: boolean;
};

export function ChainSelector(props: ChainSelectorProps): ReactElement {
  const { disabled } = props;

  const [selectedOption, setSelectedOption] = useState<string>(
    // Default value:
    (() => {
      try {
        const chainId = (window as any).ethereum.networkVersion;
        console.log("current chain ID", chainId);
        if (!!CHAINS[chainId]) {
          return chainId;
        }
      } catch (e) {
        console.log(e);
        return "unsupported";
      }
    })()
  );

  // TODO: Add support for chains 3, 4, 5, 42.
  const options: Option[] = [
    {
      value: "1",
      label: "Ethereum (1)",
    },
    {
      value: "11155111",
      label: "Sepolia (11155111)",
    },
    {
      value: "unsupported",
      label: "Unsupported",
      disabled: true,
    },
  ];

  const onChange = async (value: string[]) => {
    const chainId = value[0];
    const previouslySelected = selectedOption;
    setSelectedOption(chainId);
    try {
      (await (window as any).ethereum.request({
        method: "wallet_addEthereumChain",
        params: [CHAINS[chainId].params],
      })) as Promise<any>;
    } catch (e) {
      setSelectedOption(previouslySelected);
      console.log(e);
    }
  };

  return (
    <>
      <Row>
        <Col span={28}>
          <Text strong style={{ marginRight: "14px" }}>
            Chain ID:
          </Text>
          <Cascader
            disabled={disabled}
            options={options}
            onChange={onChange}
            value={selectedOption as any}
          />
        </Col>
      </Row>
    </>
  );
}
