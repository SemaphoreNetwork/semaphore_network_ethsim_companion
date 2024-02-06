import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { Contract, ethers, providers, Signer, Wallet } from "ethers";
import { ReactElement, useEffect, useState } from "react";
import { Row, Col, Typography, Button, Alert, Divider, Card } from "antd";
import { Provider } from "../utils/provider";
// import { ProviderNode } from "provider-node";

import SemaphoreHSSArtifact from "../artifacts/contracts/SemaphoreHSS.sol/SemaphoreHSS.json";
import { TestAgentCard } from "../components/TestAgentCard";

const hssSepoliaAddress = "0x1841A903a1eDAF18d82D161c37068DeD1DCd539a";

type TestAgentInfo = {
  name: string;
  wallet: Wallet;
  publicKey: string;
  testTokenAmount?: string;
  ethAmount?: string;
};

// Testing factors and agents.
const TEST_CHAIN_ID = 11155111;
const TEST_RPC = new providers.JsonRpcProvider(
  "https://rpc2.sepolia.org",
  TEST_CHAIN_ID
);
const TEST_SUBSCRIBERS: TestAgentInfo[] = [
  {
    name: "Bob",
    wallet: Wallet.fromMnemonic(
      "squirrel scissors title home sauce gold elephant test program coyote rain illness"
    ).connect(TEST_RPC),
    publicKey: "test",
  },
  // {
  //   name: "Joe",
  //   mnemonic:
  //     "you bone market foot unable demand urge shuffle core debate treat forward",
  // },
];
const TEST_PROVIDER = {
  name: "Alice",
  address: "0xdeadbeef",
  publicKey: "test",
  testTokenAmount: "0",
  ethAmount: "0",
};

type Error = {
  title: string;
  desc: string;
  isError: boolean;
};

// Parse errors into an object that can be used for alert system.
const parseError = (e: any): Error => {
  try {
    return { title: (e as any).code, desc: String(e), isError: true };
  } catch (ee) {
    return { title: "Error", desc: String(ee), isError: true };
  }
};

export function StateChannelTest(): ReactElement {
  const injectedConnector = new InjectedConnector({
    supportedChainIds: [TEST_CHAIN_ID],
  });

  const { chainId, account, activate, active, library } =
    useWeb3React<Provider>();

  // We use an injected signer for this page for the purposes of minting and setting up
  // provider and subscriber accounts.
  const [signer, setSigner] = useState<Signer>();

  const HSSContract = new Contract(
    SemaphoreHSSArtifact.address,
    SemaphoreHSSArtifact.abi,
    signer
  );

  const [alert, setAlert] = useState<Error>({
    title: "",
    desc: "",
    isError: false,
  });
  const resetAlert = () => setAlert({ title: "", desc: "", isError: false });

  const onClick = () => {
    activate(injectedConnector);
    console.log("isactive: ", active);
  };

  useEffect((): void => {
    if (!library) {
      // setSigner(undefined);
      return;
    }
    setSigner(library.getSigner());
    // setHssContract(semaphoreHSSContract)
    // console.log('contract', hssContract)
    console.log("signer", library.getSigner());
  }, [library]);

  // const getProviderKey = async (providerIndex: number) => {
  //   resetAlert();
  //   try {
  //     const res =
  //       await semaphoreHSSContract.callStatic.getProviderKey(providerIndex);
  //     console.log(res);
  //     setAlert({
  //       title: `Provider Key @ ${providerIndex}`,
  //       desc: res,
  //       isError: false,
  //     });
  //   } catch (e) {
  //     try {
  //       setAlert({ title: (e as any).code, desc: String(e), isError: true });
  //     } catch (ee) {
  //       console.log(ee);
  //       setAlert({ title: "Error", desc: String(ee), isError: true });
  //     }
  //   }
  // };

  // const addProviderKey = async () => {
  //   try {
  //     if (hssContract && signer) {
  //       const res = await semaphoreHSSContract.addProviderAndKey(
  //         signer.getAddress(),
  //         "0xdeadbeefabadbabedeadbeefabadbabe"
  //       );
  //       console.log("Pub Key added", res);
  //       setAlert({ title: "Pub Key added", desc: res, isError: false });
  //     }
  //   } catch (e) {
  //     try {
  //       setAlert({ title: (e as any).code, desc: String(e), isError: true });
  //     } catch (ee) {
  //       console.log(ee);
  //       setAlert({ title: "Error", desc: String(ee), isError: true });
  //     }
  //   }
  // };

  const getProviderKey = async (providerIndex: number) => {
    resetAlert();
    try {
      const res = await HSSContract.callStatic.getProviderKey(providerIndex);
      console.log(res);
      setAlert({
        title: `Provider Key @ ${providerIndex}`,
        desc: res,
        isError: false,
      });
    } catch (e) {
      setAlert(parseError(e));
    }
  };

  return (
    <>
      <Row>
        <Col span={8}>
          <Typography.Paragraph>Provider</Typography.Paragraph>
        </Col>
        <Col span={1}>
          <Divider type="vertical" />
        </Col>
        <Col span={15}>
          <Typography.Paragraph>Subscribers</Typography.Paragraph>
        </Col>
      </Row>
      <Row style={{ minHeight: "480px" }}>
        <Col span={8}>
          <Row>
            <Col span={24}>
              <TestAgentCard
                name={TEST_PROVIDER.name}
                address={TEST_PROVIDER.address}
                publicKey={TEST_PROVIDER.publicKey}
                isProvider={true}
                subscriberCount={0}
              />
            </Col>
          </Row>
        </Col>

        <Col span={1}>
          <Divider type="vertical" style={{ minHeight: "480px" }} />
        </Col>

        <Col span={15}>
          <Row>
            <Col span={12}>
              <TestAgentCard
                name={TEST_SUBSCRIBERS[0].name}
                wallet={TEST_SUBSCRIBERS[0].wallet}
                address={TEST_SUBSCRIBERS[0].wallet.address}
                publicKey={TEST_SUBSCRIBERS[0].publicKey}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}
