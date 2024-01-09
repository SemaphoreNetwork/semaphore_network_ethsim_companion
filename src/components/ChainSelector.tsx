import React from "react";
import { ReactElement } from "react";
import { Cascader } from "antd";

interface Option {
  value: string;
  label: string;
  children?: Option[];
}

// TODO: Should come from app config?
const DEFAULT_TESTNET = true;

export function ChainSelector(): ReactElement {
  // TODO: Add support for chains 3, 4, 5, 42.
  const options: Option[] = [
    {
      value: "ethereum",
      label: "Ethereum (1)",
    },
    {
      value: "sepolia",
      label: "Sepolia (11155111)",
    },
  ];

  const optionParams = {
    ethereum: {
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
    sepolia: {
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
  };

  const onChange = async (value: string[]) => {
    const key = value[0];
    console.log(value);
    try {
      (await (window as any).ethereum.request({
        method: "wallet_addEthereumChain",
        params: [optionParams[key]],
      })) as Promise<any>;
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Cascader
      defaultValue={[DEFAULT_TESTNET ? "sepolia" : "ethereum"]}
      options={options}
      onChange={onChange}
    />
  );
}
