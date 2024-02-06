import { useWeb3React } from "@web3-react/core";
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
// import { CopyToClipboard } from 'react-copy-to-clipboard';

import type { MenuProps } from "antd";
import {
  Row,
  Col,
  Card,
  Button,
  Input,
  Dropdown,
  Image,
  Typography,
} from "antd";

import { Link } from "react-router-dom";

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

export function CreateTransaction(): ReactElement {
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

  const [tx, setTx] = useState(defaultTransaction);
  const [userCopied, setUserCopied] = useState(false);

  const [selectedToken, setSelectedToken] = useState(new Set(["Select Token"]));
  // const setSelectedToken: (keys: Selection) => any = (keys: Selection) => {
  //   _setSelectedToken(new Set());
  // }

  const selectedValue = useMemo(
    () => Array.from(selectedToken).join(", ").replaceAll("_", " "),
    [selectedToken]
  );

  function getSignedTransaction() {
    return rlpTx + "sig";
  }

  function getRLPEncoding() {
    console.log("rlpenc", ethers.utils.serializeTransaction(tx));
    return ethers.utils.serializeTransaction(tx);
  }

  useEffect((): void => {
    setRlpTx(getRLPEncoding());

    if (!library) {
      setSigner(undefined);
      return;
    }
    if (rlpTx) {
      const hashedTx = ethers.utils.keccak256(rlpTx);
      setTxHash(hashedTx);
      console.log(hashedTx);
    }

    setSigner(library.getSigner());
  }, [library, txHash, rlpTx]);

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
    event.preventDefault();
    window.alert(sig);

    return;
  }

  function handleAddressChange(event: ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();
    //  setReceiverAddress(event.target.value);
    let t = { ...tx, to: recieverAddress };
    setTx(t);
    console.log("tx:", tx);
    setRlpTx(getRLPEncoding());
    console.log("rlp", rlpTx);
  }

  function handleAmountChange(event: ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();
    setAmount(event.target.value);
    try {
      setTx({ ...tx, value: ethers.utils.parseEther(event.target.value) });
      console.log("tx:", tx);
      setRlpTx(getRLPEncoding());

      if (rlpTx) {
        const hashedTx = ethers.utils.keccak256(rlpTx);

        setTxHash(hashedTx);
        console.log(hashedTx);

        console.log("rlp", rlpTx);
      }
    } catch (e) {
      console.log("exception");
    }
  }

  const menuItems: MenuProps["items"] = [
    {
      key: "ETH",
      label: (
        <div>
          <p>Ethereum</p>
        </div>
      ),
      icon: <Image src="eth.svg" />,
    },
    {
      key: "WETH",
      label: (
        <div>
          <p>Wrapped Ethereum</p>
        </div>
      ),
      icon: <Image src="weth.svg" />,
    },
    {
      key: "UNI",
      label: (
        <div>
          <p>Uniswap</p>
        </div>
      ),
    },
    {
      key: "WBTC",
      label: (
        <div>
          <p>Wrapped BTC</p>
        </div>
      ),
    },
  ];

  return (
    <>
      <Row>
        <Col span={24} style={{ justifyContent: "center" }}>
          <Card bordered={false} style={{ width: "90%" }}>
            <Row>
              <Col span={24}>
                <Row>
                  <Col span={24}>
                    <Typography.Paragraph strong={true}>
                      Signing for:
                    </Typography.Paragraph>
                  </Col>
                  <Col span={24}>
                    {signerAddress ? signerAddress : <em>{`No Sig`}</em>}
                    {/* empty placeholder div below to provide empty first row, 3rd col div for a 2x3 grid */}
                  </Col>
                  <Col span={24}>
                    <Typography.Paragraph strong={true}>
                      Current nonce:
                    </Typography.Paragraph>
                  </Col>
                  <Col span={24}>
                    {/* {greeting ? greeting : <em>{`<Contract not yet deployed>`}</em>} */}
                    {tx.nonce ? tx.nonce : <em>{`Manual input`}</em>}
                  </Col>
                  <div></div>
                  <br />
                  <Col span={24}>
                    <Typography.Paragraph
                      // htmlFor="amountToken"
                      strong={true}
                    >
                      Amount Send
                    </Typography.Paragraph>
                  </Col>
                  {/* empty placeholder col below to provide empty first row, 3rd col div for a 2x3 grid */}
                  <Col span={24}>
                    <Input
                      style={{
                        fontStyle: greeting ? "normal" : "italic",
                        width: "100%",
                      }}
                      id="amountToken"
                      type="text"
                      placeholder={amount ? amount : amount}
                      onChange={handleAmountChange}
                    />
                  </Col>
                </Row>
              </Col>

              <br />
              <Dropdown menu={{ items: menuItems }}>
                <Button onClick={(e) => e.preventDefault()}>
                  <Image
                    src="https://raw.githubusercontent.com/Uniswap/interface/main/src/assets/svg/ethereum_square_logo.svg"
                    height={30}
                    width={30}
                  />
                  {selectedValue}
                </Button>
                {/* <DropdownMenu
                  aria-label="Dynamic Actions"
                  items={menuItems}
                  selectedKeys={selectedToken}
                  onSelectionChange={setSelectedToken}
                  selectionMode="single"
                > */}
                {/* {(item: any) => (
                    <DropdownItem
                      key={item.key}
                      color={item.key === "delete" ? "danger" : "default"}
                    >
                      <Image src="https://raw.githubusercontent.com/Uniswap/interface/main/src/assets/svg/ethereum_square_logo.svg" height={30} width={30} />
                      {item.name}
                    </DropdownItem>
                  )}
                </DropdownMenu> */}
              </Dropdown>

              <Typography.Paragraph
                // htmlFor="receiverAddress"
                strong={true}
              >
                Recepient Address
              </Typography.Paragraph>

              <br />
              <Input
                style={{
                  fontStyle: greeting ? "normal" : "italic",
                  width: "100%",
                }}
                id="receiverAddress"
                type="text"
                placeholder={tx.to ? tx.to : "no to address"}
                onChange={handleAddressChange}
              />
              <br />

              <Typography.Paragraph
                // htmlFor="txHash"
                strong={true}
              >
                Copy This Hash
              </Typography.Paragraph>
              <br />
              <Input
                style={{
                  fontStyle: greeting ? "normal" : "italic",
                  width: "100%",
                }}
                id="txHash"
                type="text"
                placeholder={txHash ? txHash : "none"}
                onChange={() => {
                  console.log("txhash changed");
                }}
              />

              {/* onCopy ?  */}
              {/* <CopyToClipboard text={txHash}> */}
              <Button onClick={() => console.log(rlpTx)}>Copy</Button>
              {/* </CopyToClipboard> */}
              <br />

              <p />
            </Row>
            <Row>
              <Col span={24}>
                <Link to="/pastesig" state={{ rlp: rlpTx }}>
                  <Button
                    disabled={!userCopied ? true : false}
                    style={{
                      cursor: !userCopied ? "not-allowed" : "pointer",
                      borderColor: !userCopied ? "unset" : "blue",
                    }}
                    onClick={() => {
                      console.log("r", rlpTx);
                    }}
                  >
                    Ready To Submit Signature `{">"}`{sig}
                  </Button>
                </Link>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  );
}
