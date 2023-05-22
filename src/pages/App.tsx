import { ReactElement, ReactNode} from 'react';
import styled from 'styled-components';
import { CreateTransaction } from '../components/CreateTransaction';
import {Header} from '../components/Header'
import {NextUIProvider} from '@nextui-org/react';

import type { NextPage } from 'next';
import type { AppProps } from 'next/app';

import { Link } from 'react-router-dom';


export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};
 
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};


const StyledAppDiv = styled.div`
  display: grid;
  grid-gap: 20px;
`;

export function App(): ReactElement {
  return (
    <NextUIProvider>
      <StyledAppDiv>
        <Header/>
        <CreateTransaction/>
        <Link to="/pastesig">Next </Link> 
      </StyledAppDiv>
    </NextUIProvider>
  );
}
