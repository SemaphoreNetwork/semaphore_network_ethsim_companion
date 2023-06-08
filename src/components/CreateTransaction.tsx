import { useWeb3React } from '@web3-react/core';
import { Contract, ethers, Signer } from 'ethers';
import {
  ChangeEvent,
  MouseEvent,
  ReactElement,
  useEffect,
  useState,
  useMemo
} from 'react';
import styled from 'styled-components';
import { Provider } from '../utils/provider';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import { Button, Input, Dropdown, Grid, Card, Image } from '@nextui-org/react';
import { Link } from 'react-router-dom';

import eth from "../svg/ethLogo.svg";


window.Buffer = window.Buffer || require("buffer").Buffer;


const StyledLabel = styled.label`
  font-weight: bold;
`;


let defaultTransaction = {
    to: '0xa238b6008Bc2FBd9E386A5d4784511980cE504Cd',
    value: ethers.utils.parseEther('0.01'),
    gasLimit: '21000',
    maxPriorityFeePerGas: ethers.utils.parseUnits('5', 'gwei'),
    maxFeePerGas: ethers.utils.parseUnits('20', 'gwei'),
    nonce: 0,
    type: 2,
    chainId: 1
};


export function CreateTransaction(): ReactElement {
  const context = useWeb3React<Provider>();
  const { library, active } = context;

  const [signer, setSigner] = useState<Signer>();
  const [greeterContract, setGreeterContract] = useState<Contract>();
  const [greeting, setGreeting] = useState<string>('');

  
  const [txHash, setTxHash] = useState<string>('');
  const [rlpTx, setRlpTx] = useState<string>('');
  const [sig, setSig] = useState<string>('');

  const [recieverAddress, setReceiverAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [signerAddress, setSignerAddress] = useState<string>('');


  const [tx, setTx] = useState(defaultTransaction);
  const [userCopied, setUserCopied] = useState(false)

  const [selectedToken, setSelectedToken] = useState(new Set(["Select Token"]));


  const selectedValue = useMemo(
    () => Array.from(selectedToken).join(", ").replaceAll("_", " "),
    [selectedToken]
  );


  function getSignedTransaction(){
    return rlpTx + "sig"
  }

  function getRLPEncoding(){
    return ethers.utils.serializeTransaction(tx);
}

  useEffect((): void => {
    setRlpTx(getRLPEncoding())

    if (!library) {
      setSigner(undefined);
      return;
    }
    if(rlpTx){
      const hashedTx = ethers.utils.keccak256(rlpTx);  
      setTxHash(hashedTx);
      console.log(hashedTx)
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
         let t = {...tx, to: recieverAddress}
         setTx(t);
         console.log('tx:', tx)
         setRlpTx(getRLPEncoding())
         console.log('rlp', rlpTx)

      }

      function handleAmountChange(event: ChangeEvent<HTMLInputElement>): void {
        event.preventDefault();
        setAmount(event.target.value);
        try{
          setTx({...tx, value: ethers.utils.parseEther(event.target.value)});
          console.log('tx:', tx)
          setRlpTx(getRLPEncoding())

          if(rlpTx){
            const hashedTx = ethers.utils.keccak256(rlpTx); 
            
            setTxHash(hashedTx);
            console.log(hashedTx)

            console.log('rlp', rlpTx)

            
          }
          
        }catch(e){
          console.log("exception")
        }

      }
    
      const menuItems = [
        { key: "ETH", name: "Ethereum" , icon: "eth.svg"},
        { key: "WETH", name: "Wrapped Ethereum", icon: "weth.svg" },
        { key: "UNI", name: "Uniswap" },
        { key: "WBTC", name: "Wrapped BTC" },
      ];
  

  return (
    <>
    <Grid>
    <Grid.Container gap={2} justify="center">
      <Card justify="center"  css={{ w: "90%" }}>
      <Card.Body justify="center">
      {/* <Grid.Container  justify="center"  >
      <Grid
      > */}
        <StyledLabel>Signing for:</StyledLabel>
        {/* <div> */}
        {signerAddress? signerAddress :<em>{`No Sig`}</em>}
        {/* </div> */}
        {/* empty placeholder div below to provide empty first row, 3rd col div for a 2x3 grid */}
        {/* <div></div> */}
        <StyledLabel>Current nonce:</StyledLabel>
        {/* <div> */}
          {/* {greeting ? greeting : <em>{`<Contract not yet deployed>`}</em>} */}
          {tx.nonce ? tx.nonce : <em>{`Manual input`}</em>}

        {/* </div> */}
        {/* empty placeholder div below to provide empty first row, 3rd col div for a 2x3 grid */}
        <div></div>
        <br/>
        <StyledLabel htmlFor="amountToken">Amount Send</StyledLabel>
        
      
      <Input
          css={{ w: "100%" }}
          id="amountToken"
          type="text"
          placeholder={amount ? amount :amount}
          onChange={handleAmountChange}
          style={{ fontStyle: greeting ? 'normal' : 'italic' }}
        ></Input>
        
        <br/>
        <Dropdown>
          <Dropdown.Button flat
          icon={<Image src="https://raw.githubusercontent.com/Uniswap/interface/main/src/assets/svg/ethereum_square_logo.svg" height={30} width={30} />}

          >{selectedValue}</Dropdown.Button>
          <Dropdown.Menu 
                  aria-label="Dynamic Actions" 
                  items={menuItems}
                  selectedKeys={selectedToken}
                  onSelectionChange={setSelectedToken}
                  selectionMode="single"

          >
            {(item:any) => (
              <Dropdown.Item
                key={item.key}
                color={item.key === "delete" ? "error" : "default"}
                icon={<Image src="https://raw.githubusercontent.com/Uniswap/interface/main/src/assets/svg/ethereum_square_logo.svg" height={30} width={30} />}
              >
                {item.name}
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>

        <StyledLabel htmlFor="receiverAddress">Recepient Address</StyledLabel>
      
        <br/>
        <Input
          css={{ w: "100%" }}
          id="receiverAddress"
          type="text"
          placeholder={tx.to ? tx.to : 'no to address' }
          onChange={handleAddressChange}
          style={{ fontStyle: greeting ? 'normal' : 'italic' }}
        ></Input>
        <br/>
       
        <StyledLabel htmlFor="txHash">Copy This Hash</StyledLabel>
        <br/>
        <Input
              css={{ w: "100%" }}
          id="txHash"
          type="text"
          placeholder={txHash? txHash : 'none'}
          onChange={()=>{console.log("txhash changed");}}
          style={{ fontStyle: greeting ? 'normal' : 'italic' }}
        ></Input>

    {/* onCopy ?  */}
        <CopyToClipboard text={txHash}>
          <Button onPress={()=>console.log(rlpTx)}>Copy</Button>
        </CopyToClipboard>
        <br/>

        <p/>
        
      

      </Card.Body>
      <Link to="/pastesig" state={{rlp:rlpTx}}>
        <Button
          disabled={!userCopied ? true : false}
          style={{
            cursor: !userCopied ? 'not-allowed' : 'pointer',
            borderColor: !userCopied ? 'unset' : 'blue',
          
          }}
          onPress={()=>{console.log('r', rlpTx)}}
        >
          Ready To Submit Signature  `{'>'}`
          {sig}
        </Button>
      </Link>
      </Card>
   
      </Grid.Container>
      </Grid>
    </>
  );
}
