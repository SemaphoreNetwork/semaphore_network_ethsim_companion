import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { Web3Provider } from "@ethersproject/providers";

import { Contract, ethers, Signer } from "ethers";
import {
  ChangeEvent,
  MouseEvent,
  ReactElement,
  useEffect,
  useState,
  useMemo,
} from "react";
import styled from "styled-components";
import { Row, Col, Typography, Button, Alert } from "antd";
import type { CollapseProps } from "antd";
import { Provider } from "../utils/provider";
import SemaphoreHSSArtifact from "../utils/SemaphoreHSS.json";

const StyledLabel = styled.label`
  font-weight: bold;
`;

const hssSepoliaAddress = "0x1841A903a1eDAF18d82D161c37068DeD1DCd539a";

type Error = {
  title: string;
  desc: string;
  isError: boolean;
};

export function ContractInteraction(): ReactElement {
  const injectedConnector = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42, 11155111],
  });

  const { chainId, account, activate, active, library } =
    useWeb3React<Provider>();

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

  const getProviderKey = async (providerIndex: number) => {
    resetAlert();
    try {
      const res =
        await semaphoreHSSContract.callStatic.getProviderKey(providerIndex);
      console.log(res);
      setAlert({
        title: `Provider Key @ ${providerIndex}`,
        desc: res,
        isError: false,
      });
    } catch (e) {
      try {
        setAlert({ title: (e as any).code, desc: String(e), isError: true });
      } catch (ee) {
        console.log(ee);
        setAlert({ title: "Error", desc: String(ee), isError: true });
      }
    }
  };

  const addProviderKey = async () => {
    try {
      if (hssContract && signer) {
        const res = await semaphoreHSSContract.addProviderAndKey(
          signer.getAddress(),
          "0xdeadbeefabadbabedeadbeefabadbabe"
        );
        console.log("Pub Key added", res);
        setAlert({ title: "Pub Key added", desc: res, isError: false });
      }
    } catch (e) {
      try {
        setAlert({ title: (e as any).code, desc: String(e), isError: true });
      } catch (ee) {
        console.log(ee);
        setAlert({ title: "Error", desc: String(ee), isError: true });
      }
    }
  };

  return (
    <>
      <Row>
        <Col span={24}>
          <Typography.Paragraph>ChainId: {chainId}</Typography.Paragraph>
        </Col>
        <Col span={24}>
          <Typography.Paragraph>Account: {account}</Typography.Paragraph>
        </Col>

        <Col span={24} style={{ marginBottom: "14px" }}>
          {active ? (
            <div style={{ height: "32px" }}>Connected ✅ </div>
          ) : (
            <Button style={{ width: "200px" }} onClick={onClick}>
              Connect
            </Button>
          )}
        </Col>

        <Col span={24} style={{ marginBottom: "14px" }}>
          <Button
            style={{ width: "200px" }}
            onClick={async () => {
              await getProviderKey(0);
            }}
          >
            getProvider @ 0
          </Button>
        </Col>

        <Col span={24} style={{ marginBottom: "14px" }}>
          <Button style={{ width: "200px" }} onClick={addProviderKey}>
            addProviderKey @ 0
          </Button>
        </Col>

        {alert.title.length === 0 ? (
          ""
        ) : (
          <Alert
            message={alert.title}
            description={alert.desc}
            type={alert.isError ? "error" : "info"}
            closable
            onClose={() => {
              resetAlert();
            }}
          />
        )}
      </Row>
    </>
  );
}
