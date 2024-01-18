import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { Contract, ethers, Signer } from "ethers";
import {
  ChangeEvent,
  ReactElement,
  useEffect,
  useState,
} from "react";
import styled from "styled-components";
import { Provider } from "../utils/provider";
import { Button, Input, Row, Col, Card, Typography, Divider } from "antd";
import { ChainSelector } from "../components/ChainSelector";
import SemaphoreHSSArtifact from "../utils/SemaphoreHSS.json";

const StyledLabel = styled.label`
  font-weight: bold;
`;

const SepoliaHSSAddress = "0x1841A903a1eDAF18d82D161c37068DeD1DCd539a";

export function AddHost(): ReactElement {
  const injectedConnector = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42, 11155111],
  });

  const { chainId, account, activate, active, library } =
    useWeb3React<Provider>();
  const [signer, setSigner] = useState<Signer>();
  const [hssContractAddress, setHssContractAddress] =
    useState<string>(SepoliaHSSAddress);

  const semaphoreHSSContract = new Contract(
    hssContractAddress,
    SemaphoreHSSArtifact.abi,
    signer
  );
  const [hssContract, setHssContract] = useState<Contract>(
    new Contract(hssContractAddress, SemaphoreHSSArtifact.abi, signer)
  );



  const [userCopied, setUserCopied] = useState(false);

  const [providerPublicKey, setProviderPublicKey] = useState("0xnull");

  const parseUrlParams = function(){
    //URL query pram for ?pubkey="0xabdeadbf"
    //passes in the public key to be registered.
    const query = window.location.search;
    const urlParams = new URLSearchParams(query);
    const pubkeyParams = urlParams.get("pubk");
    pubkeyParams ? setProviderPublicKey(pubkeyParams) : setProviderPublicKey('paste provider public key here (from Semaphore HSS)')

}

  useEffect((): void => {
      parseUrlParams();
  });

  const onConnectClick = () => {
    activate(injectedConnector);
    console.log("isactive: ", active);
  };

  function handleProviderPublicKeyInput(
    event: ChangeEvent<HTMLInputElement>
  ): void {
    // TODO: Check to see if it fits proper format of a 20-byte address (0x40 chars).
    event.preventDefault();
    setProviderPublicKey(event.target.value);
  }

  const getProviderKey = async (providerIndex: number) => {
    const res =
      await semaphoreHSSContract.callStatic.getProviderKey(providerIndex);
    console.log(res);
  };

  const addProviderKey = async () => {
    if (hssContract && signer) {
      const res = await semaphoreHSSContract.addProviderAndKey(
        signer.getAddress(),
        "0xdeadbeefabadbabedeadbeefabadbabe"
      );
      console.log("Pub Key added", res);
    }
  };

  return (
    <>
      <Row>
        <Col span={24}>
          <Card style={{ minWidth: "280px", justifySelf: "center" }}>
            <Row>
              <Col span={24}>
                <StyledLabel>Connected Account:</StyledLabel>
              </Col>
              <Col span={24}>
                <Typography.Paragraph ellipsis={true}>
                  {account ? account : <em>{`None Connected`}</em>}
                </Typography.Paragraph>
              </Col>

              <Col span={24} style={{ marginBottom: "14px" }}>
                {active ? (
                  <div>✅ </div>
                ) : (
                  <Button onClick={onConnectClick}>Connect Wallet</Button>
                )}
              </Col>

              <Col span={24}>
                <ChainSelector disabled={!active} />
              </Col>

              <Divider>Host Status</Divider>

              <Col span={24} style={{ marginBottom: "14px" }}>
                <StyledLabel htmlFor="pubKey">New Host Public Key:</StyledLabel>
              </Col>

              <Col span={24} style={{ marginBottom: "14px" }}>
                <Input
                  id="pubKey"
                  type="text"
                  placeholder={
                    providerPublicKey
                      ? providerPublicKey
                      : "input new host public key"
                  }
                  onChange={handleProviderPublicKeyInput}
                  style={{
                    width: "100%",
                    fontStyle: "normal",
                  }}
                />
              </Col>

              <Col span={24}>
                <Button
                  disabled={providerPublicKey == "0xnull" ? false : true}
                  style={{
                    cursor: !userCopied ? "not-allowed" : "pointer",
                    borderColor: !userCopied ? "unset" : "blue",
                  }}
                  onClick={async () => {
                    await addProviderKey();
                  }}
                >
                  Add New Host
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  );
}
