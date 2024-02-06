import { useWeb3React } from "@web3-react/core";
import { Contract, ethers, Signer } from "ethers";
import {
  ChangeEvent,
  MouseEvent,
  ReactElement,
  useEffect,
  useState,
} from "react";
import styled from "styled-components";
import { Provider } from "../utils/provider";
import { Button, Input, Col, Row, Divider, Card, Typography } from "antd";
import { useLocation } from "react-router-dom";

let transaction = {
  to: "0xa238b6008Bc2FBd9E386A5d4784511980cE504Cd",
  value: ethers.utils.parseEther("0.01"),
  gasLimit: "21000",
  maxPriorityFeePerGas: ethers.utils.parseUnits("5", "gwei"),
  maxFeePerGas: ethers.utils.parseUnits("20", "gwei"),
  nonce: 0,
  type: 2,
  chainId: 1,
};

function getRLPEncoding() {
  return ethers.utils.serializeTransaction(transaction);
}

function parseCardSig(derSig: string) {
  // TODO: decode dersig
  console.log(derSig);
}

export function PasteSignature(): ReactElement {
  const context = useWeb3React<Provider>();
  const { library, active } = context;

  const [signer, setSigner] = useState<Signer>();
  const [greeterContract, setGreeterContract] = useState<Contract>();
  const [greeting, setGreeting] = useState<string>("");

  const [txHash, setTxHash] = useState<string>("");
  const [rlpTx, setRlpTx] = useState<string>("");
  const [sig, setSig] = useState<string>("");

  const [recieverAddress, setReceiverAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [signerAddress, setSignerAddress] = useState<string>("");

  const location = useLocation();

  const [rlp, setRLP] = useState();

  useEffect((): void => {
    if (rlp) {
      setRLP(location.state.rlp);
    }
    console.log(location);

    setRlpTx(getRLPEncoding());
    setTxHash("hash placeholder");
    if (!library) {
      setSigner(undefined);
      return;
    }
    if (rlpTx) {
      setTxHash(ethers.utils.keccak256(rlpTx));
    }

    setSigner(library.getSigner());
  }, [library]);

  useEffect((): void => {
    if (!greeterContract) {
      return;
    }

    async function getGreeting(greeterContract: Contract): Promise<void> {
      const _greeting = await greeterContract.greet();
      if (_greeting !== greeting) {
        setGreeting(_greeting);
      }
    }

    getGreeting(greeterContract);
  }, [greeterContract, greeting]);

  function handleSigSubmit(event: MouseEvent<HTMLButtonElement>): void {
    //etherscan POST
    console.log("pasted signature", sig);
    return;
  }

  function handleAddressChange(event: ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();
    //  setReceiverAddress(event.target.value);
    transaction.to = recieverAddress;
  }

  function handleSigChange(event: ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();
    setSig(event.target.value);
  }

  return (
    <>
      <Row>
        <Col span={8}>
          <Card style={{ width: "90%", justifySelf: "center" }}>
            <div>
              <Typography.Paragraph>Signing for:</Typography.Paragraph>
              {/* <div> */}
              {signerAddress ? signerAddress : <em>{`No Sig`}</em>}
              {/* </div> */}
              {/* empty placeholder div below to provide empty first row, 3rd col div for a 2x3 grid */}
              {/* <div></div> */}
              <Typography.Paragraph>Current nonce:</Typography.Paragraph>
              {/* <div> */}
              {/* {greeting ? greeting : <em>{`<Contract not yet deployed>`}</em>} */}
              {transaction.nonce ? (
                transaction.nonce
              ) : (
                <em>{`Manual input`}</em>
              )}

              {/* </div> */}
              {/* empty placeholder div below to provide empty first row, 3rd col div for a 2x3 grid */}
              <div></div>
              <br />
              <Typography.Paragraph
              // htmlFor="txSummary"
              >
                Transaction Summary
              </Typography.Paragraph>
              <br />
              <Typography.Paragraph
              // htmlFor="pasteSig"
              >
                Paste Sig
              </Typography.Paragraph>
              <br />
              <Input
                style={{
                  fontStyle: greeting ? "normal" : "italic",
                  width: "100%",
                }}
                id="pasteSig"
                type="text"
                placeholder={amount ? amount : amount}
                onChange={handleSigChange}
              />

              <Button
                disabled={!sig ? true : false}
                style={{
                  cursor: !sig ? "not-allowed" : "pointer",
                  borderColor: !sig ? "unset" : "blue",
                }}
                onClick={handleSigSubmit}
              >
                Submit Transaction `{">"}`
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
}
