import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector'
import { Web3Provider } from '@ethersproject/providers'

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
import SemaphoreHSSArtifact from '../utils/SemaphoreHSS.json'


const StyledLabel = styled.label`
  font-weight: bold;
`;


const hssSepoliaAddress = '0x1841A903a1eDAF18d82D161c37068DeD1DCd539a';

export function ContractInteraction(): ReactElement {
  const injectedConnector = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42, 11155111], })

  const { chainId, account, activate, active, library } = useWeb3React<Provider>();

  const [signer, setSigner] = useState<Signer>();
  const [hssContractAddress, setHssContractAddress] = useState<string>(hssSepoliaAddress);

  const semaphoreHSSContract = new Contract(hssContractAddress, SemaphoreHSSArtifact.abi, signer);
  const [hssContract, setHssContract] = useState<Contract>(new Contract(hssContractAddress, SemaphoreHSSArtifact.abi, signer));


  const onClick = () => {
    activate(injectedConnector)
    console.log("isactive: ", active)
  }


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



  const getProviderKey = async(providerIndex:number) =>{
      const res = await semaphoreHSSContract.callStatic.getProviderKey(providerIndex);
      console.log(res);
    

  }
  const addProviderKey = async() =>{
    if(hssContract && signer){
      const res = await semaphoreHSSContract.addProviderAndKey(signer.getAddress(), '0xdeadbeefabadbabedeadbeefabadbabe')
      console.log('Pub Key added', res)
    }
  }


  return (
    <>
      <div>
      <div>ChainId: {chainId}</div>
      <div>Account: {account}</div>
      {active ? (
        <div>✅ </div>
      ) : (
        <button type="button" onClick={onClick}>
          Connect Connect
        </button>

      )}
      <button type="button" onClick={async()=>{await getProviderKey(0)}}>
        getProvider @ 0
      </button>

      <button type="button" onClick={addProviderKey}>
        addProviderKey @ 0
      </button>
    </div>
    </>)
}