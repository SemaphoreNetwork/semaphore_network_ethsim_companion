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
import { Button, Input, Dropdown, Grid, Card, Image } from '@nextui-org/react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { NextUIProvider } from '@nextui-org/react';

import SemaphoreHSSArtifact from '../utils/SemaphoreHSS.json'


const StyledLabel = styled.label`
  font-weight: bold;
`;


const hssSepoliaAddress = '0x1841A903a1eDAF18d82D161c37068DeD1DCd539a';

export function ContractInteraction(): ReactElement {
  const injectedConnector = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42, 11155111], })

  const { chainId, account, activate, active, library } = useWeb3React<Provider>();

  const [signer, setSigner] = useState<Signer>();
  const [hssContract, setHssContract] = useState<Contract>();
  const [hssContractAddress, setHssContractAddress] = useState<string>(hssSepoliaAddress);

  const onClick = () => {
    activate(injectedConnector)
    console.log("isactive: ", active)
  }


  useEffect((): void => {
    if (!library) {
      setSigner(undefined);
      return;
    }
    setSigner(library.getSigner());
    setHssContract(new Contract(hssSepoliaAddress, SemaphoreHSSArtifact.abi, signer))

  }, [library]);

  useEffect(() => {
    console.log(signer, chainId, account, active)
    console.log(hssContract)
  },);


  const getProviderKey = async() =>{
    if(hssContract){
      const res = await hssContract.getProviderKey(0);
      console.log('Pub Key for provider @ index:', 0, res);
    }

  }
  const addProviderKey = async() =>{
    if(hssContract && signer){
      const res = await hssContract.addProviderAndKey(signer.getAddress(), '0xdeadbeefabadbabedeadbeefabadbabe')
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
      <button type="button" onClick={getProviderKey}>
        getProvider @ 0
      </button>

      <button type="button" onClick={addProviderKey}>
        addProviderKey @ 0
      </button>
    </div>
    </>)
}