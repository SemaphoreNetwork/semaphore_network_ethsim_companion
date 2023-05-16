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
  const [greeterContractAddr, setGreeterContractAddr] = useState<string>('');
  const [greeting, setGreeting] = useState<string>('');
  const [greetingInput, setGreetingInput] = useState<string>('');
  
  const [txHash, setTxHash] = useState<string>('');
  const [rlpTx, setRlpTx] = useState<string>('');
  const [sig, setSig] = useState<string>('');

  const [recieverAddress, setReceiverAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [signerAddress, setSignerAddress] = useState<string>('');



  useEffect((): void => {
    setRlpTx(getRLPEncoding())
    if (!library) {
      setSigner(undefined);
      return;
    }
    if(rlpTx){
        setTxHash(ethers.utils.keccak256(rlpTx))
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

  function handleDeployContract(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    // only deploy the Greeter contract one time, when a signer is defined
    if (greeterContract || !signer) {
      return;
    }

    async function deployGreeterContract(signer: Signer): Promise<void> {
      const Greeter = new ethers.ContractFactory(
        GreeterArtifact.abi,
        GreeterArtifact.bytecode,
        signer
      );

      try {
        const greeterContract = await Greeter.deploy('Hello, Hardhat!');

        await greeterContract.deployed();

        const greeting = await greeterContract.greet();

        setGreeterContract(greeterContract);
        setGreeting(greeting);

        window.alert(`Greeter deployed to: ${greeterContract.address}`);

        setGreeterContractAddr(greeterContract.address);
      } catch (error: any) {
        window.alert(
          'Error!' + (error && error.message ? `\n\n${error.message}` : '')
        );
      }
    }

    deployGreeterContract(signer);
  }

  function handleGreetingChange(event: ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();
    setGreetingInput(event.target.value);
  }

  function handleGreetingSubmit(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();

    if (!greeterContract) {
      window.alert('Undefined greeterContract');

      return;
    }

    if (!greetingInput) {
      window.alert('Greeting cannot be empty');
      return;
    }
}

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
    

    async function submitGreeting(greeterContract: Contract): Promise<void> {
      try {
        const setGreetingTxn = await greeterContract.setGreeting(greetingInput);

        await setGreetingTxn.wait();

        const newGreeting = await greeterContract.greet();
        window.alert(`Success!\n\nGreeting is now: ${newGreeting}`);

        if (newGreeting !== greeting) {
          setGreeting(newGreeting);
        }
      } catch (error: any) {
        window.alert(
          'Error!' + (error && error.message ? `\n\n${error.message}` : '')
        );
      }

    submitGreeting(greeterContract);
  }

  return (
    <>
      {/* <StyledDeployContractButton
        disabled={!active || greeterContract ? true : false}
        style={{
          cursor: !active || greeterContract ? 'not-allowed' : 'pointer',
          borderColor: !active || greeterContract ? 'unset' : 'blue'
        }}
        onClick={handleDeployContract}
      >
        Deploy Greeter Contract
      </StyledDeployContractButton> */}

      {/* <SectionDivider /> */}
      
      <StyledGreetingDiv>
        <StyledLabel>Signing for:</StyledLabel>
        <div>
        {signerAddress? signerAddress :<em>{`No Sig`}</em>}
        </div>
        {/* empty placeholder div below to provide empty first row, 3rd col div for a 2x3 grid */}
        <div></div>
        <StyledLabel>Current nonce:</StyledLabel>
        <div>
          {/* {greeting ? greeting : <em>{`<Contract not yet deployed>`}</em>} */}
          {transaction.nonce ? transaction.nonce : <em>{`Manual input`}</em>}

        </div>
        {/* empty placeholder div below to provide empty first row, 3rd col div for a 2x3 grid */}
        <div></div>
        <StyledLabel htmlFor="amountToken">Amount Native ETH to Send</StyledLabel>
        <StyledInput
          id="amountToken"
          type="text"
          placeholder={amount ? amount :amount}
          onChange={handleAmountChange}
          style={{ fontStyle: greeting ? 'normal' : 'italic' }}
        ></StyledInput>
        
        <br/>

        <StyledLabel htmlFor="receiverAddress">Receiver Address:</StyledLabel>
        <StyledInput
          id="receiverAddress"
          type="text"
          placeholder={transaction.to ? transaction.to : 'no to address' }
          onChange={handleAddressChange}
          style={{ fontStyle: greeting ? 'normal' : 'italic' }}
        ></StyledInput>

        <br/>
        <StyledLabel htmlFor="rawTx">RawTxn:</StyledLabel>
        <StyledInput
          id="rawTx"
          type="text"
          placeholder={getRLPEncoding()}
          onChange={()=>{setRlpTx(getRLPEncoding())
                         setTxHash(ethers.utils.keccak256(rlpTx))}}
          style={{ fontStyle: greeting ? 'normal' : 'italic' }}
        ></StyledInput>
        <br/>
        <StyledLabel htmlFor="txHash">Tx Hash to Copy</StyledLabel>

        <StyledInput
          id="txHash"
          type="text"
          placeholder={txHash? txHash : 'none'}
          onChange={()=>{return;}}
          style={{ fontStyle: greeting ? 'normal' : 'italic' }}
        ></StyledInput>


        <CopyToClipboard text={txHash}
          onCopy={() => {}}>
          <button>Copy</button>
        </CopyToClipboard>
        
        <StyledLabel htmlFor="pasteSig">Paste Signature Here:</StyledLabel>
        <StyledInput
          id="pasteSig"
          type="text"
          placeholder={sig? sig : 'none'}
          onChange={(v)=>{
            setSig(gsm7.encode(v.target.value));
            // console.log(sig)

            //setSig(gsm7.decode(Buffer.from(v.target.value, 'hex')))
            console.log(gsm7.encode(v.target.value))
        }}
          style={{ fontStyle: greeting ? 'normal' : 'italic' }}
        ></StyledInput>

        <p/>
        <StyledButton
          disabled={!sig ? true : false}
          style={{
            cursor: !sig ? 'not-allowed' : 'pointer',
            borderColor: !sig ? 'unset' : 'blue'
          }}
          onClick={handleSigSubmit}
        >
          Submit Raw To Etherscan
          {sig}
        </StyledButton>
      </StyledGreetingDiv>
    </>
  );
}
