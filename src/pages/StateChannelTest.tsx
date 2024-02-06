import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { Contract, ethers, Signer } from "ethers";
import { ReactElement, useEffect, useState } from "react";
import { Row, Col, Typography, Button, Alert, Divider, Card } from "antd";
import { Provider } from "../utils/provider";
import { ProviderNode } from "provider-node";

import SemaphoreHSSArtifact from "../artifacts/contracts/SemaphoreHSS.sol/SemaphoreHSS.json";

const hssSepoliaAddress = "0x1841A903a1eDAF18d82D161c37068DeD1DCd539a";

type TestAgentInfo = {
  name: string;
  mnemonic: string;
};

const TEST_SUBSCRIBERS: TestAgentInfo[] = [
  {
    name: "Bob",
    mnemonic:
      "squirrel scissors title home sauce gold elephant test program coyote rain illness",
  },
];
const TEST_PROVIDER: TestAgentInfo = {
  name: "Alice",
  mnemonic:
    "you bone market foot unable demand urge shuffle core debate treat forward",
};

type Error = {
  title: string;
  desc: string;
  isError: boolean;
};

export function StateChannelTest(): ReactElement {
  const injectedConnector = new InjectedConnector({
    supportedChainIds: [11155111],
  });

  const { chainId, account, activate, active, library } =
    useWeb3React<Provider>();

  // const provider =

  // We use an injected signer for this page for the purposes of minting and setting up
  // provider and subscriber accounts.
  const [signer, setSigner] = useState<Signer>();

  const [hssContractAddress, setHssContractAddress] =
    useState<string>(hssSepoliaAddress);

  const semaphoreHSSContract = new Contract(
    hssContractAddress,
    SemaphoreHSSArtifact.abi,
    signer
  );
  const [hssContract, setHssContract] = useState<Contract>(
    new Contract(hssContractAddress, SemaphoreHSSArtifact.abi, signer)
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

  return (
    <>
      <Row>
        <Col span={7}>
          <Row>
            <Col span={28}>
              <Typography.Paragraph>Provider</Typography.Paragraph>
            </Col>
            <Col span={28}>
              <Card title={TEST_PROVIDER.name} style={{ width: 300 }}>
                <p>Address:</p>
                <p>TEST Tokens:</p>
                <p>ETH:</p>
                <p>Subscribers:</p>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={1} style={{ minHeight: "480px" }}>
          <Divider type="vertical" />
        </Col>

        <Col span={16}>
          <Row>
            <Col span={28}>
              <Typography.Paragraph>Subscribers</Typography.Paragraph>
            </Col>
            <Col span={12}>
              <Card title={TEST_SUBSCRIBERS[0].name} style={{ width: 300 }}>
                <p>Address:</p>
                <p>TEST Tokens:</p>
                <p>ETH:</p>
                <p>Subscribers:</p>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}
