import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector'

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
import { Button, Input, Dropdown, Grid, Card, Image } from '@nextui-org/react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { NextUIProvider } from '@nextui-org/react';
import SemaphoreHSSArtifact from '../utils/SemaphoreHSS.json'



const StyledLabel = styled.label`
  font-weight: bold;
`;


let defaultTransaction = {
    to: '0xa238b6008Bc2FBd9E386A5d4784511980cE504Cd',
    value: ethers.utils.parseEther('0.01'),
    gasLimit: '21000',
    maxPriorityFeePerGas: ethers.utils.parseUnits('7', 'gwei'),
    maxFeePerGas: ethers.utils.parseUnits('20', 'gwei'),
    nonce: 0,
    type: 2,
    chainId: 11155111
};

const hssSepoliaAddress = '0x1841A903a1eDAF18d82D161c37068DeD1DCd539a';



export function AddSubscriber(): ReactElement {
    const injectedConnector = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42, 11155111], })

    const { chainId, account, activate, active, library } = useWeb3React<Provider>();
    const [signer, setSigner] = useState<Signer>();
    const [hssContractAddress, setHssContractAddress] = useState<string>(hssSepoliaAddress);

    const semaphoreHSSContract = new Contract(hssContractAddress, SemaphoreHSSArtifact.abi, signer);
    const [hssContract, setHssContract] = useState<Contract>(new Contract(hssContractAddress, SemaphoreHSSArtifact.abi, signer));

    const [greeting, setGreeting] = useState<string>('');


    const [rlpTx, setRlpTx] = useState<string>('');


    const [userCopied, setUserCopied] = useState(false);

    const [subscriberPublicKey, setSubscriberPublicKey] = useState('0xnull');

    useEffect((): void => {
        if (!library) {
          // setSigner(undefined);
          return;
        }
        setSigner(library.getSigner());
        // setHssContract(semaphoreHSSContract)
        // console.log('contract', hssContract)
        console.log('signer', library.getSigner())
    
      }, [library]);
    
    

    const onConnectClick = () => {
        activate(injectedConnector)
        console.log("isactive: ", active)
    }


    function handleSubscriberPublicKeyInput(event: ChangeEvent<HTMLInputElement>): void {
        event.preventDefault(); 
        setSubscriberPublicKey(event.target.value)
       
    }

    const addSubscriberKey = async() => {
        if(hssContract && signer && subscriberPublicKey){
            //validate pubkey len etc. 
            if(subscriberPublicKey.length != 32 || 34){
                const res = await semaphoreHSSContract.addSubscriberAndKey(signer.getAddress(), subscriberPublicKey)
                console.log('Pub Key added', res)
            }
          }

    }

    const getSubscriberKey = async(subscriberIndex:number) =>{
        const res = await semaphoreHSSContract.callStatic.getSubscriberKey(subscriberIndex);
        console.log(res);
    }

  

   
    // useEffect((): void => {
    //     if (!greeterContract) {
    //         return;
    //     }

    //     async function getGreeting(greeterContract: Contract): Promise<void> {
    //         const _greeting = await greeterContract.greet();

    //         if (_greeting !== greeting) {
    //             setGreeting(_greeting);
    //         }
    //     }

    //     getGreeting(greeterContract);
    // }, [greeterContract, greeting]);

    return (
        <>
            <NextUIProvider>
                <Header />
                <Grid>
                    <Grid.Container gap={2} justify="center">
                        <Card justify="center" css={{ w: "90%" }}>
                            <Card.Body justify="center">

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

                                <StyledLabel htmlFor="subscriberStatus">Semaphore Subscriber Status</StyledLabel>
                                <br />
                                <StyledLabel htmlFor="pubKey">New Subscriber Public Key</StyledLabel>
                                <br />
                                <Input
                                    css={{ w: "100%" }}
                                    id="pubKey"
                                    type="text"
                                    placeholder={subscriberPublicKey ? subscriberPublicKey : 'input subscriber public key'}
                                    onChange={handleSubscriberPublicKeyInput}
                                    style={{ fontStyle: greeting ? 'normal' : 'italic' }}
                                ></Input>
                                <br />

                                <p />


                            </Card.Body>
                                <Button
                                    disabled={!userCopied ? true : false}
                                    style={{
                                        cursor: !userCopied ? 'not-allowed' : 'pointer',
                                        borderColor: !userCopied ? 'unset' : 'blue',

                                    }}
                                    onPress={async() => { await addSubscriberKey() }}
                                >
                                    Add New Subscriber  `{'>'}`
                                </Button>
                        </Card>

                    </Grid.Container>
                </Grid>
            </NextUIProvider>
        </>
    );
}
