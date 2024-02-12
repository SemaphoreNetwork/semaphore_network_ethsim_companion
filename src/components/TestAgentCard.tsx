import { ReactElement, useEffect, useState } from "react";
import { Card, Typography, Row, Col, Button } from "antd";
import { WifiOutlined } from "@ant-design/icons";
import { Contract, Wallet, providers } from "ethers";

import SemaphoreHSSArtifact from "../artifacts/contracts/SemaphoreHSS.sol/SemaphoreHSS.json";
import TestERC20 from "../artifacts/contracts/TestERC20.sol/TestERC20.json";
import { InjectedConnector } from "@web3-react/injected-connector";

const TEST_CHAIN_ID = 11155111;
const TEST_RPC = new providers.JsonRpcProvider(
  "https://rpc2.sepolia.org",
  TEST_CHAIN_ID
);

export function TestAgentCard({
  name,
  agentWallet,
  address,
  publicKey,
  isProvider,
  subscriberCount,
}: {
  name: string;
  agentWallet?: Wallet;
  injectedSigner: InjectedConnector;
  address: string;
  publicKey: string;
  isProvider?: boolean;
  subscriberCount?: number;
}): ReactElement {
  const [isConnected, updateConnectionStatus] = useState<boolean>(false);
  const [tokensAmount, updateTokensAmount] = useState<string>("0");
  const [ethAmount, updateEthAmount] = useState<string>("0");
  const [openChannelId, updateOpenChannelId] = useState<string>("");
  const [isSpendingApproved, updateIsSpendingApproved] =
    useState<boolean>(false);

  useEffect((): void => {
    // Retrieve agent TEST tokens balance.
    getTokensBalance();
    // Retrieve agent ETH.
    getEthBalance();
  });

  const getTokensBalance = async () => {
    const TestERC20Contract = new Contract(
      TestERC20.address,
      TestERC20.abi,
      TEST_RPC
    );
    const res = await TestERC20Contract.balanceOf(address);
    const amount = parseInt(res.toString());
    updateTokensAmount(amount.toString());
  };

  const getEthBalance = async () => {
    const res = await TEST_RPC.getBalance(address);
    updateEthAmount(res.toString());
  };

  const sendEth = async () => {
    const res = await operator.sendTransaction({
      to: subscriber.address,
      value: BigInt("50000000000000000") - BigInt(currentAmount.toString()), // 0.05 ETH
    });
    const receipt = await res.wait();
    console.log("Fund ETH tx:", receipt.hash);
  };

  const mintTokens = async (amount: string) => {
    const TestERC20Contract = new Contract(
      TestERC20.address,
      TestERC20.abi,
      agentWallet
    );
    const res = await TestERC20Contract.mint(
      agentWallet.address,
      BigInt(amount)
    );
    const receipt = await res.wait();
    console.log("Mint tx:", receipt.hash);
    await getTokensBalance();
  };

  return (
    <Card
      title={
        <Row>
          <Col span={21}>
            <Typography.Title level={5} style={{ marginTop: "8px" }}>
              {name}
            </Typography.Title>
          </Col>
          <Col span={3}>
            {!isProvider ? (
              <WifiOutlined
                style={{
                  marginTop: "12px",
                  color: isConnected ? "#0099ff" : "#666699",
                }}
              />
            ) : (
              <></>
            )}
          </Col>
        </Row>
      }
      style={{ width: 200 }}
    >
      <Typography.Paragraph ellipsis={true}>
        Address: {agentWallet ? agentWallet.address : address}
      </Typography.Paragraph>
      <Typography.Paragraph>Public Key: {publicKey}</Typography.Paragraph>
      <Typography.Paragraph>TEST Tokens: {tokensAmount}</Typography.Paragraph>
      <Typography.Paragraph>ETH: {ethAmount}</Typography.Paragraph>
      {isProvider ? (
        <p>
          Subscribers: {subscriberCount !== undefined ? subscriberCount : 0}
        </p>
      ) : (
        <Typography.Paragraph>
          Open Channel ID: {openChannelId}
        </Typography.Paragraph>
      )}
      {/* Mint tokens for this agent. */}
      <Button
        style={{ width: "200px" }}
        onClick={async () => {
          await mintTokens(0);
        }}
      >
        Mint TEST
      </Button>
      {/* Supply ETH to this agent. */}
      <Button
        style={{ width: "200px" }}
        onClick={async () => {
          await sendEth(0);
        }}
      >
        Supply ETH
      </Button>
      {/* Approve tokens for Payments contract spending, then deposit. */}
      <Button
        style={{ width: "200px" }}
        onClick={async () => {
          isSpendingApproved
            ? await depositTokens(1000)
            : await approveSpending(1000);
        }}
      >
        {isSpendingApproved ? "Deposit" : "Approve Spending"}
      </Button>
    </Card>
  );
}
