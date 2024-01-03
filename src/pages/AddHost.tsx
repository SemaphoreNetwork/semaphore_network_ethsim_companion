import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
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
import { Provider } from "../utils/provider";
import { Button, Input, Dropdown, Row, Col, Card, Image } from "antd";
import { Link } from "react-router-dom";
import SemaphoreHSSArtifact from "../utils/SemaphoreHSS.json";

const StyledLabel = styled.label`
  font-weight: bold;
`;

let defaultTransaction = {
  to: "0xa238b6008Bc2FBd9E386A5d4784511980cE504Cd",
  value: ethers.utils.parseEther("0.01"),
  gasLimit: "21000",
  maxPriorityFeePerGas: ethers.utils.parseUnits("7", "gwei"),
  maxFeePerGas: ethers.utils.parseUnits("20", "gwei"),
  nonce: 0,
  type: 2,
  chainId: 11155111,
};

const hssSepoliaAddress = "0x1841A903a1eDAF18d82D161c37068DeD1DCd539a";

export function AddHost(): ReactElement {
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

  const [greeting, setGreeting] = useState<string>("");

  const [rlpTx, setRlpTx] = useState<string>("");
  const [sig, setSig] = useState<string>("");

  const [signerAddress, setSignerAddress] = useState<string>("");

  const [tx, setTx] = useState(defaultTransaction);
  const [userCopied, setUserCopied] = useState(false);

  const [providerPublicKey, setProviderPublicKey] = useState("0xnull");

  useEffect((): void => {
    if (!library) {
      // setSigner(undefined);
      const query = window.location.search
      const urlParams = new URLSearchParams(query)
      const publicKey = urlParams.get('pubk')
      if(publicKey)
        setProviderPublicKey(publicKey)
      return;
    }
    setSigner(library.getSigner());
    // setHssContract(semaphoreHSSContract)
    // console.log('contract', hssContract)
    console.log("signer", library.getSigner());
  }, [library]);

  const onConnectClick = () => {
    activate(injectedConnector);
    console.log("isactive: ", active);
  };

  function handleProviderPublicKeyInput(
    event: ChangeEvent<HTMLInputElement>
  ): void {
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
        <Col span={8}>
          <Card style={{ width: "90%", justifySelf: "center" }}>
            <StyledLabel>Connected Account:</StyledLabel>
            {account ? account : <em>{`None Connected`}</em>}

            <div></div>
            <br />
            {active ? (
              <div>✅ </div>
            ) : (
              <button type="button" onClick={onConnectClick}>
                Connect Wallet
              </button>
            )}

            <StyledLabel htmlFor="hostStatus">
              Semaphore Host Status
            </StyledLabel>
            <br />

            <StyledLabel htmlFor="pubKey">New Host Public Key</StyledLabel>

            <br />
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
                fontStyle: greeting ? "normal" : "italic",
              }}
            />
            <br />

            <p />
            <Button
              disabled={!userCopied ? true : false}
              style={{
                cursor: !userCopied ? "not-allowed" : "pointer",
                borderColor: !userCopied ? "unset" : "blue",
              }}
              onClick={async () => {
                await addProviderKey();
              }}
            >
              Add New Host `{">"}`{sig}
            </Button>
          </Card>
        </Col>
      </Row>
    </>
  );
}
