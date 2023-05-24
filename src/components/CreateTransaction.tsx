import { useWeb3React } from '@web3-react/core';
import { Contract, ethers, Signer } from 'ethers';
import {
  ChangeEvent,
  MouseEvent,
  ReactElement,
  useEffect,
  useState
} from 'react';
import styled from 'styled-components';
import GreeterArtifact from '../artifacts/contracts/Greeter.sol/Greeter.json';
import { Provider } from '../utils/provider';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import {Buffer} from 'buffer'; 
import { Button, Input, Spacer, Grid, Card } from '@nextui-org/react';
import { Link } from 'react-router-dom';


const BB = () => <Button>Click me</Button>;

window.Buffer = window.Buffer || require("buffer").Buffer;



const gsm7 = require('gsm7')


const StyledDeployContractButton = styled.button`
  width: 180px;
  height: 2rem;
  border-radius: 1rem;
  border-color: blue;
  cursor: pointer;
  place-self: center;
`;

const StyledGreetingDiv = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
  grid-template-columns: 135px 2.7fr 1fr;
  grid-gap: 10px;
  place-self: center;
  align-items: left;
`;

const StyledLabel = styled.label`
  font-weight: bold;
`;

const StyledInput = styled.input`
  padding: 0.4rem 0.6rem;
  line-height: 2fr;
  width: auto;
`;

const StyledButton = styled.button`
  width: 150px;
  height: 2rem;
  border-radius: 1rem;
  border-color: blue;
  cursor: pointer;
`;

let transaction = {
    to: '0xa238b6008Bc2FBd9E386A5d4784511980cE504Cd',
    value: ethers.utils.parseEther('0.01'),
    gasLimit: '21000',
    maxPriorityFeePerGas: ethers.utils.parseUnits('5', 'gwei'),
    maxFeePerGas: ethers.utils.parseUnits('20', 'gwei'),
    nonce: 0,
    type: 2,
    chainId: 1
};

function getRLPEncoding(){
    return ethers.utils.serializeTransaction(transaction);
}

function parseCardSig(derSig:string){
    //decode dersig
    console.log(derSig);

    
}

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



  useEffect((): void => {
    setRlpTx(getRLPEncoding())
    const hashedTx = ethers.utils.keccak256(rlpTx);  
    setTxHash(hashedTx);
    console.log(hashedTx);
    
    if (!library) {
      setSigner(undefined);
      return;
    }
   

        

    setSigner(library.getSigner());
  }, [library, txHash]);

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
         transaction.to = recieverAddress;
      }

      function handleAmountChange(event: ChangeEvent<HTMLInputElement>): void {
        event.preventDefault();
        setAmount(event.target.value);
        transaction.value = ethers.utils.parseEther(amount);
        console.log(transaction.value);
      }
    

    

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
          {transaction.nonce ? transaction.nonce : <em>{`Manual input`}</em>}

        {/* </div> */}
        {/* empty placeholder div below to provide empty first row, 3rd col div for a 2x3 grid */}
        <div></div>
        <br/>
        <StyledLabel htmlFor="amountToken">Amount Send (ETH)</StyledLabel>
        <br/>
        <Input
          css={{ w: "100%" }}
          id="amountToken"
          type="text"
          placeholder={amount ? amount :amount}
          onChange={handleAmountChange}
          style={{ fontStyle: greeting ? 'normal' : 'italic' }}
        ></Input>
        
        <br/>

        <StyledLabel htmlFor="receiverAddress">Recepient Address:</StyledLabel>
      
        <br/>
        <Input
          css={{ w: "100%" }}
          id="receiverAddress"
          type="text"
          placeholder={transaction.to ? transaction.to : 'no to address' }
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
          onChange={()=>{return;}}
          style={{ fontStyle: greeting ? 'normal' : 'italic' }}
        ></Input>


        <CopyToClipboard text={txHash}
          onCopy={() => {}}>
          <Button>Copy</Button>
        </CopyToClipboard>
        <br/>

        <p/>
        
      

      </Card.Body>
      <Link to="/pastesig">
        <Button
          disabled={!sig ? true : false}
          style={{
            cursor: !sig ? 'not-allowed' : 'pointer',
            borderColor: !sig ? 'unset' : 'blue',
          
          }}
          onClick={handleSigSubmit}
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
